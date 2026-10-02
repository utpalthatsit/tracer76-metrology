export interface SerialPacket {
  raw: string;
  isStable: boolean;
  value: number;
  unit: string;
  timestamp: string;
}

export interface SerialConnectionStatus {
  isConnected: boolean;
  portName?: string;
  baudRate: number;
  isSimulated: boolean;
  lastPacket?: SerialPacket;
}

export type PacketCallback = (packet: SerialPacket) => void;

class ScaleSerialService {
  private status: SerialConnectionStatus = {
    isConnected: false,
    baudRate: 9600,
    isSimulated: false,
  };
  private callbacks: PacketCallback[] = [];
  private simulationInterval: any = null;
  private currentSimulatedWeight = 0;
  private isSimulatedStable = true;

  public getStatus(): SerialConnectionStatus {
    return { ...this.status };
  }

  public subscribe(cb: PacketCallback): () => void {
    this.callbacks.push(cb);
    return () => {
      this.callbacks = this.callbacks.filter(c => c !== cb);
    };
  }

  private notify(packet: SerialPacket) {
    this.status.lastPacket = packet;
    this.callbacks.forEach(cb => cb(packet));
  }

  public async connectHardware(): Promise<{ success: boolean; message: string }> {
    if (typeof navigator !== 'undefined' && 'serial' in navigator) {
      try {
        const nav = navigator as any;
        const port = await nav.serial.requestPort();
        await port.open({ baudRate: this.status.baudRate });
        this.status.isConnected = true;
        this.status.isSimulated = false;
        this.status.portName = "COM Port (Web Serial)";
        
        // Start reader loop
        this.readFromPort(port);
        return { success: true, message: "Connected to instrument via Web Serial." };
      } catch (err: any) {
        return { success: false, message: err.message || "Failed to open serial port." };
      }
    } else {
      return { success: false, message: "Web Serial API is not supported in this browser. Please use Google Chrome / Microsoft Edge or switch to the Metrology Simulator." };
    }
  }

  private async readFromPort(port: any) {
    const textDecoder = new TextDecoderStream();
    port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();
    let buffer = "";

    try {
      while (this.status.isConnected) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          buffer += value;
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            this.parseLine(line.trim());
          }
        }
      }
    } catch (e) {
      console.error("Serial read error", e);
    } finally {
      reader.releaseLock();
    }
  }

  private parseLine(line: string) {
    // Typical scale output format: "ST,GS,+0015.000kg" or "US,NT,+0014.995kg"
    const isStable = line.startsWith("ST");
    const match = line.match(/([+-]?\d+(\.\d+)?)\s*([a-zA-Z]+)?/);
    if (match) {
      const val = parseFloat(match[1]);
      const unit = match[3] || 'kg';
      this.notify({
        raw: line,
        isStable,
        value: val,
        unit,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  }

  public startSimulation(initialWeight: number = 0, unit: string = 'kg') {
    this.stop();
    this.status.isConnected = true;
    this.status.isSimulated = true;
    this.status.portName = "Simulated Balance (RS-232 Emulation)";
    this.currentSimulatedWeight = initialWeight;

    this.simulationInterval = setInterval(() => {
      // Add slight jitter if unstable
      const jitter = this.isSimulatedStable ? 0 : (Math.random() - 0.5) * 0.002;
      const weight = Math.round((this.currentSimulatedWeight + jitter) * 10000) / 10000;
      const packet: SerialPacket = {
        raw: `${this.isSimulatedStable ? 'ST' : 'US'},GS,+${weight.toFixed(3)}${unit}`,
        isStable: this.isSimulatedStable,
        value: weight,
        unit,
        timestamp: new Date().toLocaleTimeString()
      };
      this.notify(packet);
    }, 250);
  }

  public setSimulatedWeight(weight: number, isStable: boolean = true) {
    this.currentSimulatedWeight = weight;
    this.isSimulatedStable = isStable;
  }

  public stop() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    this.status.isConnected = false;
  }
}

export const scaleSerialService = new ScaleSerialService();

/**
 * Spreadsheet TSV / CSV parser
 */
export function parseSpreadsheetData(rawText: string): { nominalLoad: number; indication: number; addedDeltaL: number }[] {
  const rows: { nominalLoad: number; indication: number; addedDeltaL: number }[] = [];
  const lines = rawText.trim().split(/\r?\n/);

  for (const line of lines) {
    if (!line.trim()) continue;
    // Split by comma or tab or semicolon
    const parts = line.split(/[,\t;]/).map(p => p.trim());
    // Check if header row
    if (isNaN(parseFloat(parts[0]))) continue;

    const nominalLoad = parseFloat(parts[0]) || 0;
    const indication = parts.length > 1 ? parseFloat(parts[1]) || 0 : nominalLoad;
    const addedDeltaL = parts.length > 2 ? parseFloat(parts[2]) || 0 : 0;

    rows.push({
      nominalLoad,
      indication,
      addedDeltaL
    });
  }

  return rows;
}
