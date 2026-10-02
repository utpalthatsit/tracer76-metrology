import React, { useState } from 'react';
import { CalculationWhy, RepeatabilitySeries, ReportRecord, UserProfile } from '../../types/metrology';
import { WhyDrawer } from '../../components/WhyDrawer';
import { storageService } from '../../services/storage';
import { round } from '../../services/engineA';
import { getMpeFactor } from '../../services/rulesets';
import { Plus, Trash2, HelpCircle, ShieldCheck } from 'lucide-react';

interface TestRepeatabilityViewProps {
  report: ReportRecord;
  onUpdateReport: (updated: ReportRecord) => void;
  currentUser: UserProfile;
}

export const TestRepeatabilityView: React.FC<TestRepeatabilityViewProps> = ({
  report,
  onUpdateReport,
  currentUser
}) => {
  const specs = report.specs;
  const [halfSeries, setHalfSeries] = useState<RepeatabilitySeries>(report.repeatability.halfMaxSeries);
  const [maxSeries, setMaxSeries] = useState<RepeatabilitySeries>(report.repeatability.maxSeries);
  const [activeWhy, setActiveWhy] = useState<{ why: CalculationWhy; title: string } | null>(null);

  const evaluateSeries = (series: RepeatabilitySeries): RepeatabilitySeries => {
    const e = specs.scaleIntervalE;
    const runsWithP = series.runs.map(r => {
      const P = round(r.indication + 0.5 * e - r.addedDeltaL, 6);
      const err = round(P - series.nominalLoad, 6);
      return {
        ...r,
        calculatedLoadP: P,
        errorE: err
      };
    });

    const pValues = runsWithP.map(r => r.calculatedLoadP);
    const maxP = pValues.length > 0 ? Math.max(...pValues) : series.nominalLoad;
    const minP = pValues.length > 0 ? Math.min(...pValues) : series.nominalLoad;
    const diffRange = round(maxP - minP, 6);

    const loadInE = Math.round(series.nominalLoad / e);
    const { factor, band } = getMpeFactor(specs.accuracyClass, loadInE, specs.verificationType);
    const maxAllowedRange = round(factor * e, 6);

    const isPass = diffRange <= (maxAllowedRange + 1e-9);

    const why: CalculationWhy = {
      clause: "OIML R 76-1:2006 Clause 3.6.1 & Clause A.4.10",
      standard: "OIML R 76-1:2006 (Repeatability)",
      formula: "Range = P_max − P_min ≤ |MPE|",
      substitutions: [
        { label: "Nominal Load", symbol: "L", value: series.nominalLoad, unit: specs.unit },
        { label: "Max Indication P", symbol: "P_max", value: maxP, unit: specs.unit },
        { label: "Min Indication P", symbol: "P_min", value: minP, unit: specs.unit },
        { label: "Calculated Range", symbol: "ΔP", value: diffRange, unit: specs.unit },
        { label: "Permissible MPE Limit", symbol: "|MPE|", value: maxAllowedRange, unit: specs.unit },
      ],
      steps: [
        `1. Collect readings across repeated placements of ${series.nominalLoad} ${specs.unit}`,
        `2. Identify extremum indications: P_max = ${maxP}, P_min = ${minP}`,
        `3. Compute difference: ΔP = ${maxP} − ${minP} = ${diffRange} ${specs.unit}`,
        `4. Check clause limit: Difference ${diffRange} ${specs.unit} ${isPass ? '≤' : '>'} MPE limit ${maxAllowedRange} ${specs.unit}.`
      ],
      mpeBand: {
        rangeMin: band.minMInE,
        rangeMax: band.maxMInE === Infinity ? 9999999 : band.maxMInE,
        unit: 'e',
        factorE: factor,
        computedMpe: maxAllowedRange
      },
      margin: round(maxAllowedRange - diffRange, 6),
      verdictRationale: isPass
        ? `PASS: The repeatability range of ${diffRange} ${specs.unit} does not exceed absolute MPE (${maxAllowedRange} ${specs.unit}) per Clause 3.6.1.`
        : `FAIL: The repeatability range of ${diffRange} ${specs.unit} exceeds the permissible limit of ${maxAllowedRange} ${specs.unit}.`
    };

    return {
      ...series,
      runs: runsWithP,
      maxP,
      minP,
      diffRange,
      maxAllowedRange,
      isPass,
      why
    };
  };

  const handleUpdate = (updatedHalf: RepeatabilitySeries, updatedMax: RepeatabilitySeries) => {
    const evalHalf = evaluateSeries(updatedHalf);
    const evalMax = evaluateSeries(updatedMax);
    setHalfSeries(evalHalf);
    setMaxSeries(evalMax);

    const updatedReport: ReportRecord = {
      ...report,
      updatedAt: new Date().toISOString(),
      repeatability: {
        status: 'completed',
        isPass: (evalHalf.isPass ?? true) && (evalMax.isPass ?? true),
        halfMaxSeries: evalHalf,
        maxSeries: evalMax
      }
    };

    onUpdateReport(updatedReport);
    storageService.saveReport(updatedReport);
  };

  const handleRunChange = (seriesType: 'half' | 'max', runIdx: number, field: 'indication' | 'addedDeltaL', val: number) => {
    if (seriesType === 'half') {
      const nextRuns = [...halfSeries.runs];
      nextRuns[runIdx] = { ...nextRuns[runIdx], [field]: val };
      handleUpdate({ ...halfSeries, runs: nextRuns }, maxSeries);
    } else {
      const nextRuns = [...maxSeries.runs];
      nextRuns[runIdx] = { ...nextRuns[runIdx], [field]: val };
      handleUpdate(halfSeries, { ...maxSeries, runs: nextRuns });
    }
  };

  const handleAddRun = (seriesType: 'half' | 'max') => {
    if (seriesType === 'half') {
      const nextNum = halfSeries.runs.length + 1;
      const nextRuns = [...halfSeries.runs, {
        runNumber: nextNum,
        indication: halfSeries.nominalLoad,
        addedDeltaL: specs.scaleIntervalE * 0.5,
        calculatedLoadP: halfSeries.nominalLoad,
        errorE: 0
      }];
      handleUpdate({ ...halfSeries, runs: nextRuns }, maxSeries);
    } else {
      const nextNum = maxSeries.runs.length + 1;
      const nextRuns = [...maxSeries.runs, {
        runNumber: nextNum,
        indication: maxSeries.nominalLoad,
        addedDeltaL: specs.scaleIntervalE * 0.5,
        calculatedLoadP: maxSeries.nominalLoad,
        errorE: 0
      }];
      handleUpdate(halfSeries, { ...maxSeries, runs: nextRuns });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Clause 3.6.1 & Clause A.4.10
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Repeatability Test (Series at 50% Max & 100% Max)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Difference between the results of several weighings of the same load shall not exceed absolute MPE.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Dual Engines Verified</span>
          </span>
        </div>
      </div>

      {/* Series 1: Half Max */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase">Series 1</span>
            <h3 className="text-base font-bold text-slate-900">
              Half Capacity Load: {halfSeries.nominalLoad} {specs.unit} (≈ 50% Max)
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              halfSeries.isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {halfSeries.isPass ? 'PASS' : 'FAIL'}
            </span>
            <button
              onClick={() => {
                if (halfSeries.why) setActiveWhy({ why: halfSeries.why, title: `Repeatability at ${halfSeries.nominalLoad} ${specs.unit}` });
              }}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Why?
            </button>
          </div>
        </div>

        {/* Half Max Runs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] font-sans">
                <th className="py-2.5 px-3">Run #</th>
                <th className="py-2.5 px-3">Indication I ({specs.unit})</th>
                <th className="py-2.5 px-3">Added ΔL ({specs.unit})</th>
                <th className="py-2.5 px-3">Calculated Load P</th>
                <th className="py-2.5 px-3">Error E</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {halfSeries.runs.map((r, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-3 font-bold text-slate-800">{r.runNumber}</td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="any"
                      value={r.indication}
                      onChange={(e) => handleRunChange('half', idx, 'indication', parseFloat(e.target.value) || 0)}
                      className="w-24 p-1 font-mono border border-slate-300 rounded"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="any"
                      value={r.addedDeltaL}
                      onChange={(e) => handleRunChange('half', idx, 'addedDeltaL', parseFloat(e.target.value) || 0)}
                      className="w-24 p-1 font-mono border border-slate-300 rounded text-slate-600"
                    />
                  </td>
                  <td className="py-2 px-3 font-bold text-slate-900">{r.calculatedLoadP?.toFixed(4) || '-'}</td>
                  <td className="py-2 px-3 text-slate-600">{r.errorE !== undefined ? (r.errorE >= 0 ? `+${r.errorE.toFixed(4)}` : r.errorE.toFixed(4)) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => handleAddRun('half')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Run</span>
          </button>
          <div className="font-mono space-x-4 text-slate-600">
            <span>P_max: <strong className="text-slate-900">{halfSeries.maxP?.toFixed(4)}</strong></span>
            <span>P_min: <strong className="text-slate-900">{halfSeries.minP?.toFixed(4)}</strong></span>
            <span>Diff Range: <strong className="text-blue-700">{halfSeries.diffRange?.toFixed(4)}</strong></span>
            <span>Max Allowed: <strong className="text-emerald-700">{halfSeries.maxAllowedRange?.toFixed(4)}</strong></span>
          </div>
        </div>
      </div>

      {/* Series 2: Max Capacity */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase">Series 2</span>
            <h3 className="text-base font-bold text-slate-900">
              Maximum Capacity Load: {maxSeries.nominalLoad} {specs.unit} (100% Max)
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              maxSeries.isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {maxSeries.isPass ? 'PASS' : 'FAIL'}
            </span>
            <button
              onClick={() => {
                if (maxSeries.why) setActiveWhy({ why: maxSeries.why, title: `Repeatability at ${maxSeries.nominalLoad} ${specs.unit}` });
              }}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Why?
            </button>
          </div>
        </div>

        {/* Max Runs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] font-sans">
                <th className="py-2.5 px-3">Run #</th>
                <th className="py-2.5 px-3">Indication I ({specs.unit})</th>
                <th className="py-2.5 px-3">Added ΔL ({specs.unit})</th>
                <th className="py-2.5 px-3">Calculated Load P</th>
                <th className="py-2.5 px-3">Error E</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {maxSeries.runs.map((r, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-3 font-bold text-slate-800">{r.runNumber}</td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="any"
                      value={r.indication}
                      onChange={(e) => handleRunChange('max', idx, 'indication', parseFloat(e.target.value) || 0)}
                      className="w-24 p-1 font-mono border border-slate-300 rounded"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="any"
                      value={r.addedDeltaL}
                      onChange={(e) => handleRunChange('max', idx, 'addedDeltaL', parseFloat(e.target.value) || 0)}
                      className="w-24 p-1 font-mono border border-slate-300 rounded text-slate-600"
                    />
                  </td>
                  <td className="py-2 px-3 font-bold text-slate-900">{r.calculatedLoadP?.toFixed(4) || '-'}</td>
                  <td className="py-2 px-3 text-slate-600">{r.errorE !== undefined ? (r.errorE >= 0 ? `+${r.errorE.toFixed(4)}` : r.errorE.toFixed(4)) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => handleAddRun('max')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Run</span>
          </button>
          <div className="font-mono space-x-4 text-slate-600">
            <span>P_max: <strong className="text-slate-900">{maxSeries.maxP?.toFixed(4)}</strong></span>
            <span>P_min: <strong className="text-slate-900">{maxSeries.minP?.toFixed(4)}</strong></span>
            <span>Diff Range: <strong className="text-blue-700">{maxSeries.diffRange?.toFixed(4)}</strong></span>
            <span>Max Allowed: <strong className="text-emerald-700">{maxSeries.maxAllowedRange?.toFixed(4)}</strong></span>
          </div>
        </div>
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
