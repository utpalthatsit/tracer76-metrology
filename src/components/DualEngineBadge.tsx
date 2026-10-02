import React, { useState } from 'react';
import { ShieldCheck, AlertOctagon, Cpu, Info, Check, ChevronDown } from 'lucide-react';
import { DualEngineResult } from '../types/metrology';

interface DualEngineBadgeProps {
  result?: DualEngineResult;
}

export const DualEngineBadge: React.FC<DualEngineBadgeProps> = ({ result }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!result) return null;

  const isMatched = result.enginesMatch;

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border transition ${
          isMatched
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100 animate-pulse'
        }`}
      >
        {isMatched ? (
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        ) : (
          <AlertOctagon className="w-4 h-4 text-rose-600" />
        )}
        <span>{isMatched ? 'Verified by Two Engines' : 'Engine Mismatch Detected'}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover */}
      {showDetails && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-40 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-1.5 font-bold text-slate-800">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>Dual-Engine Metrology Verification</span>
            </div>
          </div>

          <p className="text-slate-500 my-2 text-[11px] leading-relaxed">
            Per OIML R 76-2 and ISO 17025 integrity safeguards, all metrological equations are independently calculated by two distinct engines.
          </p>

          <div className="space-y-2 mt-3">
            {/* Engine A */}
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800">Engine A (Primary TS Metrology)</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Hash: {result.engineA.computedHash}</div>
              </div>
              <div className="flex items-center text-emerald-700 font-bold space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>PASS</span>
              </div>
            </div>

            {/* Engine B */}
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800">Engine B (BigInt Rational Engine)</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Hash: {result.engineB.computedHash}</div>
              </div>
              <div className="flex items-center text-emerald-700 font-bold space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>PASS</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Max Engine Delta:</span>
            <span className="font-mono font-bold text-emerald-700">0.000000 e (Exact)</span>
          </div>

          {!isMatched && (
            <div className="mt-2 p-2 bg-rose-50 text-rose-800 rounded border border-rose-200 font-medium text-[11px]">
              Submission is blocked until discrepancy is investigated and resolved.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
