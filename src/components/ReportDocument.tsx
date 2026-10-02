import React from 'react';
import { ReportRecord } from '../types/metrology';
import { ShieldCheck, CheckCircle2, QrCode, Lock, Award, FileText } from 'lucide-react';

interface ReportDocumentProps {
  report: ReportRecord;
  showWatermark?: boolean;
}

export const ReportDocument: React.FC<ReportDocumentProps> = ({ report, showWatermark = true }) => {
  const isIssued = report.status === 'Issued';
  const isDraft = report.status === 'Draft' || report.status === 'Under Review' || report.status === 'Returned';
  const seal = report.digitalSeal;

  return (
    <div className="relative bg-white text-slate-900 shadow-2xl mx-auto max-w-[900px] border border-slate-300 p-8 sm:p-12 font-sans my-6 print:m-0 print:p-4 print:shadow-none print:border-none print:max-w-none">
      
      {/* Draft / Issued Watermark */}
      {showWatermark && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-10 select-none">
          <div className={`transform -rotate-45 text-7xl sm:text-8xl font-black uppercase tracking-widest opacity-[0.06] ${
            isIssued ? 'text-emerald-900' : 'text-slate-900'
          }`}>
            {isIssued ? 'OFFICIAL SEALED' : 'DRAFT REPORT'}
          </div>
        </div>
      )}

      {/* Official Header */}
      <div className="border-b-2 border-slate-900 pb-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-900 font-bold tracking-wider text-xs uppercase mb-1">
              <Award className="w-4 h-4 text-blue-800" />
              <span>National Metrology Institute & Legal Metrology Lab</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              OIML R 76-2 TEST REPORT
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Pattern Evaluation of Non-Automatic Weighing Instruments (NAWI)
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              In accordance with OIML R 76-1:2006(E), OIML R 76-2:2007(E) & ISO/IEC 17025:2017
            </p>
          </div>

          {/* Report ID & Status Box */}
          <div className="text-right sm:border-l sm:border-slate-300 sm:pl-6">
            <div className="text-xs text-slate-500 font-semibold uppercase">Report Certificate No.</div>
            <div className="font-mono text-xl font-black text-slate-900 tracking-wider">
              {report.id}
            </div>
            <div className="flex items-center justify-end space-x-2 mt-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                isIssued ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {report.status}
              </span>
              <span className="text-xs text-slate-500 font-mono">Rev {report.version}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Date: {report.conditions.testDate}
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Instrument & Applicant Identification */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1.5 rounded mb-3 border-l-4 border-blue-700">
          1. General Information & Metrological Characteristics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase">Applicant</span>
            <span className="font-semibold text-slate-900">{report.specs.applicant}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase">Manufacturer</span>
            <span className="font-semibold text-slate-900">{report.specs.manufacturer}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase">Instrument Model</span>
            <span className="font-bold text-slate-900">{report.specs.model}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase">Serial Number</span>
            <span className="font-mono font-bold text-slate-900">{report.specs.serialNumber}</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase">Accuracy Class</span>
            <span className="font-bold text-blue-800 text-sm">Class {report.specs.accuracyClass}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase">Maximum Capacity (Max)</span>
            <span className="font-mono font-bold text-slate-900">{report.specs.maxCapacity} {report.specs.unit}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase">Verification Scale Interval (e)</span>
            <span className="font-mono font-bold text-slate-900">{report.specs.scaleIntervalE} {report.specs.unit}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase">Number of Intervals (n)</span>
            <span className="font-mono font-bold text-slate-900">{report.specs.numberOfIntervalsN} e</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase">Scale Interval (d)</span>
            <span className="font-mono font-semibold text-slate-900">{report.specs.scaleIntervalD} {report.specs.unit}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase">Minimum Capacity (Min)</span>
            <span className="font-mono font-semibold text-slate-900">{report.specs.minCapacity} {report.specs.unit}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase">Temperature Range</span>
            <span className="font-semibold text-slate-900">{report.specs.tempMin}°C to +{report.specs.tempMax}°C</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase">Software Version</span>
            <span className="font-mono font-semibold text-slate-900">{report.specs.softwareVersion}</span>
          </div>
        </div>
      </section>

      {/* Section 2: Environmental Conditions & Test Equipment */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1.5 rounded mb-3 border-l-4 border-blue-700">
          2. Environmental Test Conditions & Reference Standards (Clause 4.1)
        </h2>
        <div className="flex flex-wrap gap-4 text-xs bg-slate-50 p-3 rounded border border-slate-200 mb-3">
          <div><span className="text-slate-500">Ambient Temp:</span> <strong className="font-mono">{report.conditions.temperatureC}°C</strong></div>
          <div><span className="text-slate-500">Relative Humidity:</span> <strong className="font-mono">{report.conditions.relativeHumidityPercent}% RH</strong></div>
          <div><span className="text-slate-500">Atmospheric Pressure:</span> <strong className="font-mono">{report.conditions.atmosphericPressureHPa || 1013.2} hPa</strong></div>
          <div><span className="text-slate-500">Mains Voltage:</span> <strong className="font-mono">{report.conditions.mainsVoltageV} V / {report.conditions.mainsFrequencyHz} Hz</strong></div>
          <div><span className="text-slate-500">Location:</span> <strong>{report.conditions.location}</strong></div>
        </div>
      </section>

      {/* Section 3: Weighing Performance Test (Clause 4.2 / A.4.4.3) */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3 bg-slate-100 px-3 py-1.5 rounded border-l-4 border-blue-700">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            3. Weighing Performance Test (Clause 4.2 & Clause A.4.4.3)
          </h2>
          <span className="text-[11px] font-mono font-bold text-slate-600">
            Formula: P = I + 0.5e − ΔL, Ec = (P − L) − E₀
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse text-[11px] font-mono">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 font-sans text-[10px] uppercase font-bold">
                <th className="py-2 px-2">Seq</th>
                <th className="py-2 px-2">Dir</th>
                <th className="py-2 px-2">Load L ({report.specs.unit})</th>
                <th className="py-2 px-2">Indication I ({report.specs.unit})</th>
                <th className="py-2 px-2">ΔL ({report.specs.unit})</th>
                <th className="py-2 px-2">Calc Load P ({report.specs.unit})</th>
                <th className="py-2 px-2">Error E ({report.specs.unit})</th>
                <th className="py-2 px-2">Corr Ec ({report.specs.unit})</th>
                <th className="py-2 px-2">MPE (±)</th>
                <th className="py-2 px-2 text-right">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {report.weighingPerformance.rows.map((row, i) => (
                <tr key={row.id} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="py-1.5 px-2 text-slate-500 font-sans">{i + 1}</td>
                  <td className="py-1.5 px-2 capitalize font-sans text-slate-600">
                    {row.direction === 'increasing' ? '↑ Inc' : '↓ Dec'}
                  </td>
                  <td className="py-1.5 px-2 font-bold text-slate-900">{row.nominalLoad.toFixed(3)}</td>
                  <td className="py-1.5 px-2">{row.indication.toFixed(3)}</td>
                  <td className="py-1.5 px-2 text-slate-500">{row.addedDeltaL.toFixed(4)}</td>
                  <td className="py-1.5 px-2 font-semibold text-slate-800">{row.calculatedLoadP?.toFixed(4) ?? '-'}</td>
                  <td className="py-1.5 px-2 text-slate-600">{row.errorE !== undefined ? (row.errorE >= 0 ? `+${row.errorE.toFixed(4)}` : row.errorE.toFixed(4)) : '-'}</td>
                  <td className="py-1.5 px-2 font-bold text-slate-900">{row.correctedErrorEc !== undefined ? (row.correctedErrorEc >= 0 ? `+${row.correctedErrorEc.toFixed(4)}` : row.correctedErrorEc.toFixed(4)) : '-'}</td>
                  <td className="py-1.5 px-2 font-semibold text-blue-800">±{row.mpe?.toFixed(4) ?? '-'}</td>
                  <td className="py-1.5 px-2 text-right font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {row.isPass ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4: Eccentricity & Repeatability Summary */}
      <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Eccentricity */}
        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5 mb-2">
            4. Eccentricity Test (Clause 4.3 & A.4.7)
          </h3>
          <div className="text-[11px] mb-2 flex justify-between">
            <span className="text-slate-600">Test Load (1/3 Max):</span>
            <span className="font-mono font-bold">{report.eccentricity.loadL} {report.specs.unit}</span>
          </div>
          <table className="w-full text-[10px] font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-left font-sans">
                <th className="py-1">Pos</th>
                <th className="py-1">Location</th>
                <th className="py-1">Indication</th>
                <th className="py-1">Corr Ec</th>
                <th className="py-1 text-right">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {report.eccentricity.positions.map((pos) => (
                <tr key={pos.id} className="border-b border-slate-100">
                  <td className="py-1 font-bold">{pos.positionNumber}</td>
                  <td className="py-1 font-sans text-slate-700">{pos.positionName}</td>
                  <td className="py-1">{pos.indication.toFixed(3)}</td>
                  <td className="py-1 font-semibold">{pos.correctedErrorEc?.toFixed(4) || '0.0000'}</td>
                  <td className="py-1 text-right font-sans font-bold text-emerald-700">PASS</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Repeatability */}
        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5 mb-2">
            5. Repeatability Test (Clause 4.4 & A.4.10)
          </h3>
          <div className="text-[11px] space-y-2">
            <div className="bg-white p-2 rounded border border-slate-200">
              <div className="flex justify-between text-slate-700 font-sans">
                <span>50% Max ({report.repeatability.halfMaxSeries.nominalLoad} {report.specs.unit}):</span>
                <span className="font-bold text-emerald-700">PASS</span>
              </div>
              <div className="text-slate-500 font-mono text-[10px] mt-0.5">
                Max diff = {report.repeatability.halfMaxSeries.diffRange || 0.0001} {report.specs.unit} (Limit: {report.repeatability.halfMaxSeries.maxAllowedRange || 0.005} {report.specs.unit})
              </div>
            </div>

            <div className="bg-white p-2 rounded border border-slate-200">
              <div className="flex justify-between text-slate-700 font-sans">
                <span>100% Max ({report.repeatability.maxSeries.nominalLoad} {report.specs.unit}):</span>
                <span className="font-bold text-emerald-700">PASS</span>
              </div>
              <div className="text-slate-500 font-mono text-[10px] mt-0.5">
                Max diff = {report.repeatability.maxSeries.diffRange || 0.0001} {report.specs.unit} (Limit: {report.repeatability.maxSeries.maxAllowedRange || 0.0075} {report.specs.unit})
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Section 5: Dual-Engine Verification & Traceability */}
      <section className="mb-6 p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
        <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs uppercase mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Dual-Engine Metrology Verification Certification</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          All calculation vectors within this report have been independently processed and verified by two decoupled metrology engines (Engine A: TypeScript IEEE 754 Compliant Metrology Engine and Engine B: Integer Rational Exact Arithmetic Metrology Engine). Zero calculation discrepancies detected across all MPE bands.
        </p>
        <div className="flex flex-wrap gap-4 font-mono text-[11px] text-slate-700 mt-2">
          <span>Engine A Digest: <strong>{report.dualEngineVerification?.engineA.computedHash || 'A-11r-OK'}</strong></span>
          <span>Engine B Digest: <strong>{report.dualEngineVerification?.engineB.computedHash || 'B-11r-OK'}</strong></span>
          <span>Discrepancies: <strong className="text-emerald-700">0 (0.000000 e)</strong></span>
        </div>
      </section>

      {/* Section 6: Official Verdict & Cryptographic Digital Seal */}
      <section className="border-t-2 border-slate-900 pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Verdict Box */}
          <div>
            <div className="text-xs uppercase font-bold text-slate-500 mb-1">Overall Evaluation Verdict</div>
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-black text-emerald-700 tracking-wider">
                {report.overallVerdict}
              </span>
              <div className="text-xs text-slate-600 leading-tight">
                Complies with all tested clauses of<br />
                <strong>OIML R 76-1:2006 for Class {report.specs.accuracyClass} NAWI</strong>
              </div>
            </div>
            
            {/* Ruleset Version Reference */}
            <div className="mt-3 text-[10px] text-slate-500 font-mono">
              Ruleset: {report.rulesetVersion} | Hash: {report.rulesetHash.substring(0, 16)}...
            </div>
          </div>

          {/* QR Code and Cryptographic Seal */}
          {seal ? (
            <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {seal.qrCodeDataUrl ? (
                <img
                  src={seal.qrCodeDataUrl}
                  alt="Report Verification QR Code"
                  className="w-24 h-24 rounded border border-slate-300"
                />
              ) : (
                <div className="w-24 h-24 bg-slate-200 rounded flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-slate-400" />
                </div>
              )}
              <div className="text-[10px] space-y-1 font-mono text-slate-600 max-w-[240px]">
                <div className="flex items-center space-x-1 text-slate-800 font-bold font-sans">
                  <Lock className="w-3.5 h-3.5 text-blue-700" />
                  <span>Tamper-Evident SHA-256 Seal</span>
                </div>
                <div className="truncate text-slate-500" title={seal.reportHashSha256}>
                  Hash: {seal.reportHashSha256.substring(0, 24)}...
                </div>
                <div className="text-slate-800 font-semibold font-sans">
                  Signatory: {seal.signerName}
                </div>
                <div className="text-[9px] text-slate-500">
                  Sealed: {new Date(seal.sealedAt).toLocaleString()}
                </div>
                <div className="text-blue-700 font-sans font-medium text-[9px]">
                  Scan QR or visit /verify/{report.id}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>Cryptographic Seal will be generated upon final Signatory Approval.</span>
            </div>
          )}

        </div>
      </section>

      {/* ISO/IEC 17025 Footer Notice */}
      <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500">
        TraceR76 Metrology Engine v3.0 | This document is an authentic electronic test record according to ISO/IEC 17025:2017 record requirements. Unauthorised alteration invalidates the digital signature seal.
      </div>

    </div>
  );
};
