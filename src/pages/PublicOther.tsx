import React, { useState } from 'react';
import { ShieldCheck, Mail, Check, Building, Lock, FileText, ArrowRight, HelpCircle, Server } from 'lucide-react';

interface PublicOtherProps {
  view: 'features' | 'how-it-works' | 'pricing' | 'security' | 'about' | 'contact' | 'privacy' | 'terms';
  onNavigate: (path: string) => void;
}

export const PublicOther: React.FC<PublicOtherProps> = ({ view, onNavigate }) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);

  if (view === 'pricing') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Lab Deployment Models</span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">Flexible Metrology Pricing</h1>
          <p className="text-slate-600 text-sm mt-2">
            Engineered for legal metrology authorities, accredited ISO 17025 calibration laboratories, and NAWI manufacturers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan 1 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Accredited Testing Lab</h3>
              <p className="text-xs text-slate-500 mt-1">For ISO/IEC 17025 commercial calibration labs.</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-extrabold text-slate-900">₹ 24,900</span>
                <span className="text-xs text-slate-500 font-medium"> / lab / month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-6">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Unlimited OIML R 76-2 Test Reports</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Dual-Engine Verification Guarantee</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>5 Test Engineer & Reviewer Seats</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Public QR Verification (/verify)</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('/contact')}
              className="mt-8 w-full py-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-800 hover:bg-slate-50 transition"
            >
              Request Lab Pilot
            </button>
          </div>

          {/* Plan 2 */}
          <div className="bg-gradient-to-b from-blue-900 to-indigo-950 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between relative border border-blue-800">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow">
              Most Popular for Institutes
            </div>
            <div>
              <h3 className="text-lg font-bold">National Metrology Institute</h3>
              <p className="text-xs text-blue-200 mt-1">Government Legal Metrology & GATC Type-Approval.</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-extrabold">Custom Quote</span>
                <span className="text-xs text-blue-200 block mt-0.5">Annual statutory license & Gov Cloud</span>
              </div>
              <ul className="space-y-3 text-xs text-blue-100 border-t border-blue-800/80 pt-6">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Dedicated Hardware Signing Key (HSM)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Unlimited Lab Users & Tenant Separation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Custom National Ruleset Edition Templates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>On-premises or Sovereign India Cloud</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('/contact')}
              className="mt-8 w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-400 font-bold text-xs text-white shadow-lg transition"
            >
              Contact Government Sales
            </button>
          </div>

          {/* Plan 3 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Scale Manufacturer</h3>
              <p className="text-xs text-slate-500 mt-1">For R&D pre-compliance & factory verification.</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-extrabold text-slate-900">₹ 39,900</span>
                <span className="text-xs text-slate-500 font-medium"> / facility / month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-6">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Web Serial direct balance capture</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>CSV/Excel bulk import & API</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Factory calibration records linking</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('/contact')}
              className="mt-8 w-full py-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-800 hover:bg-slate-50 transition"
            >
              Start Manufacturer Trial
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'security') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Security & Integrity</span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">Cryptographic Architecture & Data Protection</h1>
          <p className="text-sm text-slate-600 mt-2">
            Built to satisfy ISO/IEC 17025 Clause 7.11 (Control of data and information management) and India DPDP Act 2023.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <Lock className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-slate-900">Deterministic SHA-256 Sealing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every issued report generates a cryptographic hash across canonical JSON observation records. Any post-issuance file tampering fails verification immediately.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <Server className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-slate-900">Data Residency in India</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              All statutory records, client data, and audit logs are stored within Tier-IV sovereign data centers in India with AES-256 encryption at rest and TLS 1.3 in transit.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <h3 className="font-bold text-slate-900">Separation of Duties & RBAC</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Cryptographically enforced separation: Test Engineers who collect and enter observations cannot review or sign their own reports.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <FileText className="w-6 h-6 text-purple-600" />
            <h3 className="font-bold text-slate-900">Append-Only Audit Trail</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every status transition, data modification, and signature is recorded in a hash-chained append-only audit ledger compliant with ISO 17025 audit discovery.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Contact / About / Terms fallback
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 capitalize">
          {view === 'contact' ? 'Request Demo & Evaluation' : view}
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Contact our Legal Metrology Technical Team for test protocol validation, institutional onboarding, or standards alignment.
        </p>
      </div>

      {contactSubmitted ? (
        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-sm">
          <strong className="block text-base font-bold mb-1">Thank you! Your request has been received.</strong>
          A TraceR76 Metrology Specialist will contact you within 1 business day with the ISO 17025 laboratory evaluation pack.
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setContactSubmitted(true);
          }}
          className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs"
        >
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input required type="text" placeholder="Dr. Jane Doe" className="w-full p-2.5 rounded-lg border border-slate-300" />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Laboratory or Institution Name</label>
            <input required type="text" placeholder="National Testing Lab" className="w-full p-2.5 rounded-lg border border-slate-300" />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
            <input required type="email" placeholder="jane@lab.gov" className="w-full p-2.5 rounded-lg border border-slate-300" />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Testing Focus / Requirements</label>
            <textarea rows={4} placeholder="Type evaluation for Class III commercial scales, ISO 17025 audit compliance..." className="w-full p-2.5 rounded-lg border border-slate-300"></textarea>
          </div>
          <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition">
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
};
