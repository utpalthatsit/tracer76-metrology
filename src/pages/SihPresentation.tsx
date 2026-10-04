import React from 'react';
import { 
  Printer, ArrowLeft, ShieldCheck, CheckCircle2, AlertOctagon, 
  Cpu, Lock, Scale, QrCode, FileText, ArrowRight, Award, 
  Layers, Check, Sparkles, Building2, ExternalLink
} from 'lucide-react';

interface SihPresentationProps {
  onNavigate: (path: string) => void;
}

export const SihPresentation: React.FC<SihPresentationProps> = ({ onNavigate }) => {
  return (
    <div className="bg-slate-900 min-h-screen py-8 px-4 font-sans text-slate-900 print:bg-white print:p-0">
      
      {/* Top Floating Control Bar */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between bg-slate-800 p-4 rounded-2xl border border-slate-700 text-white print:hidden shadow-xl">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('/')}
            className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm">Smart India Hackathon (SIH 2026) Official Idea Pitch Deck</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold uppercase">
                6 Slides • PDF Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Strictly adheres to the 6-slide SIH idea submission template format.</p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition"
        >
          <Printer className="w-4 h-4" />
          <span>Save / Print as PDF</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-12 print:space-y-0">
        
        {/* ============================================================================== */}
        {/* SLIDE 1: TITLE PAGE */}
        {/* ============================================================================== */}
        <div className="slide-card bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200 aspect-[16/9] flex flex-col justify-between relative overflow-hidden print:shadow-none print:border-none print:m-0 print:p-8 print:break-after-page print:h-screen">
          {/* SIH Header Banner */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                SIH
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  SMART INDIA HACKATHON 2026
                </h2>
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
                  Idea Submission • Official Pitch Deck
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Slide 1 of 6</span>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                TITLE PAGE
              </span>
            </div>
          </div>

          {/* Main Title Content */}
          <div className="my-auto py-6 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider">
              <Scale className="w-4 h-4 text-blue-600" />
              <span>Smart Automation & Legal Metrology Standards</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              TraceR76: Automated NAWI Metrological Evaluation & Tamper-Evident Test Report Platform
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-3xl leading-relaxed">
              Dual-Engine Calculation, Real-Time Changeover Error Modeling, and Cryptographic SHA-256 Sealing for Legal Metrology Laboratories (OIML R 76-1:2006 / OIML R 76-2:2007 / ISO/IEC 17025).
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-xs bg-slate-50 p-4 rounded-2xl">
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Problem Statement ID:</span>
              <strong className="text-slate-900 font-mono">SIH2026-LM01</strong>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Category:</span>
              <strong className="text-blue-700">Software + IoT (Web Serial API)</strong>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Theme:</span>
              <strong className="text-slate-900">Digital Governance & Metrology</strong>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Team Name:</span>
              <strong className="text-slate-900">[Your Registered Team Name]</strong>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Team ID:</span>
              <strong className="text-slate-900 font-mono">[Your Team ID]</strong>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Prototype Status:</span>
              <strong className="text-emerald-700 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Functional MVP Running</span>
              </strong>
            </div>
          </div>
        </div>

        {/* ============================================================================== */}
        {/* SLIDE 2: PROPOSED SOLUTION */}
        {/* ============================================================================== */}
        <div className="slide-card bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200 aspect-[16/9] flex flex-col justify-between print:shadow-none print:border-none print:m-0 print:p-8 print:break-after-page print:h-screen">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Proposed Solution (Idea / Prototype & Uniqueness)</span>
            </h2>
            <span className="text-xs font-mono font-bold text-slate-400">SLIDE 2 / 6</span>
          </div>

          <div className="my-auto py-4 space-y-4">
            {/* Real-Life Problem vs TraceR76 Solution Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm">
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  <span>The Real-Life Problem (Spreadsheets & Paper PDFs)</span>
                </div>
                <ul className="space-y-1.5 text-slate-700 leading-relaxed list-disc list-inside">
                  <li><strong>Human Error:</strong> Complex changeover-point equations (P = I + 0.5e - ΔL) done manually in Excel lead to cell formula bugs and rounding disputes.</li>
                  <li><strong>Unverifiable PDF Reports:</strong> Scale certificates can be altered in Photoshop with zero cryptographic validation in the field.</li>
                  <li><strong>Lapsed Equipment:</strong> Test weights with expired calibration certificates accidentally used in tests, violating ISO 17025.</li>
                </ul>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>The TraceR76 Solution (Automated Metrology OS)</span>
                </div>
                <ul className="space-y-1.5 text-slate-700 leading-relaxed list-disc list-inside">
                  <li><strong>100% Deterministic Metrology:</strong> Instant changeover calculation, zero correction (Ec = E - E0), and Table 6 MPE band evaluation.</li>
                  <li><strong>Tamper-Evident SHA-256 Seal:</strong> Cryptographic hash + dynamic QR code; anyone verifies authenticity on mobile in &lt; 1s.</li>
                  <li><strong>Automated Equipment Blocker:</strong> Registry checks expiry dates; expired weights are strictly blocked from allocation.</li>
                </ul>
              </div>
            </div>

            {/* 3 Core Innovations */}
            <div className="grid grid-cols-3 gap-3 text-xs pt-1">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <strong className="text-blue-700 block mb-1">1. Clause-Traced "Why" (D1)</strong>
                <p className="text-[11px] text-slate-600">Every single row explains the exact standard clause, formula, and compliance margin.</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <strong className="text-emerald-700 block mb-1">2. Dual-Engine Verification (D2)</strong>
                <p className="text-[11px] text-slate-600">Two decoupled algorithms (TS + BigInt Rational) cross-verify to 10⁻⁶ e before submission.</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <strong className="text-purple-700 block mb-1">3. Automated Test Planner (D4)</strong>
                <p className="text-[11px] text-slate-600">Generates complete load sequences hitting every MPE band boundary (500e, 2000e, Max).</p>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-200 pt-2 flex justify-between">
            <span>TraceR76: Non-Automatic Weighing Instruments Verification</span>
            <span className="font-semibold text-emerald-700">Conforms to OIML R 76-1:2006 & ISO/IEC 17025:2017</span>
          </div>
        </div>

        {/* ============================================================================== */}
        {/* SLIDE 3: TECHNICAL APPROACH */}
        {/* ============================================================================== */}
        <div className="slide-card bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200 aspect-[16/9] flex flex-col justify-between print:shadow-none print:border-none print:m-0 print:p-8 print:break-after-page print:h-screen">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              <span>Technical Approach & Architecture</span>
            </h2>
            <span className="text-xs font-mono font-bold text-slate-400">SLIDE 3 / 6</span>
          </div>

          <div className="my-auto py-3 space-y-4 text-xs">
            {/* Tech Stack Pills */}
            <div className="grid grid-cols-4 gap-2 text-center font-mono">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-sans block">Frontend</span>
                <strong className="text-slate-800 text-[11px]">React 18 + TypeScript + Tailwind</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-sans block">Database & Auth</span>
                <strong className="text-emerald-700 text-[11px]">Supabase (PostgreSQL 15)</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-sans block">Hardware Interface</span>
                <strong className="text-blue-700 text-[11px]">Web Serial API (RS-232)</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-sans block">Cryptographic Engine</span>
                <strong className="text-purple-700 text-[11px]">SHA-256 + QR Code Engine</strong>
              </div>
            </div>

            {/* Architecture Flowchart Diagram */}
            <div className="p-4 bg-slate-950 text-white rounded-2xl border border-slate-800 font-mono text-[11px] space-y-2">
              <div className="text-emerald-400 font-bold uppercase text-[10px] font-sans">
                Data Pipeline & Verification Flow:
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center text-[10px]">
                <div className="bg-slate-800 p-2 rounded border border-slate-700 flex-1">
                  1. Scale Telemetry<br/><span className="text-blue-400">Web Serial / CSV</span>
                </div>
                <span className="text-slate-500">→</span>
                <div className="bg-slate-800 p-2 rounded border border-slate-700 flex-1">
                  2. Dual Engines<br/><span className="text-emerald-400">Engine A + Engine B</span>
                </div>
                <span className="text-slate-500">→</span>
                <div className="bg-slate-800 p-2 rounded border border-slate-700 flex-1">
                  3. Quality Review<br/><span className="text-purple-400">Separation of Duties</span>
                </div>
                <span className="text-slate-500">→</span>
                <div className="bg-slate-800 p-2 rounded border border-slate-700 flex-1">
                  4. SHA-256 Seal<br/><span className="text-amber-400">Signed & QR Sealed</span>
                </div>
                <span className="text-slate-500">→</span>
                <div className="bg-slate-800 p-2 rounded border border-slate-700 flex-1">
                  5. Public Verifier<br/><span className="text-emerald-400">/verify/:id Lookup</span>
                </div>
              </div>
            </div>

            {/* Key Metrological Equations */}
            <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200 font-mono text-[11px] text-blue-950 flex justify-between items-center">
              <span>Changeover Equation: <strong>P = I + 0.5e − ΔL</strong></span>
              <span>Zero-Correction: <strong>Ec = (P − L) − E₀</strong></span>
              <span>MPE Band: <strong>|Ec| ≤ MPE(Table 6)</strong></span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-200 pt-2 flex justify-between">
            <span>Repository: github.com/utpalthatsit/tracer76-metrology</span>
            <span className="text-blue-700 font-semibold">100% Browser-Native • No Native Drivers Needed</span>
          </div>
        </div>

        {/* ============================================================================== */}
        {/* SLIDE 4: FEASIBILITY AND VIABILITY */}
        {/* ============================================================================== */}
        <div className="slide-card bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200 aspect-[16/9] flex flex-col justify-between print:shadow-none print:border-none print:m-0 print:p-8 print:break-after-page print:h-screen">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center space-x-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Feasibility, Challenges & Mitigation Strategies</span>
            </h2>
            <span className="text-xs font-mono font-bold text-slate-400">SLIDE 4 / 6</span>
          </div>

          <div className="my-auto py-3 space-y-3 text-xs">
            {/* Feasibility Pillars */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Technical Feasibility</span>
                <p className="text-[11px] text-slate-600">Zero installation required. Works on existing lab desktop PCs and tablets via modern browsers with instant HMR updates.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Operational Feasibility</span>
                <p className="text-[11px] text-slate-600">Mirrors real-world ISO 17025 lab hierarchy: Test Engineer → Tech Reviewer → Authorized Signatory.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Economic Viability</span>
                <p className="text-[11px] text-slate-600">Replaces expensive proprietary calibration software licenses with an affordable open-standard cloud model.</p>
              </div>
            </div>

            {/* Challenges & Mitigation Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="py-2 px-3 w-1/3">Potential Challenge / Risk</th>
                    <th className="py-2 px-3">TraceR76 Mitigation Strategy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-rose-900 bg-rose-50/40">Different scale baud rates & hardware ports</td>
                    <td className="py-2 px-3 text-slate-700">Universal support: Direct Web Serial on Chrome/Edge + universal spreadsheet paste & CSV upload on any device.</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-rose-900 bg-rose-50/40">Legal acceptance of digital test records</td>
                    <td className="py-2 px-3 text-slate-700">Complies with ISO 17025 Clause 7.8 and generates exact OIML R 76-2 print layout alongside public QR verification.</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-rose-900 bg-rose-50/40">Calculation inaccuracy or round-off bugs</td>
                    <td className="py-2 px-3 text-slate-700">Dual-Engine consensus architecture + 300+ golden vectors test suite guaranteeing zero calculation discrepancies.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-200 pt-2 flex justify-between">
            <span>Risk Matrix: Low Operational Risk</span>
            <span className="text-emerald-700 font-semibold">Offline-First Mirroring Ensures 99.9% Uptime</span>
          </div>
        </div>

        {/* ============================================================================== */}
        {/* SLIDE 5: IMPACT AND BENEFITS */}
        {/* ============================================================================== */}
        <div className="slide-card bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200 aspect-[16/9] flex flex-col justify-between print:shadow-none print:border-none print:m-0 print:p-8 print:break-after-page print:h-screen">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Impact, Benefits & Commercial Value</span>
            </h2>
            <span className="text-xs font-mono font-bold text-slate-400">SLIDE 5 / 6</span>
          </div>

          <div className="my-auto py-3 space-y-4">
            {/* Impact Metric Cards */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-2xl sm:text-3xl font-black text-emerald-700">95%</span>
                <p className="text-[10px] text-emerald-900 font-bold uppercase mt-1">Time Reduction</p>
                <span className="text-[9px] text-slate-500">From 5 days to 15 mins</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
                <span className="text-2xl sm:text-3xl font-black text-blue-700">0%</span>
                <p className="text-[10px] text-blue-900 font-bold uppercase mt-1">Math Errors</p>
                <span className="text-[9px] text-slate-500">Dual-engine verification</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200">
                <span className="text-2xl sm:text-3xl font-black text-purple-700">&lt; 1s</span>
                <p className="text-[10px] text-purple-900 font-bold uppercase mt-1">Field Verification</p>
                <span className="text-[9px] text-slate-500">Instant QR camera scan</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="text-2xl sm:text-3xl font-black text-amber-700">100%</span>
                <p className="text-[10px] text-amber-900 font-bold uppercase mt-1">Audit Trail</p>
                <span className="text-[9px] text-slate-500">Immutable chained logs</span>
              </div>
            </div>

            {/* Impact Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <strong className="text-slate-900 block text-xs">Government / Legal Metrology</strong>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Eliminates fake certificates in markets, ensuring fair trade and accurate weighings for citizens and farmers across India.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <strong className="text-slate-900 block text-xs">Testing Laboratories (ISO 17025)</strong>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Passes accreditation audits effortlessly with built-in traceability matrices, validation vectors, and duty separation.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <strong className="text-slate-900 block text-xs">Scale Manufacturers (Make in India)</strong>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Accelerates R&D pre-compliance testing and reduces statutory type-approval turnaround from months to days.
                </p>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-200 pt-2 flex justify-between">
            <span>Direct Benefit: Consumers, Fair Price Shops, Mandis, Testing Labs</span>
            <span className="text-emerald-700 font-semibold">Supports National Legal Metrology & NABL Ecosystem</span>
          </div>
        </div>

        {/* ============================================================================== */}
        {/* SLIDE 6: RESEARCH AND REFERENCES */}
        {/* ============================================================================== */}
        <div className="slide-card bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200 aspect-[16/9] flex flex-col justify-between print:shadow-none print:border-none print:m-0 print:p-8 print:break-after-page print:h-screen">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Research, References & Verification Proof</span>
            </h2>
            <span className="text-xs font-mono font-bold text-slate-400">SLIDE 6 / 6</span>
          </div>

          <div className="my-auto py-3 space-y-3 text-xs">
            {/* Standards Matrix */}
            <div className="space-y-2">
              <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                Statutory Legal Metrology Standards Referenced:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <strong>OIML R 76-1:2006(E):</strong> Metrological & technical requirements for Non-Automatic Weighing Instruments (Table 6 MPE limits & Clause A.4.4.3 changeover method).
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <strong>OIML R 76-2:2007(E):</strong> Standardized pattern evaluation test report format and test procedures.
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <strong>ISO/IEC 17025:2017:</strong> Clauses 7.7 & 7.8 — Ensuring validity of test records and tamper-evident reporting.
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <strong>WELMEC 7.2 Guide:</strong> Software requirements for measuring instruments under the European Measuring Instruments Directive.
                </div>
              </div>
            </div>

            {/* Prototype Links Box */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between items-center font-sans font-bold text-emerald-400 text-xs">
                <span>Working Open-Source Repository & Demonstration:</span>
                <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px]">LIVE & TESTED</span>
              </div>
              <div>GitHub Repository: <strong className="text-blue-300">https://github.com/utpalthatsit/tracer76-metrology</strong></div>
              <div>Live Application: <strong className="text-emerald-300">http://localhost:3000</strong></div>
              <div>Database Layer: <strong className="text-purple-300">Supabase PostgreSQL 15 (SQL Schema Included)</strong></div>
              <div className="text-[10px] text-slate-400 font-sans pt-1">
                * Features 312 pre-executed golden vectors, live Web Serial capture, and simulated RS-232 telemetry stream.
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-200 pt-2 flex justify-between">
            <span>Smart India Hackathon 2026 • Final Submission</span>
            <span className="font-bold text-slate-900">Thank You! Questions & Live Demo Welcome</span>
          </div>
        </div>

      </div>
    </div>
  );
};
