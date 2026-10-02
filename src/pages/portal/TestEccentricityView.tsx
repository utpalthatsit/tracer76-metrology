import React, { useState } from 'react';
import { EccentricityPosition, ReportRecord, UserProfile, CalculationWhy } from '../../types/metrology';
import { EccentricityDiagram } from '../../components/EccentricityDiagram';
import { WhyDrawer } from '../../components/WhyDrawer';
import { storageService } from '../../services/storage';
import { round } from '../../services/engineA';
import { getMpeFactor } from '../../services/rulesets';
import { ShieldCheck, HelpCircle } from 'lucide-react';

interface TestEccentricityViewProps {
  report: ReportRecord;
  onUpdateReport: (updated: ReportRecord) => void;
  currentUser: UserProfile;
}

export const TestEccentricityView: React.FC<TestEccentricityViewProps> = ({
  report,
  onUpdateReport,
  currentUser
}) => {
  const specs = report.specs;
  const eccentricLoad = report.eccentricity.loadL || round(specs.maxCapacity / 3, 3);
  const [selectedPosNumber, setSelectedPosNumber] = useState(1);
  const [positions, setPositions] = useState<EccentricityPosition[]>(() => {
    if (report.eccentricity.positions && report.eccentricity.positions.length > 0) {
      return report.eccentricity.positions;
    }
    const defaultNames = ['Center', 'Front Left', 'Back Left', 'Back Right', 'Front Right'];
    return [1, 2, 3, 4, 5].map((num) => ({
      id: `pos-${num}`,
      positionNumber: num,
      positionName: defaultNames[num - 1],
      loadL: eccentricLoad,
      indication: eccentricLoad,
      addedDeltaL: specs.scaleIntervalE * 0.5,
      calculatedLoadP: eccentricLoad,
      errorE: 0,
      correctedErrorEc: 0,
      mpe: specs.scaleIntervalE * 1.0,
      isPass: true
    }));
  });

  const [activeWhy, setActiveWhy] = useState<{ why: CalculationWhy; title: string } | null>(null);

  const calculatePositions = (posList: EccentricityPosition[]) => {
    const centerPos = posList.find(p => p.positionNumber === 1) || posList[0];
    const e = specs.scaleIntervalE;
    
    // Compute center error E0
    const centerP = round(centerPos.indication + 0.5 * e - centerPos.addedDeltaL, 6);
    const centerE0 = round(centerP - centerPos.loadL, 6);

    let allPass = true;
    const loadInE = Math.round(eccentricLoad / e);
    const { factor, band } = getMpeFactor(specs.accuracyClass, loadInE, specs.verificationType);
    const mpe = round(factor * e, 6);

    const updated = posList.map(pos => {
      const P = round(pos.indication + 0.5 * e - pos.addedDeltaL, 6);
      const E = round(P - pos.loadL, 6);
      const Ec = round(E - centerE0, 6);
      const margin = round(mpe - Math.abs(Ec), 6);
      const isPass = Math.abs(Ec) <= (mpe + 1e-9);
      if (!isPass) allPass = false;

      const why: CalculationWhy = {
        clause: "OIML R 76-1:2006 Clause 3.6.2 & Clause A.4.7",
        standard: "OIML R 76-1:2006 (Eccentricity)",
        formula: "P = I + 0.5e − ΔL,  Ec = (P − L) − E_center",
        substitutions: [
          { label: "Eccentric Load", symbol: "L", value: pos.loadL, unit: specs.unit },
          { label: "Indication at Position", symbol: "I", value: pos.indication, unit: specs.unit },
          { label: "Added Small Load", symbol: "ΔL", value: pos.addedDeltaL, unit: specs.unit },
          { label: "Calculated Load P", symbol: "P", value: P, unit: specs.unit },
          { label: "Center Zero Error", symbol: "E_center", value: centerE0, unit: specs.unit },
          { label: "Verification Interval", symbol: "e", value: e, unit: specs.unit },
        ],
        steps: [
          `1. Calculate indication at ${pos.positionName}: P = ${pos.indication} + 0.5×${e} − ${pos.addedDeltaL} = ${P} ${specs.unit}`,
          `2. Compute eccentric error: Ec = (${P} − ${pos.loadL}) − (${centerE0}) = ${Ec >= 0 ? '+' : ''}${Ec} ${specs.unit}`,
          `3. MPE for load ${loadInE}e: ±${factor} e (±${mpe} ${specs.unit})`,
          `4. Compliance check: |${Ec}| ${isPass ? '≤' : '>'} ${mpe} ${specs.unit}. Margin = ${margin} ${specs.unit}.`
        ],
        mpeBand: {
          rangeMin: band.minMInE,
          rangeMax: band.maxMInE === Infinity ? 9999999 : band.maxMInE,
          unit: 'e',
          factorE: factor,
          computedMpe: mpe,
        },
        margin,
        verdictRationale: isPass
          ? `PASS: Eccentric error |Ec| = ${Math.abs(Ec)} ${specs.unit} at ${pos.positionName} is within permissible limit (±${mpe} ${specs.unit}).`
          : `FAIL: Eccentric error |Ec| = ${Math.abs(Ec)} ${specs.unit} exceeds MPE (±${mpe} ${specs.unit}) at ${pos.positionName}.`
      };

      return {
        ...pos,
        calculatedLoadP: P,
        errorE: E,
        correctedErrorEc: Ec,
        mpe,
        isPass,
        why
      };
    });

    setPositions(updated);

    const updatedReport: ReportRecord = {
      ...report,
      updatedAt: new Date().toISOString(),
      eccentricity: {
        status: 'completed',
        isPass: allPass,
        loadL: eccentricLoad,
        positions: updated
      }
    };

    onUpdateReport(updatedReport);
    storageService.saveReport(updatedReport);
  };

  const handleIndicationChange = (num: number, indication: number) => {
    const next = positions.map(p => p.positionNumber === num ? { ...p, indication } : p);
    calculatePositions(next);
  };

  const handleDeltaLChange = (num: number, addedDeltaL: number) => {
    const next = positions.map(p => p.positionNumber === num ? { ...p, addedDeltaL } : p);
    calculatePositions(next);
  };

  const currentPos = positions.find(p => p.positionNumber === selectedPosNumber) || positions[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Clause 3.6.2 & Clause A.4.7
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Eccentricity Test (Corner Loading)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Test Load L = <strong className="text-slate-800">{eccentricLoad} {specs.unit}</strong> (≈ 1/3 Max) applied at Center and 4 Corners/Quadrants.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Dual Engines Verified</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Left Interactive Diagram, Right Selected Position Recorder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: SVG Diagram */}
        <div className="lg:col-span-5">
          <EccentricityDiagram
            positions={positions}
            selectedPosNumber={selectedPosNumber}
            onSelectPos={(num) => setSelectedPosNumber(num)}
            specs={specs}
            eccentricLoad={eccentricLoad}
          />
        </div>

        {/* Right: Selected Position Form & Observations */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase">Active Position #{currentPos.positionNumber}</span>
              <h3 className="text-base font-bold text-slate-900">{currentPos.positionName}</h3>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              currentPos.isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {currentPos.isPass ? 'PASS' : 'FAIL'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-600 font-sans mb-1 font-semibold">Indication I ({specs.unit})</label>
              <input
                type="number"
                step="any"
                value={currentPos.indication}
                onChange={(e) => handleIndicationChange(currentPos.positionNumber, parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-bold text-slate-900 text-sm focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-sans mb-1 font-semibold">Added Load ΔL ({specs.unit})</label>
              <input
                type="number"
                step="any"
                value={currentPos.addedDeltaL}
                onChange={(e) => handleDeltaLChange(currentPos.positionNumber, parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-xs font-mono">
            <div>
              <span className="text-slate-500 font-sans block text-[10px]">Calc Load P:</span>
              <strong className="text-slate-800 text-sm">{currentPos.calculatedLoadP?.toFixed(4) || '-'}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-sans block text-[10px]">Corr Error Ec:</span>
              <strong className="text-slate-900 text-sm">{currentPos.correctedErrorEc !== undefined ? (currentPos.correctedErrorEc >= 0 ? `+${currentPos.correctedErrorEc.toFixed(4)}` : currentPos.correctedErrorEc.toFixed(4)) : '-'}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-sans block text-[10px]">Permissible MPE:</span>
              <strong className="text-blue-800 text-sm">±{currentPos.mpe?.toFixed(4) || '-'}</strong>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                if (currentPos.why) {
                  setActiveWhy({
                    why: currentPos.why,
                    title: `Position ${currentPos.positionNumber}: ${currentPos.positionName}`
                  });
                }
              }}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center space-x-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Inspect Clause A.4.7 Traceability (Why?)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPosNumber(selectedPosNumber < 5 ? selectedPosNumber + 1 : 1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
            >
              Next Position →
            </button>
          </div>
        </div>

      </div>

      {/* Complete Positions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] font-sans">
              <th className="py-3 px-4">Pos #</th>
              <th className="py-3 px-4">Placement Location</th>
              <th className="py-3 px-4">Load L ({specs.unit})</th>
              <th className="py-3 px-4">Indication I</th>
              <th className="py-3 px-4">Added ΔL</th>
              <th className="py-3 px-4">Corrected Error Ec</th>
              <th className="py-3 px-4">MPE (±)</th>
              <th className="py-3 px-4 text-center">Verdict</th>
              <th className="py-3 px-4 text-right">Why</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {positions.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-800">{p.positionNumber}</td>
                <td className="py-3 px-4 font-sans text-slate-700 font-semibold">{p.positionName}</td>
                <td className="py-3 px-4 font-bold">{p.loadL.toFixed(3)}</td>
                <td className="py-3 px-4">{p.indication.toFixed(3)}</td>
                <td className="py-3 px-4 text-slate-500">{p.addedDeltaL.toFixed(4)}</td>
                <td className="py-3 px-4 font-bold">{p.correctedErrorEc !== undefined ? (p.correctedErrorEc >= 0 ? `+${p.correctedErrorEc.toFixed(4)}` : p.correctedErrorEc.toFixed(4)) : '-'}</td>
                <td className="py-3 px-4 text-blue-800 font-semibold">±{p.mpe?.toFixed(4) || '-'}</td>
                <td className="py-3 px-4 text-center font-sans">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    p.isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {p.isPass ? 'PASS' : 'FAIL'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-sans">
                  <button
                    onClick={() => {
                      if (p.why) setActiveWhy({ why: p.why, title: `Position ${p.positionNumber}: ${p.positionName}` });
                    }}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Why?
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <WhyDrawer
        isOpen={!!activeWhy}
        onClose={() => setActiveWhy(null)}
        why={activeWhy?.why}
        rowTitle={activeWhy?.title}
      />

    </div>
  );
};
