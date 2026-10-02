import React, { useState } from 'react';
import { Settings, Users, Building, ShieldCheck, BookOpen, Check, Save } from 'lucide-react';
import { DEFAULT_USERS } from '../../services/storage';
import { OIML_R76_RULESET } from '../../services/rulesets';
import { UserProfile } from '../../types/metrology';

interface AdminViewProps {
  onNavigate: (path: string) => void;
  currentUser: UserProfile;
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate, currentUser }) => {
  const [labName, setLabName] = useState('National Metrology Institute & Testing Laboratory');
  const [accreditationNumber, setAccreditationNumber] = useState('ISO/IEC 17025:2017 CERT #MET-9942');
  const [reportPrefix, setReportPrefix] = useState('R76-2026-');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 uppercase">
            <Settings className="w-4 h-4" />
            <span>Laboratory Administration & Rulesets</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Tenant Settings & Users Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure laboratory profile, report numbering, staff roles, and statutory ruleset policies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Lab Profile & Branding */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 text-xs">
          <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Laboratory Profile & Accreditation</span>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Laboratory Legal Name</label>
              <input
                type="text"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">ISO/IEC 17025 Accreditation Cert No.</label>
              <input
                type="text"
                value={accreditationNumber}
                onChange={(e) => setAccreditationNumber(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Report Numbering Prefix</label>
              <input
                type="text"
                value={reportPrefix}
                onChange={(e) => setReportPrefix(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-mono font-bold"
              />
            </div>

            {savedSuccess && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center space-x-1.5">
                <Check className="w-4 h-4" />
                <span>Settings saved successfully.</span>
              </div>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center space-x-1.5 shadow-sm transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Laboratory Profile</span>
            </button>
          </form>
        </div>

        {/* Right: Active Ruleset Edition */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Active OIML Ruleset Edition</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-900">{OIML_R76_RULESET.version}</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">ACTIVE & LOCKED</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Standard: <em>{OIML_R76_RULESET.title}</em>
            </p>
            <div className="font-mono text-[10px] text-slate-600 break-all bg-white p-2 rounded border border-slate-200">
              Ruleset Hash: {OIML_R76_RULESET.hash}
            </div>
            <div className="text-[10px] text-slate-400">
              Managed globally by Platform Metrology Administrators.
            </div>
          </div>
        </div>

        {/* Laboratory Personnel & Role Separation */}
        <div className="lg:col-span-12 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Authorized Laboratory Staff (Separation of Duties)</span>
            </div>
            <span className="text-slate-500">{DEFAULT_USERS.length} Registered Personnel</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Permissions & Separation of Duties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {DEFAULT_USERS.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{usr.name}</td>
                    <td className="py-3 px-3 font-semibold capitalize text-blue-700">{usr.role.replace(/_/g, ' ')}</td>
                    <td className="py-3 px-3 text-slate-500 font-mono">{usr.email}</td>
                    <td className="py-3 px-3 text-slate-600">
                      {usr.role === 'test_engineer' && 'Enters observation data; blocked from reviewing or signing own reports.'}
                      {usr.role === 'reviewer' && 'Reviews test data against Engine A & B; approves or returns.'}
                      {usr.role === 'approver' && 'Authorized Signatory; issues cryptographic SHA-256 seal.'}
                      {usr.role === 'lab_admin' && 'Configures equipment registry, lab settings, and accounts.'}
                      {usr.role === 'quality_manager' && 'Audits validation vectors and inspection trace integrity.'}
                      {usr.role === 'applicant' && 'External applicant; read-only access to issued certificates.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
