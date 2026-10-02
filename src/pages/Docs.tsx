import React, { useState } from 'react';
import { BookOpen, Search, Calculator, ShieldCheck, ChevronRight, HelpCircle, Layers, FileText } from 'lucide-react';
import { OIML_R76_RULESET } from '../services/rulesets';

export const Docs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'getting_started' | 'changeover' | 'mpe' | 'eccentricity' | 'glossary'>('changeover');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Title & Search */}
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 mb-3">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>Metrological Reference & Technical Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          TraceR76 Metrology Guide & User Documentation
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Edition: <strong className="text-slate-800">{OIML_R76_RULESET.version}</strong> | Official reference for testing labs, reviewers, and metrology inspectors.
        </p>

        {/* Search */}
        <div className="relative mt-6">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by clause (e.g. A.4.4.3), formula (P = I + 0.5e), or term..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Nav */}
        <div className="md:col-span-4 space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 pb-2">
            Documentation Sections
          </div>
          
          <button
            onClick={() => setActiveSection('changeover')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
              activeSection === 'changeover' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Clause A.4.4.3: Changeover Method (P, E, Ec)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveSection('mpe')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
              activeSection === 'mpe' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Table 6: Maximum Permissible Errors (MPE)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveSection('eccentricity')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
              activeSection === 'eccentricity' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Clause A.4.7: Eccentricity & Positions</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveSection('getting_started')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
              activeSection === 'getting_started' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Getting Started & Separation of Duties</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveSection('glossary')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
              activeSection === 'glossary' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Metrology Glossary (e, d, n, NAWI, tare)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Content */}
        <div className="md:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-sm">
          
          {activeSection === 'changeover' && (
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Clause A.4.4.3 & Clause 3.5.1</span>
              <h2 className="text-2xl font-black text-slate-900">
                Determination of Indication Changeover Points
              </h2>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                For non-automatic weighing instruments with digital indications, rounding prevents observing true fractional errors directly. OIML R 76-1 defines the <strong>Changeover Point Method</strong> using added small loads (ΔL).
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs space-y-2">
                <div className="text-blue-900 font-bold">1. Calculated Indication (P):</div>
                <div className="bg-white p-2.5 rounded border border-slate-200 font-bold text-slate-800">
                  P = I + 0.5e − ΔL
                </div>
                <p className="text-slate-500 font-sans text-[11px]">
                  Where <em>I</em> is the displayed indication, <em>e</em> is the verification scale interval, and <em>ΔL</em> is the additional small load (typically 0.1e fractions) added until the indication unambiguously increments to <em>I + e</em>.
                </p>

                <div className="text-blue-900 font-bold pt-2">2. Error Prior to Zero Correction (E):</div>
                <div className="bg-white p-2.5 rounded border border-slate-200 font-bold text-slate-800">
                  E = P − L
                </div>

                <div className="text-blue-900 font-bold pt-2">3. Corrected Error (Ec):</div>
                <div className="bg-white p-2.5 rounded border border-slate-200 font-bold text-slate-800">
                  Ec = E − E₀
                </div>
                <p className="text-slate-500 font-sans text-[11px]">
                  Where <em>E₀</em> is the calculated error determined at zero (or near-minimum load).
                </p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                <strong>TraceR76 Implementation:</strong> The system automatically evaluates E₀ at the zero row and dynamically corrects all subsequent increasing and decreasing rows, updating margin and clause references in real time.
              </div>
            </div>
          )}

          {activeSection === 'mpe' && (
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">OIML R 76-1:2006 Table 6</span>
              <h2 className="text-2xl font-black text-slate-900">
                Maximum Permissible Errors (MPE) by Accuracy Class
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm">
                Maximum permissible errors for initial verification and in-service inspections based on load <em>m</em> expressed in verification scale intervals (<em>e</em>).
              </p>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-sans font-bold border-b border-slate-300">
                      <th className="py-2.5 px-3">MPE (Initial)</th>
                      <th className="py-2.5 px-3">Class I</th>
                      <th className="py-2.5 px-3">Class II</th>
                      <th className="py-2.5 px-3">Class III</th>
                      <th className="py-2.5 px-3">Class IIII</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 px-3 font-bold text-blue-700">± 0.5 e</td>
                      <td className="py-2 px-3">0 ≤ m ≤ 50 000 e</td>
                      <td className="py-2 px-3">0 ≤ m ≤ 5 000 e</td>
                      <td className="py-2 px-3">0 ≤ m ≤ 500 e</td>
                      <td className="py-2 px-3">0 ≤ m ≤ 50 e</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-blue-700">± 1.0 e</td>
                      <td className="py-2 px-3">50 000 &lt; m ≤ 200 000 e</td>
                      <td className="py-2 px-3">5 000 &lt; m ≤ 20 000 e</td>
                      <td className="py-2 px-3">500 &lt; m ≤ 2 000 e</td>
                      <td className="py-2 px-3">50 &lt; m ≤ 200 e</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-blue-700">± 1.5 e</td>
                      <td className="py-2 px-3">m &gt; 200 000 e</td>
                      <td className="py-2 px-3">20 000 &lt; m ≤ 100 000 e</td>
                      <td className="py-2 px-3">2 000 &lt; m ≤ 10 000 e</td>
                      <td className="py-2 px-3">200 &lt; m ≤ 1 000 e</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500">
                * Note: For in-service inspection, maximum permissible errors are double the values on initial verification (Clause 3.5.2).
              </p>
            </div>
          )}

          {activeSection === 'eccentricity' && (
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Clause 3.6.2 & A.4.7</span>
              <h2 className="text-2xl font-black text-slate-900">
                Eccentricity Testing (Corner Loading)
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm">
                For instruments having not more than four points of support, a test load equal to <strong>1/3 Max</strong> (or maximum additive tare) is successively placed in each of the 4 quadrants or corners and the center.
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-900">Acceptance Criteria:</div>
                <p className="text-slate-600">
                  The corrected error at each eccentric position shall not exceed the maximum permissible error for that test load (Clause 3.6.2).
                </p>
              </div>
            </div>
          )}

          {activeSection === 'getting_started' && (
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Quality Procedure</span>
              <h2 className="text-2xl font-black text-slate-900">
                Separation of Duties (ISO/IEC 17025)
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm">
                To guarantee impartial test data, TraceR76 enforces laboratory roles:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700">
                <li><strong>Test Engineer:</strong> Collects observations and submits reports. Cannot review or approve their own reports.</li>
                <li><strong>Technical Reviewer:</strong> Verifies dual-engine results, inspects environmental stability, and requests rechecks or approves.</li>
                <li><strong>Approver / Signatory:</strong> Issues the final report, triggering the SHA-256 seal and digital certificate.</li>
              </ul>
            </div>
          )}

          {activeSection === 'glossary' && (
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Terminology</span>
              <h2 className="text-2xl font-black text-slate-900">
                Metrological Glossary
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <dt className="font-mono font-bold text-blue-800">e (Verification Scale Interval)</dt>
                  <dd className="text-slate-600 mt-1">Value, expressed in units of mass, used for the classification and verification of an instrument.</dd>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <dt className="font-mono font-bold text-blue-800">d (Actual Scale Interval)</dt>
                  <dd className="text-slate-600 mt-1">Value expressed in units of mass of the difference between the values corresponding to two consecutive scale marks.</dd>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <dt className="font-mono font-bold text-blue-800">n (Number of Intervals)</dt>
                  <dd className="text-slate-600 mt-1">Quotient of the maximum capacity and the verification scale interval: n = Max / e.</dd>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <dt className="font-mono font-bold text-blue-800">NAWI</dt>
                  <dd className="text-slate-600 mt-1">Non-automatic weighing instrument requiring the intervention of an operator during weighing.</dd>
                </div>
              </dl>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
