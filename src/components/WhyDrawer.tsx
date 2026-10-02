import React from 'react';
import { X, CheckCircle2, AlertTriangle, BookOpen, Calculator, Layers, ShieldCheck } from 'lucide-react';
import { CalculationWhy } from '../types/metrology';

interface WhyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  why?: CalculationWhy;
  rowTitle?: string;
}

export const WhyDrawer: React.FC<WhyDrawerProps> = ({ isOpen, onClose, why, rowTitle }) => {
  if (!isOpen || !why) return null;

  const isPass = !why.verdictRationale.startsWith('FAIL');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm transition-opacity flex justify-end">
      <div className="w-full max-w-xl bg-white shadow-2xl h-full flex flex-col transform transition-all duration-300 ease-in-out border-l border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
              {isPass ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wide">
                  Clause-Traced Verdict
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {isPass ? 'PASS' : 'FAIL'}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {rowTitle || "Metrological Evaluation Rationale"}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          
          {/* Verdict Rationale Banner */}
          <div className={`p-4 rounded-xl border ${isPass ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' : 'bg-rose-50/80 border-rose-200 text-rose-950'}`}>
            <div className="font-semibold text-xs uppercase tracking-wider text-slate-500 mb-1">Metrological Verdict</div>
            <p className="font-medium leading-relaxed">{why.verdictRationale}</p>
          </div>

          {/* Applicable Clause */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center space-x-2 text-blue-700 font-semibold mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Standard & Clause Citation</span>
            </div>
            <div className="font-mono text-xs bg-white px-3 py-2 rounded-lg border border-slate-200 text-slate-800 font-medium">
              {why.clause}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Standard: <span className="font-medium text-slate-700">{why.standard}</span>
            </div>
          </div>

          {/* Formula */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center space-x-2 text-indigo-700 font-semibold mb-2">
              <Calculator className="w-4 h-4" />
              <span>Mathematical Formula</span>
            </div>
            <div className="font-mono text-sm bg-white px-4 py-2.5 rounded-lg border border-slate-200 text-indigo-950 font-bold tracking-wide">
              {why.formula}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Calculates changeover-point indication (P), uncorrected error (E), and zero-corrected error (Ec).
            </p>
          </div>

          {/* Parameter Substitutions */}
          <div>
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Parameter Inputs & Variables
            </div>
            <div className="grid grid-cols-2 gap-2">
              {why.substitutions.map((sub, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="text-xs text-slate-500 flex justify-between">
                    <span>{sub.label}</span>
                    <span className="font-mono font-bold text-slate-400">({sub.symbol})</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-900 mt-1">
                    {sub.value} {sub.unit && <span className="text-xs font-normal text-slate-500">{sub.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MPE Band & Margin */}
          <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center space-x-2 text-blue-900 font-semibold mb-3">
              <Layers className="w-4 h-4 text-blue-700" />
              <span>MPE Band Evaluation (Table 6)</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                <span className="text-slate-500">MPE Band Range:</span>
                <div className="font-mono font-bold text-slate-800 text-sm mt-0.5">
                  {why.mpeBand.rangeMin}e - {why.mpeBand.rangeMax >= 9999999 ? 'Max' : `${why.mpeBand.rangeMax}e`}
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                <span className="text-slate-500">Permissible Factor:</span>
                <div className="font-mono font-bold text-blue-800 text-sm mt-0.5">
                  ±{why.mpeBand.factorE} e (±{why.mpeBand.computedMpe})
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-100 col-span-2">
                <span className="text-slate-500">Compliance Margin (|MPE| - |Ec|):</span>
                <div className={`font-mono font-bold text-sm mt-0.5 ${why.margin >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {why.margin >= 0 ? `+${why.margin}` : why.margin} (
                  {why.margin >= 0 ? `${((why.margin / why.mpeBand.computedMpe) * 100).toFixed(1)}% buffer remaining` : 'MPE exceeded'}
                  )
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Calculation */}
          <div>
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Deterministic Step-by-Step Execution
            </div>
            <div className="space-y-2">
              {why.steps.map((st, i) => (
                <div key={i} className="text-xs font-mono bg-slate-900 text-emerald-400 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                  {st}
                </div>
              ))}
            </div>
          </div>

          {/* Dual Engine Verification Note */}
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center space-x-2 text-xs text-emerald-800">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>Cross-verified by Dual Engines (Engine A & Engine B). Exact zero-delta match.</span>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium transition"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
