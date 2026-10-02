import React, { useState } from 'react';
import { 
  Play, Plus, Trash2, FileSpreadsheet, Cable, HelpCircle, 
  CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Save
} from 'lucide-react';
import { CalculationWhy, ReportRecord, UserProfile, WeighingRow } from '../../types/metrology';
import { evaluateWeighingPerformanceEngineA } from '../../services/engineA';
import { runDualEngineVerification } from '../../services/dualEngineValidator';
import { storageService } from '../../services/storage';
import { WhyDrawer } from '../../components/WhyDrawer';
import { LiveSerialModal } from '../../components/LiveSerialModal';
import { DataImportModal } from '../../components/DataImportModal';
import { DualEngineBadge } from '../../components/DualEngineBadge';

interface TestPerformanceViewProps {
  report: ReportRecord;
  onUpdateReport: (updated: ReportRecord) => void;
  currentUser: UserProfile;
}

export const TestPerformanceView: React.FC<TestPerformanceViewProps> = ({
  report,
  onUpdateReport,
  currentUser
}) => {
  const [rows, setRows] = useState<WeighingRow[]>(() => report.weighingPerformance.rows);
  const [activeWhy, setActiveWhy] = useState<{ why: CalculationWhy; title: string } | null>(null);
  const [isSerialModalOpen, setIsSerialModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [activeRowIndexForSerial, setActiveRowIndexForSerial] = useState<number>(0);
  const [saveIndicator, setSaveIndicator] = useState('Autosaved');

  const specs = report.specs;

  // Re-evaluates rows and persists
  const recalculateAndSave = (newRows: WeighingRow[]) => {
    setSaveIndicator('Saving...');
    const evaluated = evaluateWeighingPerformanceEngineA(newRows, specs);
    setRows(evaluated.rows);

    const dualCheck = runDualEngineVerification(evaluated.rows, specs);

    const updatedReport: ReportRecord = {
      ...report,
      updatedAt: new Date().toISOString(),
      weighingPerformance: {
        status: evaluated.rows.length > 0 ? 'completed' : 'in_progress',
        isPass: evaluated.isPass,
        rows: evaluated.rows
      },
      dualEngineVerification: dualCheck
    };

    onUpdateReport(updatedReport);
    storageService.saveReport(updatedReport);
    setTimeout(() => setSaveIndicator('Autosaved (Dual Engine Verified)'), 400);
  };

  const handleCellChange = (index: number, field: 'indication' | 'addedDeltaL' | 'nominalLoad', val: number) => {
    const next = [...rows];
    next[index] = {
      ...next[index],
      [field]: val
    };
    recalculateAndSave(next);
  };

  const handleAddRow = (direction: 'increasing' | 'decreasing' = 'increasing') => {
    const lastRow = rows[rows.length - 1];
    const nextLoad = lastRow ? Math.min(specs.maxCapacity, lastRow.nominalLoad + specs.scaleIntervalE * 100) : 0;
    const newRow: WeighingRow = {
      id: `row-${Date.now()}`,
      direction,
      nominalLoad: nextLoad,
      indication: nextLoad,
      addedDeltaL: specs.scaleIntervalE * 0.5,
      remarks: 'Manual step'
    };
    recalculateAndSave([...rows, newRow]);
  };

  const handleDeleteRow = (index: number) => {
    const next = rows.filter((_, i) => i !== index);
    recalculateAndSave(next);
  };

  const handleImportParsedRows = (imported: { nominalLoad: number; indication: number; addedDeltaL: number }[]) => {
    const newRows: WeighingRow[] = imported.map((r, i) => ({
      id: `imp-${Date.now()}-${i}`,
      direction: i > imported.length / 2 ? 'decreasing' : 'increasing',
      nominalLoad: r.nominalLoad,
      indication: r.indication,
      addedDeltaL: r.addedDeltaL
    }));
    recalculateAndSave(newRows);
  };

  const handleSerialInject = (indication: number, deltaL: number) => {
    if (activeRowIndexForSerial >= 0 && activeRowIndexForSerial < rows.length) {
      const next = [...rows];
      next[activeRowIndexForSerial] = {
        ...next[activeRowIndexForSerial],
        indication,
        addedDeltaL: deltaL
      };
      recalculateAndSave(next);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Tooling */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Clause 3.5.1 & Clause A.4.4.3
            </span>
            <span className="text-xs text-slate-500 font-mono">• {saveIndicator}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Weighing Performance Test (Changeover Method)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Formula: <span className="font-mono font-bold text-slate-700">P = I + 0.5e − ΔL, E = P − L, Ec = E − E₀</span> | Class {specs.accuracyClass} NAWI
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <DualEngineBadge result={report.dualEngineVerification} />

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center space-x-1.5 shadow-sm transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Import CSV / Paste</span>
          </button>

          <button
            onClick={() => {
              setActiveRowIndexForSerial(0);
              setIsSerialModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-sm transition"
          >
            <Cable className="w-4 h-4" />
            <span>Connect Scale (Web Serial)</span>
          </button>
        </div>
      </div>

      {/* Observation Data Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider font-sans">
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Direction</th>
                <th className="py-3 px-3">Load L ({specs.unit})</th>
                <th className="py-3 px-3">Indication I ({specs.unit})</th>
                <th className="py-3 px-3">Added ΔL ({specs.unit})</th>
                <th className="py-3 px-3 font-mono">Calc Load P</th>
                <th className="py-3 px-3 font-mono">Raw Err E</th>
                <th className="py-3 px-3 font-mono">Corr Ec</th>
                <th className="py-3 px-3">MPE (±)</th>
                <th className="py-3 px-3">Margin</th>
                <th className="py-3 px-3 text-center">Verdict</th>
                <th className="py-3 px-3 text-center">Why (D1)</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {rows.map((row, idx) => {
                const isOutOfMpe = row.isPass === false;
                return (
                  <tr key={row.id} className={`hover:bg-slate-50/70 transition ${isOutOfMpe ? 'bg-rose-50/60' : ''}`}>
                    <td className="py-2.5 px-3 font-sans text-slate-400">{idx + 1}</td>
                    
                    {/* Direction */}
                    <td className="py-2.5 px-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.direction === 'increasing' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {row.direction === 'increasing' ? '↑ Inc' : '↓ Dec'}
                      </span>
                    </td>

                    {/* Load L input */}
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        step="any"
                        value={row.nominalLoad}
                        onChange={(e) => handleCellChange(idx, 'nominalLoad', parseFloat(e.target.value) || 0)}
                        className="w-20 p-1 font-mono font-bold text-slate-900 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                      />
                    </td>

                    {/* Indication I input */}
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        step="any"
                        value={row.indication}
                        onChange={(e) => handleCellChange(idx, 'indication', parseFloat(e.target.value) || 0)}
                        className="w-20 p-1 font-mono text-slate-800 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                      />
                    </td>

                    {/* Added Delta L input */}
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        step="any"
                        value={row.addedDeltaL}
                        onChange={(e) => handleCellChange(idx, 'addedDeltaL', parseFloat(e.target.value) || 0)}
                        className="w-20 p-1 font-mono text-slate-600 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                      />
                    </td>

                    {/* Computed P */}
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      {row.calculatedLoadP !== undefined ? row.calculatedLoadP.toFixed(4) : '-'}
                    </td>

                    {/* Raw Error E */}
                    <td className="py-2.5 px-3 text-slate-600">
                      {row.errorE !== undefined ? (row.errorE >= 0 ? `+${row.errorE.toFixed(4)}` : row.errorE.toFixed(4)) : '-'}
                    </td>

                    {/* Corrected Error Ec */}
                    <td className={`py-2.5 px-3 font-black ${isOutOfMpe ? 'text-rose-700' : 'text-slate-900'}`}>
                      {row.correctedErrorEc !== undefined ? (row.correctedErrorEc >= 0 ? `+${row.correctedErrorEc.toFixed(4)}` : row.correctedErrorEc.toFixed(4)) : '-'}
                    </td>

                    {/* MPE */}
                    <td className="py-2.5 px-3 font-semibold text-blue-800">
                      ±{row.mpe !== undefined ? row.mpe.toFixed(4) : '-'}
                    </td>

                    {/* Margin */}
                    <td className={`py-2.5 px-3 font-semibold ${row.margin && row.margin >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {row.margin !== undefined ? (row.margin >= 0 ? `+${row.margin.toFixed(4)}` : row.margin.toFixed(4)) : '-'}
                    </td>

                    {/* Verdict */}
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {row.isPass ? 'PASS' : 'FAIL (MPE)'}
                      </span>
                    </td>

                    {/* Why Button (D1) */}
                    <td className="py-2.5 px-3 text-center font-sans">
                      <button
                        type="button"
                        onClick={() => {
                          if (row.why) {
                            setActiveWhy({
                              why: row.why,
                              title: `Load ${row.nominalLoad} ${specs.unit} (${row.direction})`
                            });
                          }
                        }}
                        className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold border border-blue-200 transition"
                      >
                        Why?
                      </button>
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveRowIndexForSerial(idx);
                            setIsSerialModalOpen(true);
                          }}
                          title="Capture from Serial"
                          className="p-1 text-slate-400 hover:text-blue-600 rounded"
                        >
                          <Cable className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(idx)}
                          title="Delete row"
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Action Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => handleAddRow('increasing')}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-100 transition flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Increasing Load Row</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddRow('decreasing')}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-100 transition flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Decreasing Load Row</span>
            </button>
          </div>

          <div className="text-slate-500 font-sans">
            Total Observation Points: <strong>{rows.length}</strong>
          </div>
        </div>
      </div>

      {/* Why Drawer (D1) */}
      <WhyDrawer
        isOpen={!!activeWhy}
        onClose={() => setActiveWhy(null)}
        why={activeWhy?.why}
        rowTitle={activeWhy?.title}
      />

      {/* Web Serial Live Capture Modal (D5) */}
      <LiveSerialModal
        isOpen={isSerialModalOpen}
        onClose={() => setIsSerialModalOpen(false)}
        onInjectValue={handleSerialInject}
        nominalTargetLoad={rows[activeRowIndexForSerial]?.nominalLoad || 0}
        unit={specs.unit}
        scaleIntervalE={specs.scaleIntervalE}
      />

      {/* CSV / Excel Data Import Modal (D5) */}
      <DataImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportParsedRows}
        unit={specs.unit}
      />

    </div>
  );
};
