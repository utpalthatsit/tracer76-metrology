import React from 'react';
import { CheckCircle2, Clock, BookOpen, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';

interface StandardsMatrixProps {
  onNavigate: (path: string) => void;
}

export const StandardsMatrix: React.FC<StandardsMatrixProps> = ({ onNavigate }) => {
  const standardsData = [
    {
      section: "Clause 3.5.1 / A.4.4",
      title: "Weighing Performance Test (Changeover Method)",
      standard: "OIML R 76-1:2006",
      status: "Supported",
      release: "Release 1 (Current)",
      description: "Automatic changeover-point determination P = I + 0.5e - ΔL, error E = P - L, zero correction Ec = E - E0, and Table 6 MPE band compliance check.",
      systemFeature: "Test Performance Grid & Live Engine A/B Evaluator",
      actionPath: "/app/reports/R76-2026-0042/tests/weighing"
    },
    {
      section: "Clause 3.6.2 / A.4.7",
      title: "Eccentricity (Corner Load Test)",
      standard: "OIML R 76-1:2006",
      status: "Supported",
      release: "Release 1 (Current)",
      description: "Evaluation of load applied at 5 positions (Center, 4 corners or 4 quadrants) with load L = Max/3. Checks that error at all positions is within MPE.",
      systemFeature: "Interactive SVG Load Receptor Diagram & Pos 1-5 Grid",
      actionPath: "/app/reports/R76-2026-0042/tests/eccentricity"
    },
    {
      section: "Clause 3.6.1 / A.4.10",
      title: "Repeatability Test",
      standard: "OIML R 76-1:2006",
      status: "Supported",
      release: "Release 1 (Current)",
      description: "Series of 3 or 10 weighings at 50% Max and 100% Max. Evaluates Pmax - Pmin against absolute MPE.",
      systemFeature: "Repeatability Series Analyzer with automated range check",
      actionPath: "/app/reports/R76-2026-0042/tests/repeatability"
    },
    {
      section: "Clause 3.8 / A.4.8",
      title: "Discrimination Test (1.4d)",
      standard: "OIML R 76-1:2006",
      status: "Supported",
      release: "Release 1 (Current)",
      description: "Checks instrument sensitivity to an added load of 1.4d placed gently on the pan. Verifies indication shift of at least 1d.",
      systemFeature: "Discrimination Test Module",
      actionPath: "/app/reports/R76-2026-0042/tests/discrimination"
    },
    {
      section: "Clause 4.5 / 4.6",
      title: "Zero-Setting & Tare Operations",
      standard: "OIML R 76-1:2006",
      status: "Supported",
      release: "Release 1 (Current)",
      description: "Initial zero-setting range (±20%), semi-automatic zero-setting range, zero tracking rate (≤ 0.5d/s), center-of-zero error (≤ ±0.25e), and tare accuracy.",
      systemFeature: "Sensitivity, Zero & Tare Module",
      actionPath: "/app/reports/R76-2026-0042/tests/zero"
    },
    {
      section: "Clause 7.7 / 7.8",
      title: "ISO/IEC 17025 Record Authenticity & Sealing",
      standard: "ISO/IEC 17025:2017",
      status: "Supported",
      release: "Release 1 (Current)",
      description: "Deterministic dual-engine calculation, immutable SHA-256 seal, cryptographic signature, and public QR verification.",
      systemFeature: "Digital Sealer & /verify Public Page",
      actionPath: "/verify"
    },
    {
      section: "Clause 3.9.2 / A.5.3",
      title: "Influence Factor: Static Temperatures (-10°C to +40°C)",
      standard: "OIML R 76-1:2006",
      status: "Planned",
      release: "Release 2",
      description: "Climatic chamber test at reference temperature (20°C), extreme low temp, extreme high temp, and return to 20°C with thermal stabilization logging.",
      systemFeature: "Temperature Chamber Step Integration",
      actionPath: "/docs"
    },
    {
      section: "Clause 3.9.3 / A.5.4",
      title: "Influence Factor: Damp Heat Steady State",
      standard: "OIML R 76-1:2006",
      status: "Planned",
      release: "Release 2",
      description: "Exposure to 85% RH at 40°C for 48 hours with span error monitoring.",
      systemFeature: "Environmental Chamber Data Pipeline",
      actionPath: "/docs"
    },
    {
      section: "Clause 3.9.4 / A.5.2",
      title: "Disturbances: AC Mains Voltage Variations & Bursts",
      standard: "OIML R 76-1:2006",
      status: "Planned",
      release: "Release 2",
      description: "Tests at 0.85 Un and 1.10 Un, voltage dips, and electrical transient immunity.",
      systemFeature: "EMC Test Sequence Module",
      actionPath: "/docs"
    },
    {
      section: "Clause 4.14 / A.4.11",
      title: "Time-Dependent: Creep & Zero Return",
      standard: "OIML R 76-1:2006",
      status: "Planned",
      release: "Release 2",
      description: "Indication drift recorded over 30 minutes at Max capacity and zero return within 15 seconds.",
      systemFeature: "Time-Series Creep Curve Visualizer",
      actionPath: "/docs"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 mb-3">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>OIML R 76-1 / R 76-2 Metrological Coverage</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Standard Coverage Matrix
        </h1>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
          Comprehensive roadmap detailing every clause of OIML R 76-1:2006 and R 76-2:2007 test procedures. Release 1 delivers core laboratory metrological verification with transparent status indicators.
        </p>
      </div>

      {/* Release Summary Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-emerald-950 text-sm">Release 1 (Production MVP)</div>
            <div className="text-xs text-emerald-800">
              Core Tests: Performance, Eccentricity, Repeatability, Discrimination, Zero/Tare, Dual Engines & Sealing.
            </div>
          </div>
        </div>

        <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-2xl flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-blue-950 text-sm">Release 2 (Full Environmental & EMC)</div>
            <div className="text-xs text-blue-800">
              Influence Factors: Climatic chamber, damp heat, mains disturbance, tilt, creep & span stability.
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Standard & Clause</th>
                <th className="py-3.5 px-4">Test Procedure Title</th>
                <th className="py-3.5 px-4">Release Status</th>
                <th className="py-3.5 px-4">Implementation & System Feature</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {standardsData.map((item, idx) => {
                const isSupported = item.status === 'Supported';
                return (
                  <tr key={idx} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {item.section}
                      <span className="block text-[10px] text-slate-400 font-sans">{item.standard}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {item.title}
                      <p className="text-[11px] text-slate-500 font-normal leading-relaxed mt-0.5 max-w-md">
                        {item.description}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        isSupported
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {isSupported ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{item.status} ({item.release})</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-[11px]">
                      {item.systemFeature}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onNavigate(item.actionPath)}
                        className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center space-x-1"
                      >
                        <span>{isSupported ? 'View Test' : 'Learn more'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
