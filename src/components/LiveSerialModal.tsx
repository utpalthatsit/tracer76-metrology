import React, { useState, useEffect } from 'react';
import { X, Cable, Radio, Play, Square, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { scaleSerialService, SerialPacket } from '../services/webSerialSimulator';

interface LiveSerialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInjectValue: (indication: number, deltaL: number) => void;
  nominalTargetLoad?: number;
  unit?: string;
  scaleIntervalE?: number;
}

export const LiveSerialModal: React.FC<LiveSerialModalProps> = ({
  isOpen,
  onClose,
  onInjectValue,
  nominalTargetLoad = 15.0,
  unit = 'kg',
  scaleIntervalE = 0.005
}) => {
  const [packet, setPacket] = useState<SerialPacket | null>(null);
  const [simWeight, setSimWeight] = useState(nominalTargetLoad);
  const [addedDeltaL, setAddedDeltaL] = useState(scaleIntervalE * 0.5);
  const [isStable, setIsStable] = useState(true);
  const [connectionMode, setConnectionMode] = useState<'simulator' | 'hardware'>('simulator');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    // Start simulation by default
    scaleSerialService.startSimulation(simWeight, unit);

    const unsubscribe = scaleSerialService.subscribe((p) => {
      setPacket(p);
    });

    return () => {
      unsubscribe();
      scaleSerialService.stop();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleWeightChange = (newW: number) => {
    setSimWeight(newW);
    scaleSerialService.setSimulatedWeight(newW, isStable);
  };

  const handleStabilityToggle = () => {
    const next = !isStable;
    setIsStable(next);
    scaleSerialService.setSimulatedWeight(simWeight, next);
  };

  const handleConnectHardware = async () => {
    setConnectionMode('hardware');
    const res = await scaleSerialService.connectHardware();
    setStatusMsg(res.message);
  };

  const handleInject = () => {
    if (packet) {
      onInjectValue(packet.value, addedDeltaL);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2 text-slate-800">
            <Cable className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base">Direct Instrument Capture (Web Serial API)</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Connection Source Selector */}
          <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
            <button
              onClick={() => { setConnectionMode('simulator'); scaleSerialService.startSimulation(simWeight, unit); }}
              className={`flex-1 py-1.5 rounded-md transition ${connectionMode === 'simulator' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Interactive Metrology Simulator
            </button>
            <button
              onClick={handleConnectHardware}
              className={`flex-1 py-1.5 rounded-md transition flex items-center justify-center space-x-1 ${connectionMode === 'hardware' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Connect Physical COM Port</span>
            </button>
          </div>

          {statusMsg && (
            <div className="text-xs p-2.5 rounded bg-blue-50 text-blue-800 border border-blue-200 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Scale Display Terminal */}
          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-inner flex flex-col items-center">
            <div className="w-full flex justify-between items-center text-xs text-slate-400 font-mono mb-2">
              <span className="flex items-center space-x-1">
                <span className={`w-2 h-2 rounded-full ${packet?.isStable ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                <span className="text-slate-300 font-semibold">{packet?.isStable ? 'STABLE [ST]' : 'MOTION [US]'}</span>
              </span>
              <span>GROSS WEIGHT [GS]</span>
            </div>

            <div className="font-mono text-4xl sm:text-5xl font-extrabold text-emerald-400 tracking-wider my-2">
              {packet ? packet.value.toFixed(3) : '0.000'}
              <span className="text-xl text-emerald-600 ml-2 font-normal">{unit}</span>
            </div>

            <div className="w-full text-center text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-900">
              Raw RS-232 ASCII: <span className="text-slate-300">{packet?.raw || 'Awaiting packets...'}</span>
            </div>
          </div>

          {/* Simulator Controls */}
          {connectionMode === 'simulator' && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="font-semibold text-slate-700">Simulate Scale Loading & Adjustments:</div>
              
              <div className="flex items-center justify-between space-x-2">
                <button
                  type="button"
                  onClick={() => handleWeightChange(nominalTargetLoad)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Set to Planned ({nominalTargetLoad} {unit})
                </button>
                <button
                  type="button"
                  onClick={() => handleWeightChange(0)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Zero Load (0.000)
                </button>
                <button
                  type="button"
                  onClick={handleStabilityToggle}
                  className={`px-2.5 py-1.5 rounded font-medium border ${isStable ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-amber-50 text-amber-700 border-amber-300'}`}
                >
                  {isStable ? 'Simulate Motion' : 'Make Stable'}
                </button>
              </div>

              {/* Added small load delta L */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-medium text-slate-700">Added changeover load (ΔL):</span>
                  <p className="text-[10px] text-slate-500">Small standard weight added to find changeover point (typically ≈ 0.5e)</p>
                </div>
                <input
                  type="number"
                  step="0.0001"
                  value={addedDeltaL}
                  onChange={(e) => setAddedDeltaL(parseFloat(e.target.value) || 0)}
                  className="w-24 px-2 py-1 text-sm font-mono border border-slate-300 rounded text-right"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100 font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleInject}
            disabled={!packet || !packet.isStable}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold flex items-center space-x-1.5 shadow-sm transition"
          >
            <Check className="w-4 h-4" />
            <span>Record Observation Into Row</span>
          </button>
        </div>

      </div>
    </div>
  );
};
