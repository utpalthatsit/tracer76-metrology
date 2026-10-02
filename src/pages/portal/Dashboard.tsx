import React, { useState } from 'react';
import { 
  FileText, Clock, AlertTriangle, CheckCircle2, Plus, 
  ArrowRight, Filter, Search, ShieldCheck, AlertOctagon, 
  Layers, ChevronRight, UserCheck, Calendar
} from 'lucide-react';
import { ReportRecord, UserProfile } from '../../types/metrology';
import { storageService } from '../../services/storage';

interface DashboardProps {
  onNavigate: (path: string) => void;
  currentUser: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, currentUser }) => {
  const [reports] = useState<ReportRecord[]>(() => storageService.getReports());
  const [equipment] = useState(() => storageService.getEquipment());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Counts
  const draftsCount = reports.filter(r => r.status === 'Draft').length;
  const reviewCount = reports.filter(r => r.status === 'Under Review' || r.status === 'Submitted').length;
  const returnedCount = reports.filter(r => r.status === 'Returned').length;
  const issuedCount = reports.filter(r => r.status === 'Issued').length;

  // Equipment Alerts
  const dueSoonEquipment = equipment.filter(e => e.status === 'due_soon');
  const expiredEquipment = equipment.filter(e => e.status === 'expired');

  // Filtered reports
  const filteredReports = reports.filter(r => {
    const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.specs.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.specs.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.specs.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Laboratory Portal Workspace
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Active Laboratory: <strong className="text-slate-800">{currentUser.labName}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('/app/reports/new')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Report Wizard</span>
          </button>
          
          <button
            onClick={() => onNavigate('/app/review')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300 transition flex items-center space-x-2"
          >
            <UserCheck className="w-4 h-4 text-purple-600" />
            <span>Review Queue ({reviewCount})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => setStatusFilter('draft')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>My Drafts</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{draftsCount}</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1 flex items-center space-x-0.5">
            <span>In-progress tests</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('under review')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-400 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Awaiting Review</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black text-purple-700 mt-2">{reviewCount}</div>
          <div className="text-[11px] text-purple-600 font-semibold mt-1 flex items-center space-x-0.5">
            <span>Pending technical check</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('returned')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-400 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Returned Reports</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-700 mt-2">{returnedCount}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center space-x-0.5">
            <span>Requires recheck</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('issued')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Recently Issued</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-700 mt-2">{issuedCount}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center space-x-0.5">
            <span>Cryptographically sealed</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

      </div>

      {/* Laboratory Health & Quality Alerts Strip (PRD 5.6) */}
      {(dueSoonEquipment.length > 0 || expiredEquipment.length > 0) && (
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Metrology Quality & Equipment Alerts
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {dueSoonEquipment.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start space-x-3 text-xs text-amber-950">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold text-amber-900">Calibration Due in 30 Days</div>
                  <p className="mt-0.5 text-amber-800 leading-relaxed">
                    {dueSoonEquipment[0].name} (S/N: {dueSoonEquipment[0].serialNumber}) calibration expires on <strong>{dueSoonEquipment[0].expiryDate}</strong>.
                  </p>
                  <button
                    onClick={() => onNavigate('/app/equipment')}
                    className="mt-2 text-amber-900 font-semibold underline text-[11px]"
                  >
                    View Equipment Registry →
                  </button>
                </div>
              </div>
            )}

            {expiredEquipment.length > 0 && (
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 flex items-start space-x-3 text-xs text-rose-950">
                <AlertOctagon className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold text-rose-900">Expired Standard Standard Weights Blocked</div>
                  <p className="mt-0.5 text-rose-800 leading-relaxed">
                    {expiredEquipment[0].name} (S/N: {expiredEquipment[0].serialNumber}) expired on <strong>{expiredEquipment[0].expiryDate}</strong>. Allocation blocked for new reports.
                  </p>
                  <button
                    onClick={() => onNavigate('/app/equipment')}
                    className="mt-2 text-rose-900 font-semibold underline text-[11px]"
                  >
                    Update Calibration Certificate →
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Reports Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table Filters Header */}
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 uppercase">Test Reports List</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter Buttons */}
            {['all', 'draft', 'under review', 'issued', 'returned'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none w-44"
              />
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                <th className="py-3 px-4">Report No.</th>
                <th className="py-3 px-4">Applicant & Model</th>
                <th className="py-3 px-4">Accuracy Class & Max</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Dual Engine</th>
                <th className="py-3 px-4">Created / Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map((rep) => {
                const isIssued = rep.status === 'Issued';
                return (
                  <tr key={rep.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {rep.id}
                      <span className="block text-[10px] text-slate-400 font-sans">Rev {rep.version}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{rep.specs.model}</div>
                      <div className="text-[11px] text-slate-500">{rep.specs.applicant}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-blue-800">Class {rep.specs.accuracyClass}</span>
                      <div className="text-[11px] text-slate-500">{rep.specs.maxCapacity} {rep.specs.unit} (e = {rep.specs.scaleIntervalE}{rep.specs.unit})</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        rep.status === 'Issued'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : rep.status === 'Under Review'
                          ? 'bg-purple-100 text-purple-800 border border-purple-300'
                          : rep.status === 'Returned'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}>
                        {rep.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Matched</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(rep.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                      {isIssued ? (
                        <button
                          onClick={() => onNavigate(`/app/reports/${rep.id}/preview`)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-semibold text-xs transition"
                        >
                          View Report
                        </button>
                      ) : (
                        <button
                          onClick={() => onNavigate(`/app/reports/${rep.id}`)}
                          className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-semibold text-xs shadow-sm transition"
                        >
                          Open Workspace
                        </button>
                      )}
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
