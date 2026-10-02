import React from 'react';
import { 
  Scale, ShieldCheck, CheckCircle2, ArrowRight, FileSearch, Cpu, 
  Lock, CalendarCheck, Cable, Download, Sparkles, Layers, Check, 
  ExternalLink, ChevronRight, HelpCircle, FileText, Award, Building2
} from 'lucide-react';
import { OIML_R76_RULESET } from '../services/rulesets';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-white pt-16 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Top Tag */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-900 text-xs font-semibold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>OIML R 76-1:2006 & R 76-2:2007 Pattern Evaluation</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              NAWI test reports <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                you can prove.
              </span>
            </h1>

            {/* Sub-text */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Automate non-automatic weighing instrument observations, calculate changeover-point errors and MPE bands in real-time, cross-verify with dual independent calculation engines, and issue tamper-evident, cryptographically sealed R 76-2 test certificates.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('/app/dashboard')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition flex items-center justify-center space-x-2"
              >
                <span>Launch Laboratory Portal</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => onNavigate('/verify/R76-2026-0042')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-sm transition flex items-center justify-center space-x-2"
              >
                <FileSearch className="w-5 h-5 text-slate-500" />
                <span>Verify a Report</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-200/80 text-left">
              <div>
                <div className="text-2xl font-black text-slate-900">100%</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">OIML R 76-1:2006 Formulas</div>
              </div>
              <div>
                <div className="text-2xl font-black text-blue-600">Dual-Engine</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Independent Verification</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-600">SHA-256</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Tamper-Proof Digital Seal</div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">&lt; 1s</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Public QR Verification</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Problem-to-Solution Strip (Spreadsheet Pain vs Automated Flow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-xs uppercase font-bold tracking-wider text-blue-700 mb-2">Modernizing Lab Workflows</h2>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">
            From error-prone spreadsheets to sealed metrological proof
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Changeover Calculation Errors</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Spreadsheets frequently suffer from accidental cell formula overwrites, rounding flaws, and incorrect MPE band threshold lookups (500e, 2000e, Max).
            </p>
            <div className="bg-emerald-50 text-emerald-950 p-3 rounded-xl border border-emerald-200 text-xs font-medium">
              <strong className="text-emerald-800">TraceR76:</strong> Deterministic changeover equation (P = I + 0.5e - ΔL, Ec = E - E0) with automated MPE bounds and expandable "Why" audit drawers.
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Unverifiable Paper & Static PDFs</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Traditional lab PDF reports can be edited without detection, offering zero cryptographic proof or instant QR validity checks in the field.
            </p>
            <div className="bg-emerald-50 text-emerald-950 p-3 rounded-xl border border-emerald-200 text-xs font-medium">
              <strong className="text-emerald-800">TraceR76:</strong> SHA-256 canonical hash seal, digital signature, and public /verify page for instant QR mobile inspection.
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Expired Calibration Standards</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Auditors cite laboratories when test weights or multimeters used in testing have lapsed calibration certificates.
            </p>
            <div className="bg-emerald-50 text-emerald-950 p-3 rounded-xl border border-emerald-200 text-xs font-medium">
              <strong className="text-emerald-800">TraceR76:</strong> Real-time traceable standard weight registry automatically blocks submission if any linked mass standard is expired.
            </div>
          </div>

        </div>
      </section>

      {/* 3. Differentiator Cards (D1 to D6) */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Metrology Architecture</span>
            <h2 className="text-3xl font-extrabold mt-1">Six Core Differentiators</h2>
            <p className="text-slate-400 text-sm mt-2">
              Engineered specifically for legal metrology authorities, accredited testing laboratories, and scale manufacturers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* D1 */}
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 hover:border-blue-500 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-4 border border-blue-500/20">
                D1
              </div>
              <h3 className="text-base font-bold text-white mb-2">Clause-Traced Verdicts</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Every calculation row includes an interactive "Why" inspector displaying applicable standard clause (e.g. A.4.4.3), exact formula, parameter substitution, MPE band, and compliance margin.
              </p>
              <div className="text-blue-400 text-xs font-semibold flex items-center space-x-1">
                <span>View live in Test Workspace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* D2 */}
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 hover:border-blue-500 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-4 border border-emerald-500/20">
                D2
              </div>
              <h3 className="text-base font-bold text-white mb-2">Dual-Engine Calculation</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Two independently developed computation algorithms verify each test point. Reports display the "Verified by Two Engines" certificate; any mismatch strictly blocks submission.
              </p>
              <div className="text-emerald-400 text-xs font-semibold flex items-center space-x-1">
                <span>Zero-delta guarantee</span>
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* D3 */}
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 hover:border-blue-500 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold mb-4 border border-purple-500/20">
                D3
              </div>
              <h3 className="text-base font-bold text-white mb-2">Tamper-Evident Reports</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Cryptographic SHA-256 seal, simulated digital signature, PDF/A compliance, and a public verification URL with QR code allowing any inspector to verify validity in under 1 second.
              </p>
              <div className="text-purple-400 text-xs font-semibold flex items-center space-x-1">
                <span>Try /verify page</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* D4 */}
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 hover:border-blue-500 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold mb-4 border border-amber-500/20">
                D4
              </div>
              <h3 className="text-base font-bold text-white mb-2">Intelligent Test Planner</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Given instrument Class, Max, Min, e, and d, the system automatically calculates n = Max/e, generates the load sequence covering every MPE transition, and recommends required standard weight combinations.
              </p>
              <div className="text-amber-400 text-xs font-semibold flex items-center space-x-1">
                <span>Automated sequence generator</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* D5 */}
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 hover:border-blue-500 transition">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold mb-4 border border-cyan-500/20">
                D5
              </div>
              <h3 className="text-base font-bold text-white mb-2">Data Import & Live Web Serial</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Import CSV / Excel paste data across all modern browsers. On Chromium, connect directly to instrument RS-232 serial ports with stability filters and one-click observation capture.
              </p>
              <div className="text-cyan-400 text-xs font-semibold flex items-center space-x-1">
                <span>Browser-native capture</span>
                <Cable className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* D6 */}
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 hover:border-blue-500 transition">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold mb-4 border border-rose-500/20">
                D6
              </div>
              <h3 className="text-base font-bold text-white mb-2">Lab Validation Pack</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Downloadable suite of 300+ golden test vectors, ISO/IEC 17025 traceability matrix, and automated protocol verification for laboratory audits and accreditation bodies.
              </p>
              <div className="text-rose-400 text-xs font-semibold flex items-center space-x-1">
                <span>View Validation Suite</span>
                <Download className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. "How It Works" 4-Step Graphic */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Streamlined Workflow</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">
            How TraceR76 Works in 4 Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center mx-auto mb-3 text-lg border border-blue-100">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Enter Instrument</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Define Applicant, Accuracy Class (I, II, III, IIII), Max, e, d. System checks n limits in real time.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center mx-auto mb-3 text-lg border border-indigo-100">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Follow Test Plan</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Execute test loads generated for every MPE changeover point, eccentricity corners, and repeatability.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 font-bold flex items-center justify-center mx-auto mb-3 text-lg border border-purple-100">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Auto-Calculate</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Indication + ΔL automatically yields P, E, and Ec. Dual engines evaluate MPE pass/fail instantaneously.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center mx-auto mb-3 text-lg border border-emerald-100">
              4
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Seal and Verify</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Authorized Signatory seals report with SHA-256 and QR code. Verifiable on public portal worldwide.
            </p>
          </div>

        </div>
      </section>

      {/* 5. Sample Report Preview Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-800 text-blue-200 uppercase tracking-wide">
                Live Sample Report
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                Sealed OIML R 76-2 Test Certificate No. R76-2026-0042
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Inspect a real-world evaluation report for a Class III Bench Scale (Max: 15 kg, e = 5 g) featuring completed Weighing Performance, Eccentricity, Repeatability, Dual-Engine checksums, and cryptographic seal.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('/app/reports/R76-2026-0042/preview')}
                  className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Inspect Official Report Layout</span>
                </button>
                <button
                  onClick={() => onNavigate('/verify/R76-2026-0042')}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center space-x-1.5"
                >
                  <FileSearch className="w-4 h-4" />
                  <span>Test Public QR Verification</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-xs space-y-3 font-mono">
              <div className="flex justify-between border-b border-white/10 pb-2 text-slate-300 font-sans">
                <span>Specimen:</span>
                <span className="font-bold text-white">Class III (Max 15 kg, e=5g)</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2 text-slate-300 font-sans">
                <span>Ruleset:</span>
                <span className="text-blue-300">OIML-R76-1:2006</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2 text-slate-300 font-sans">
                <span>Dual Engine:</span>
                <span className="text-emerald-400 font-bold">MATCH (0.000000 e)</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2 text-slate-300 font-sans">
                <span>Digital Seal:</span>
                <span className="text-purple-300 truncate max-w-[150px]">9f83a45c213e8b09...</span>
              </div>
              <div className="flex justify-between text-slate-300 font-sans">
                <span>Final Verdict:</span>
                <span className="bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded text-[11px]">PASS</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Trust Strip & Standards Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-6">
          Standards & Accreditation Compliance
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-80 text-xs font-semibold text-slate-600">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-700" />
            <span>OIML R 76-1:2006 (E)</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-700" />
            <span>OIML R 76-2:2007 (E)</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>ISO/IEC 17025:2017</span>
          </div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-indigo-700" />
            <span>WELMEC 7.2 Guide</span>
          </div>
        </div>
      </section>

    </div>
  );
};
