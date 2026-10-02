import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Check, AlertCircle, Scale, 
  Layers, ShieldAlert, FileText, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react';
import { AccuracyClass, InstrumentSpecs, ReportRecord, UserProfile } from '../../types/metrology';
import { OIML_R76_RULESET } from '../../services/rulesets';
import { generateTestPlan } from '../../services/testPlanner';
import { storageService } from '../../services/storage';

interface NewReportWizardProps {
  onNavigate: (path: string) => void;
  currentUser: UserProfile;
}

export const NewReportWizard: React.FC<NewReportWizardProps> = ({ onNavigate, currentUser }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const equipmentList = storageService.getEquipment();

  // Wizard State
  const [specs, setSpecs] = useState<InstrumentSpecs>({
    applicant: 'Avery Weigh-Tronix Global Ltd.',
    manufacturer: 'Avery Weigh-Tronix',
    model: 'BenchScale Pro 3000',
    serialNumber: `SN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    softwareId: 'ZM-FIRMWARE-V2',
    softwareVersion: 'v2.4.0',
    accuracyClass: 'III',
    verificationType: 'initial',
    maxCapacity: 15.0,
    minCapacity: 0.1,
    scaleIntervalE: 0.005,
    scaleIntervalD: 0.005,
    numberOfIntervalsN: 3000,
    unit: 'kg',
    rangeType: 'single',
    tareType: 'subtractive',
    maxTare: 15.0,
    powerSupply: '230V AC / 50Hz',
    tempMin: -10,
    tempMax: 40,
    loadReceptorShape: 'rectangular',
    loadReceptorDimensions: '350 mm × 400 mm'
  });

  const [selectedTests, setSelectedTests] = useState({
    weighingPerformance: true,
    eccentricity: true,
    repeatability: true,
    discrimination: true,
    sensitivityAndZero: true,
    tareTest: true,
  });

  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<string[]>(['EQ-WT-01', 'EQ-ENV-01']);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Calculate n = Max / e
  const calculatedN = Math.round(specs.maxCapacity / specs.scaleIntervalE);
  const classLimits = OIML_R76_RULESET.limits[specs.accuracyClass];
  const isNValid = calculatedN >= classLimits.minN && calculatedN <= classLimits.maxN;

  // Generate test plan
  const plan = generateTestPlan(specs);

  const handleStep1Validation = () => {
    const errors: string[] = [];
    if (!specs.applicant.trim()) errors.push('Applicant name is required.');
    if (!specs.model.trim()) errors.push('Instrument model is required.');
    if (!specs.serialNumber.trim()) errors.push('Serial number is required.');
    if (!isNValid) {
      errors.push(`Scale intervals n = ${calculatedN} is invalid for Class ${specs.accuracyClass}. (Allowed range: ${classLimits.minN} to ${classLimits.maxN === Infinity ? 'Unlimited' : classLimits.maxN}).`);
    }
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleStep4Validation = () => {
    const errors: string[] = [];
    // Check if any selected equipment is expired
    selectedEquipmentIds.forEach(id => {
      const eq = equipmentList.find(e => e.id === id);
      if (eq && eq.status === 'expired') {
        errors.push(`Equipment "${eq.name}" has an expired calibration certificate and cannot be used in testing.`);
      }
    });
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleCreateReport = async () => {
    const reportId = `R76-2026-0${Math.floor(100 + Math.random() * 900)}`;

    const newReport: ReportRecord = {
      id: reportId,
      version: 1,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUser.name,
      rulesetVersion: OIML_R76_RULESET.version,
      rulesetHash: OIML_R76_RULESET.hash,
      specs: {
        ...specs,
        numberOfIntervalsN: calculatedN
      },
      conditions: {
        temperatureC: 21.0,
        relativeHumidityPercent: 48.0,
        atmosphericPressureHPa: 1013.0,
        mainsVoltageV: 230.0,
        mainsFrequencyHz: 50.0,
        location: 'Legal Metrology Test Bay #1',
        testDate: new Date().toISOString().split('T')[0]
      },
      equipmentIds: selectedEquipmentIds,
      weighingPerformance: {
        status: 'in_progress',
        isPass: true,
        rows: plan.weighingLoads.map((p, idx) => ({
          id: `row-${idx + 1}`,
          direction: 'increasing',
          nominalLoad: p.nominalLoad,
          indication: p.nominalLoad,
          addedDeltaL: specs.scaleIntervalE * 0.5,
          remarks: p.description
        }))
      },
      eccentricity: {
        status: 'pending',
        isPass: true,
        loadL: plan.eccentricLoad,
        positions: [
          { id: 'pos-1', positionNumber: 1, positionName: 'Center', loadL: plan.eccentricLoad, indication: plan.eccentricLoad, addedDeltaL: specs.scaleIntervalE * 0.5 },
          { id: 'pos-2', positionNumber: 2, positionName: 'Front Left', loadL: plan.eccentricLoad, indication: plan.eccentricLoad, addedDeltaL: specs.scaleIntervalE * 0.5 },
          { id: 'pos-3', positionNumber: 3, positionName: 'Back Left', loadL: plan.eccentricLoad, indication: plan.eccentricLoad, addedDeltaL: specs.scaleIntervalE * 0.5 },
          { id: 'pos-4', positionNumber: 4, positionName: 'Back Right', loadL: plan.eccentricLoad, indication: plan.eccentricLoad, addedDeltaL: specs.scaleIntervalE * 0.5 },
          { id: 'pos-5', positionNumber: 5, positionName: 'Front Right', loadL: plan.eccentricLoad, indication: plan.eccentricLoad, addedDeltaL: specs.scaleIntervalE * 0.5 },
        ]
      },
      repeatability: {
        status: 'pending',
        isPass: true,
        halfMaxSeries: {
          loadLevel: 'half_max',
          nominalLoad: plan.repeatabilityLoadHalf,
          runs: [
            { runNumber: 1, indication: plan.repeatabilityLoadHalf, addedDeltaL: specs.scaleIntervalE * 0.5, calculatedLoadP: plan.repeatabilityLoadHalf, errorE: 0 },
            { runNumber: 2, indication: plan.repeatabilityLoadHalf, addedDeltaL: specs.scaleIntervalE * 0.5, calculatedLoadP: plan.repeatabilityLoadHalf, errorE: 0 },
            { runNumber: 3, indication: plan.repeatabilityLoadHalf, addedDeltaL: specs.scaleIntervalE * 0.5, calculatedLoadP: plan.repeatabilityLoadHalf, errorE: 0 },
          ]
        },
        maxSeries: {
          loadLevel: 'max',
          nominalLoad: plan.repeatabilityLoadMax,
          runs: [
            { runNumber: 1, indication: plan.repeatabilityLoadMax, addedDeltaL: specs.scaleIntervalE * 0.5, calculatedLoadP: plan.repeatabilityLoadMax, errorE: 0 },
            { runNumber: 2, indication: plan.repeatabilityLoadMax, addedDeltaL: specs.scaleIntervalE * 0.5, calculatedLoadP: plan.repeatabilityLoadMax, errorE: 0 },
            { runNumber: 3, indication: plan.repeatabilityLoadMax, addedDeltaL: specs.scaleIntervalE * 0.5, calculatedLoadP: plan.repeatabilityLoadMax, errorE: 0 },
          ]
        }
      },
      discrimination: {
        status: 'pending',
        isPass: true,
        tests: [
          {
            loadLevel: 'max',
            nominalLoad: specs.maxCapacity,
            initialIndication: specs.maxCapacity,
            addedDeltaLInitial: specs.scaleIntervalE * 0.5,
            calculatedP1: specs.maxCapacity,
            extraLoad14d: plan.discriminationLoad14d,
            subsequentIndication: specs.maxCapacity + specs.scaleIntervalD,
            indicationDifference: specs.scaleIntervalD,
            requiredDifference: specs.scaleIntervalD,
            isPass: true
          }
        ]
      },
      sensitivityAndZero: {
        status: 'pending',
        isPass: true,
        data: {
          initialZeroSettingRangePercent: 20,
          initialZeroRangePass: true,
          semiAutoZeroSettingRangePercent: 4,
          semiAutoZeroRangePass: true,
          zeroTrackingRateLimit: '0.5 d/s',
          zeroTrackingPass: true,
          centerOfZeroIndication: 0,
          centerOfZeroError: 0,
          centerOfZeroPass: true
        }
      },
      tareTest: {
        status: 'pending',
        isPass: true,
        data: {
          tareLoadApplied: plan.eccentricLoad,
          tareIndication: 0,
          netZeroAccuracyError: 0,
          netWeighingErrorsPass: true
        }
      },
      reviewComments: [],
      overallVerdict: 'PENDING'
    };

    storageService.saveReport(newReport);
    await storageService.addAuditLog(
      currentUser.name,
      currentUser.role,
      'REPORT_CREATED',
      `Created new draft test report ${reportId} for ${specs.model} (${specs.accuracyClass}, ${specs.maxCapacity}${specs.unit}).`,
      reportId
    );

    onNavigate(`/app/reports/${reportId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top back button & breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <button onClick={() => onNavigate('/app/dashboard')} className="hover:text-slate-800 flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>
        <span>/</span>
        <span className="text-slate-900 font-semibold">New Report Wizard</span>
      </div>

      {/* Stepper Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between text-xs font-semibold">
          {[
            { num: 1, label: 'Instrument' },
            { num: 2, label: 'Test Plan' },
            { num: 3, label: 'Load Plan' },
            { num: 4, label: 'Equipment' },
            { num: 5, label: 'Review & Create' },
          ].map((s) => (
            <div key={s.num} className="flex items-center space-x-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep === s.num
                  ? 'bg-blue-600 text-white'
                  : currentStep > s.num
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {currentStep > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={`hidden sm:inline ${currentStep === s.num ? 'text-blue-600 font-bold' : 'text-slate-600'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Error alert */}
      {validationErrors.length > 0 && (
        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-900 space-y-1">
          <div className="font-bold flex items-center space-x-1.5">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Validation Checks Failed:</span>
          </div>
          <ul className="list-disc list-inside">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Step 1: Instrument & Applicant Details */}
      {currentStep === 1 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Step 1: Applicant & Instrument Characteristics</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify instrument metadata and metrological classification per OIML R 76-1:2006.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Applicant Name</label>
              <input
                type="text"
                value={specs.applicant}
                onChange={(e) => setSpecs({ ...specs, applicant: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Manufacturer</label>
              <input
                type="text"
                value={specs.manufacturer}
                onChange={(e) => setSpecs({ ...specs, manufacturer: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Instrument Model</label>
              <input
                type="text"
                value={specs.model}
                onChange={(e) => setSpecs({ ...specs, model: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Serial Number</label>
              <input
                type="text"
                value={specs.serialNumber}
                onChange={(e) => setSpecs({ ...specs, serialNumber: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Accuracy Class</label>
              <select
                value={specs.accuracyClass}
                onChange={(e) => setSpecs({ ...specs, accuracyClass: e.target.value as AccuracyClass })}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-bold text-blue-800"
              >
                <option value="I">Class I (Special Accuracy)</option>
                <option value="II">Class II (High Accuracy)</option>
                <option value="III">Class III (Medium Accuracy)</option>
                <option value="IIII">Class IIII (Ordinary Accuracy)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Maximum Capacity (Max)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="any"
                  value={specs.maxCapacity}
                  onChange={(e) => setSpecs({ ...specs, maxCapacity: parseFloat(e.target.value) || 0 })}
                  className="flex-1 p-2.5 rounded-lg border border-slate-300 font-mono font-bold"
                />
                <select
                  value={specs.unit}
                  onChange={(e) => setSpecs({ ...specs, unit: e.target.value as any })}
                  className="w-20 p-2.5 rounded-lg border border-slate-300 font-semibold"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="mg">mg</option>
                  <option value="t">t</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Verification Interval (e)</label>
              <input
                type="number"
                step="any"
                value={specs.scaleIntervalE}
                onChange={(e) => setSpecs({ ...specs, scaleIntervalE: parseFloat(e.target.value) || 0.001 })}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Scale Interval (d)</label>
              <input
                type="number"
                step="any"
                value={specs.scaleIntervalD}
                onChange={(e) => setSpecs({ ...specs, scaleIntervalD: parseFloat(e.target.value) || 0.001 })}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
              />
            </div>
          </div>

          {/* Inline Ruleset Verification Box */}
          <div className={`p-4 rounded-xl border text-xs ${
            isNValid ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}>
            <div className="flex items-center justify-between font-bold">
              <span>Inline Ruleset Check: n = Max / e = {calculatedN} e</span>
              <span className={`px-2 py-0.5 rounded text-[10px] ${isNValid ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'}`}>
                {isNValid ? 'COMPLIANT' : 'OUT OF SPECIFICATION'}
              </span>
            </div>
            <p className="text-[11px] mt-1 text-slate-600">
              For Class {specs.accuracyClass}, OIML R 76-1 Table 3 prescribes minimum scale intervals n ≥ {classLimits.minN} and maximum n ≤ {classLimits.maxN === Infinity ? 'Unlimited' : classLimits.maxN}.
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Test Plan Selection */}
      {currentStep === 2 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Step 2: Applicable Test Procedures</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              The metrology engine automatically proposes applicable test clauses based on instrument class and specifications.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { id: 'weighingPerformance', title: 'Weighing Performance Test', clause: 'Clause 3.5.1 & A.4.4.3', desc: 'Changeover point method P = I + 0.5e - ΔL, increasing & decreasing sequences.' },
              { id: 'eccentricity', title: 'Eccentricity (Corner Load) Test', clause: 'Clause 3.6.2 & A.4.7', desc: 'Load L = Max/3 at center and 4 corners / quadrants.' },
              { id: 'repeatability', title: 'Repeatability Test', clause: 'Clause 3.6.1 & A.4.10', desc: '10 runs at 50% Max and 100% Max, checks range against absolute MPE.' },
              { id: 'discrimination', title: 'Discrimination Test', clause: 'Clause 3.8 & A.4.8', desc: 'Verification of 1.4d additional load trigger.' },
              { id: 'sensitivityAndZero', title: 'Zero-Setting & Sensitivity', clause: 'Clause 4.5', desc: 'Initial zero setting, semi-auto zero, and center-of-zero checks.' },
              { id: 'tareTest', title: 'Tare Weighing Test', clause: 'Clause 3.5.3', desc: 'Subtractive tare accuracy and net weighing compliance.' },
            ].map((t) => (
              <label key={t.id} className="p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-start space-x-3 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={(selectedTests as any)[t.id]}
                  onChange={(e) => setSelectedTests({ ...selectedTests, [t.id]: e.target.checked })}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{t.title}</span>
                    <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{t.clause}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{t.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Load Plan Generator (D4) */}
      {currentStep === 3 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Step 3: Intelligent Test Planner (MPE Coverage)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Generated load sequence covering every OIML R 76-1 MPE band transition point and standard weight pieces.
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-xs font-semibold text-slate-700">Planned Weighing Sequence ({plan.weighingLoads.length} test points):</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {plan.weighingLoads.map((l, i) => (
                <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900">{l.nominalLoad} {specs.unit}</span>
                    <span className="block text-[10px] text-slate-500 font-sans">{l.description}</span>
                  </div>
                  <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[10px] font-bold">
                    {l.mpeBandLabel}
                  </span>
                </div>
              ))}
            </div>

            {/* Weights Allocation */}
            <div className="pt-4 border-t border-slate-200">
              <div className="text-xs font-semibold text-slate-700 mb-2">Required Standard Mass Pieces for Test:</div>
              <div className="flex flex-wrap gap-2 text-xs">
                {plan.requiredStandardWeightPieces.map((p, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 rounded-lg border border-slate-200 font-mono text-slate-800">
                    {p.quantity} × {p.denomination} {p.unit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Equipment & Weights Selection (Expired blocker) */}
      {currentStep === 4 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Step 4: Traceable Standard Equipment Allocation</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select standard weight sets and calibration instruments. Expired calibration certificates are automatically blocked.
            </p>
          </div>

          <div className="space-y-3">
            {equipmentList.map((eq) => {
              const isSelected = selectedEquipmentIds.includes(eq.id);
              const isExpired = eq.status === 'expired';
              return (
                <div
                  key={eq.id}
                  onClick={() => {
                    if (isExpired) return;
                    if (isSelected) {
                      setSelectedEquipmentIds(selectedEquipmentIds.filter(id => id !== eq.id));
                    } else {
                      setSelectedEquipmentIds([...selectedEquipmentIds, eq.id]);
                    }
                  }}
                  className={`p-4 rounded-xl border transition flex items-center justify-between text-xs ${
                    isExpired
                      ? 'bg-rose-50/50 border-rose-200 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-50/70 border-blue-300 cursor-pointer'
                      : 'bg-white border-slate-200 hover:bg-slate-50 cursor-pointer'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{eq.name}</span>
                      <span className="font-mono text-[10px] text-slate-500">(S/N: {eq.serialNumber})</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Cert No: <strong className="font-mono">{eq.calibrationCertNumber}</strong> • Calibrated by: {eq.calibratedBy}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      eq.status === 'valid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : eq.status === 'due_soon'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {eq.status === 'valid' ? 'Valid' : eq.status === 'due_soon' ? 'Due Soon' : 'Blocked (Expired)'}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">Expires: {eq.expiryDate}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 5: Review & Create */}
      {currentStep === 5 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Step 5: Review Summary & Initialize Report</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirm report metadata before creating draft record in the laboratory workspace.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500">Specimen Model:</span>
              <div className="font-bold text-slate-900 mt-0.5">{specs.model} (S/N: {specs.serialNumber})</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500">Applicant:</span>
              <div className="font-bold text-slate-900 mt-0.5">{specs.applicant}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500">Classification:</span>
              <div className="font-bold text-blue-700 mt-0.5">Class {specs.accuracyClass} (Max: {specs.maxCapacity}{specs.unit}, e = {specs.scaleIntervalE}{specs.unit})</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500">Ruleset Version:</span>
              <div className="font-mono font-bold text-slate-800 mt-0.5">{OIML_R76_RULESET.version}</div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
            <p>
              Pre-flight validation passed. Report will be saved to your local workspace in <strong>Draft</strong> status. Observations can be keyed in manually, imported via CSV, or captured live via Web Serial.
            </p>
          </div>
        </div>
      )}

      {/* Stepper Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        {currentStep > 1 ? (
          <button
            onClick={() => { setValidationErrors([]); setCurrentStep(currentStep - 1); }}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs flex items-center space-x-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>
        ) : (
          <div></div>
        )}

        {currentStep < 5 ? (
          <button
            onClick={() => {
              if (currentStep === 1 && !handleStep1Validation()) return;
              if (currentStep === 4 && !handleStep4Validation()) return;
              setValidationErrors([]);
              setCurrentStep(currentStep + 1);
            }}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition"
          >
            <span>Proceed to Step {currentStep + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleCreateReport}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-600/25 transition"
          >
            <Check className="w-4 h-4" />
            <span>Create Report in Draft & Open Workspace</span>
          </button>
        )}
      </div>

    </div>
  );
};
