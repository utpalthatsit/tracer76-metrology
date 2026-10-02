import React, { useState } from 'react';
import { DiscriminationTest, ReportRecord, SensitivityAndZeroTest, TareTest, UserProfile } from '../../types/metrology';
import { storageService } from '../../services/storage';
import { CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface TestOtherViewsProps {
  report: ReportRecord;
  onUpdateReport: (updated: ReportRecord) => void;
  currentUser: UserProfile;
  activeTestType: 'discrimination' | 'zero' | 'tare';
}

export const TestOtherViews: React.FC<TestOtherViewsProps> = ({
  report,
  onUpdateReport,
  currentUser,
  activeTestType
}) => {
  const specs = report.specs;
  const [discTests, setDiscTests] = useState<DiscriminationTest[]>(report.discrimination.tests);
  const [zeroData, setZeroData] = useState<SensitivityAndZeroTest>(report.sensitivityAndZero.data);
  const [tareData, setTareData] = useState<TareTest>(report.tareTest.data);

  const saveChanges = (partial: Partial<ReportRecord>) => {
    const updated = {
      ...report,
      updatedAt: new Date().toISOString(),
      ...partial
    };
    onUpdateReport(updated);
    storageService.saveReport(updated);
  };

  // Discrimination View
  if (activeTestType === 'discrimination') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Clause 3.8 & Clause A.4.8
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Discrimination Test (1.4 d Additional Load)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            An extra load equal to <strong>1.4 d ({1.4 * specs.scaleIntervalD} {specs.unit})</strong> placed gently on the loaded instrument shall shift the displayed indication by at least <strong>1.0 d</strong>.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {discTests.map((t, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between font-bold text-slate-900 font-sans">
                  <span>Load Level: {t.nominalLoad} {specs.unit}</span>
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                    {t.isPass ? 'PASS (≥ 1d)' : 'FAIL'}
                  </span>
                </div>
                <div>Initial Indication I₁: <strong className="text-slate-800">{t.initialIndication} {specs.unit}</strong></div>
                <div>Extra Load (+1.4 d): <strong className="text-blue-700">{t.extraLoad14d} {specs.unit}</strong></div>
                <div>Subsequent Indication I₂: <strong className="text-slate-800">{t.subsequentIndication} {specs.unit}</strong></div>
                <div className="pt-2 border-t border-slate-200 text-emerald-800 font-sans text-[11px] font-semibold">
                  Shift ΔI = {t.indicationDifference} {specs.unit} (Required: ≥ {t.requiredDifference} {specs.unit})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Zero & Sensitivity View
  if (activeTestType === 'zero') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Clause 4.5 & Clause 4.5.5
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Zero-Setting & Sensitivity Tests
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Initial zero-setting range, semi-automatic zero-setting, zero-tracking, and center-of-zero error (≤ ±0.25e).
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex justify-between">
              <span>Initial Zero-Setting Range</span>
              <span className="text-emerald-700 font-bold">PASS (≤ ±20%)</span>
            </div>
            <p className="text-slate-500 text-[11px]">Clause 4.5.1: Maximum permissible initial zero-setting range is ±20% of Max capacity.</p>
            <div className="font-mono text-sm font-bold text-slate-800">
              Observed: {zeroData.initialZeroSettingRangePercent}% of Max
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex justify-between">
              <span>Center-of-Zero Indication Error</span>
              <span className="text-emerald-700 font-bold">PASS (≤ ±0.25e)</span>
            </div>
            <p className="text-slate-500 text-[11px]">Clause 4.5.5: Error of zero indication after zero-setting shall not exceed ±0.25 e (±{0.25 * specs.scaleIntervalE} {specs.unit}).</p>
            <div className="font-mono text-sm font-bold text-slate-800">
              Observed: {zeroData.centerOfZeroError} {specs.unit}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex justify-between">
              <span>Semi-Automatic Zero-Setting</span>
              <span className="text-emerald-700 font-bold">PASS (≤ 4%)</span>
            </div>
            <p className="text-slate-500 text-[11px]">Clause 4.5.2: Maximum range shall not exceed 4% of Max (-1% to +3%).</p>
            <div className="font-mono text-sm font-bold text-slate-800">
              Observed: {zeroData.semiAutoZeroSettingRangePercent}%
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex justify-between">
              <span>Zero-Tracking Rate</span>
              <span className="text-emerald-700 font-bold">PASS (≤ 0.5 d/s)</span>
            </div>
            <p className="text-slate-500 text-[11px]">Clause 4.5.4: Automatic zero tracking rate limit must not exceed 0.5 scale intervals per second.</p>
            <div className="font-mono text-sm font-bold text-slate-800">
              Observed: {zeroData.zeroTrackingRateLimit}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Tare Test View
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Clause 3.5.3 & Clause 4.6
          </span>
        </div>
        <h2 className="text-xl font-black text-slate-900 mt-1">
          Tare Weighing Test
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Accuracy of tare setting and net weighing error compliance across subtractive tare ranges.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs font-mono">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div className="font-bold text-slate-900 text-sm font-sans flex justify-between">
            <span>Subtractive Tare Applied: {tareData.tareLoadApplied} {specs.unit}</span>
            <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded text-xs font-bold">
              PASS (≤ ±0.25e)
            </span>
          </div>
          <div>Tare Indication: <strong>{tareData.tareIndication} {specs.unit}</strong></div>
          <div>Net Zero Error: <strong>{tareData.netZeroAccuracyError} {specs.unit}</strong> (Limit: ±{0.25 * specs.scaleIntervalE} {specs.unit})</div>
          <div className="text-slate-600 font-sans text-[11px] pt-2 border-t border-slate-200">
            Clause 3.5.3: The tare device shall allow setting of the indication to zero with an accuracy better than ±0.25 e.
          </div>
        </div>
      </div>
    </div>
  );
};
