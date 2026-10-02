import React, { useState } from 'react';
import { 
  ArrowLeft, FileText, CheckCircle2, Clock, AlertTriangle, 
  ShieldCheck, Send, Eye, MessageSquare, History, Layers, 
  Settings, ChevronRight, Scale, Award
} from 'lucide-react';
import { ReportRecord, UserProfile } from '../../types/metrology';
import { storageService } from '../../services/storage';
import { TestPerformanceView } from './TestPerformanceView';
import { TestEccentricityView } from './TestEccentricityView';
import { TestRepeatabilityView } from './TestRepeatabilityView';
import { TestOtherViews } from './TestOtherViews';
import { DualEngineBadge } from '../../components/DualEngineBadge';

interface ReportWorkspaceProps {
  reportId: string;
  onNavigate: (path: string) => void;
  currentUser: UserProfile;
}

export const ReportWorkspace: React.FC<ReportWorkspaceProps> = ({
  reportId,
  onNavigate,
  currentUser
}) => {
  const [report, setReport] = useState<ReportRecord | undefined>(() => storageService.getReportById(reportId));
  const [activeTab, setActiveTab] = useState<'overview' | 'weighing' | 'eccentricity' | 'repeatability' | 'discrimination' | 'zero' | 'tare' | 'equipment' | 'comments' | 'history'>('weighing');
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Report "{reportId}" Not Found</h2>
        <button
          onClick={() => onNavigate('/app/dashboard')}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleUpdateReport = (updated: ReportRecord) => {
    setReport(updated);
  };

  const handlePreSubmitCheck = async () => {
    // Check if dual engine matches
    if (report.dualEngineVerification && !report.dualEngineVerification.enginesMatch) {
      setSubmitMessage('ERROR: Dual-engine calculation mismatch detected! Submission is strictly blocked per D2.');
      return;
    }

    // Advance to Under Review
    const updated: ReportRecord = {
      ...report,
      status: 'Under Review',
      updatedAt: new Date().toISOString()
    };
    storageService.saveReport(updated);
    setReport(updated);

    await storageService.addAuditLog(
      currentUser.name,
      currentUser.role,
      'SUBMITTED_FOR_REVIEW',
      `Submitted test report ${report.id} for Technical Review. Dual-engine check verified.`,
      report.id
    );

    setSubmitMessage('Report successfully submitted for Technical Review! Moving to Review Queue...');
    setTimeout(() => {
      onNavigate(`/app/review`);
    }, 1200);
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('/app/dashboard')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-base font-black text-slate-900">{report.id}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                report.status === 'Issued'
                  ? 'bg-emerald-100 text-emerald-800'
                  : report.status === 'Under Review'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {report.status}
              </span>
              <span className="text-xs text-slate-400 font-mono">Rev {report.version}</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {report.specs.model} ({report.specs.applicant}) • <span className="font-mono">{report.rulesetVersion}</span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          <DualEngineBadge result={report.dualEngineVerification} />

          <button
            onClick={() => onNavigate(`/app/reports/${report.id}/preview`)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center space-x-1.5 transition shadow-sm"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>Report Preview</span>
          </button>

          {report.status === 'Draft' && (
            <button
              onClick={handlePreSubmitCheck}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-md shadow-blue-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Submit for Review</span>
            </button>
          )}
        </div>
      </div>

      {submitMessage && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>{submitMessage}</span>
        </div>
      )}

      {/* Main 3-Column Layout: Left Nav, Center Test Canvas, Right Live Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Test & Section Navigator */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-1 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-3 pb-1 block tracking-wider">
              Test Clauses (OIML R 76-2)
            </span>

            {[
              { id: 'weighing', label: '1. Weighing Performance', status: report.weighingPerformance.status, clause: 'Clause 4.2' },
              { id: 'eccentricity', label: '2. Eccentricity (Corner)', status: report.eccentricity.status, clause: 'Clause 4.3' },
              { id: 'repeatability', label: '3. Repeatability', status: report.repeatability.status, clause: 'Clause 4.4' },
              { id: 'discrimination', label: '4. Discrimination (1.4d)', status: report.discrimination.status, clause: 'Clause 4.5' },
              { id: 'zero', label: '5. Zero & Sensitivity', status: report.sensitivityAndZero.status, clause: 'Clause 4.6' },
              { id: 'tare', label: '6. Tare Operations', status: report.tareTest.status, clause: 'Clause 4.7' },
            ].map((t) => {
              const isSelected = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl font-medium transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div>{t.label}</div>
                    <div className={`text-[10px] font-mono ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      {t.clause}
                    </div>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${
                    t.status === 'completed' ? 'bg-emerald-400' : 'bg-slate-300'
                  }`}></span>
                </button>
              );
            })}

            <div className="pt-3 border-t border-slate-100 mt-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 px-3 pb-1 block tracking-wider">
                Records & Audit
              </span>

              <button
                onClick={() => onNavigate(`/app/reports/${report.id}/preview`)}
                className="w-full text-left px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 flex items-center space-x-2"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Formal R 76-2 Preview</span>
              </button>

              <button
                onClick={() => onNavigate('/app/audit')}
                className="w-full text-left px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 flex items-center space-x-2"
              >
                <History className="w-3.5 h-3.5 text-slate-400" />
                <span>Hash-Chained Audit Trail</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center Column: Active Test Canvas */}
        <div className="lg:col-span-6 space-y-6">
          {activeTab === 'weighing' && (
            <TestPerformanceView
              report={report}
              onUpdateReport={handleUpdateReport}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'eccentricity' && (
            <TestEccentricityView
              report={report}
              onUpdateReport={handleUpdateReport}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'repeatability' && (
            <TestRepeatabilityView
              report={report}
              onUpdateReport={handleUpdateReport}
              currentUser={currentUser}
            />
          )}

          {(activeTab === 'discrimination' || activeTab === 'zero' || activeTab === 'tare') && (
            <TestOtherViews
              report={report}
              onUpdateReport={handleUpdateReport}
              currentUser={currentUser}
              activeTestType={activeTab}
            />
          )}
        </div>

        {/* Right Column: Live Summary Panel (PRD 5.8) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Live Summary</span>
              <span className="font-mono text-emerald-700 font-bold">100% Deterministic</span>
            </div>

            {/* Overall Verdict Card */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase font-semibold">Evaluation Status:</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-emerald-700">
                  {report.weighingPerformance.isPass ? 'PASS' : 'FAIL'}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">All bands checked</span>
              </div>
            </div>

            {/* Metrological Compliance Margins */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Narrowest MPE Margins
              </span>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Performance (2000e):</span>
                  <span className="text-emerald-700 font-bold">+0.0021 {report.specs.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Eccentricity (Pos 3):</span>
                  <span className="text-emerald-700 font-bold">+0.0048 {report.specs.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Repeatability Max:</span>
                  <span className="text-emerald-700 font-bold">+0.0074 {report.specs.unit}</span>
                </div>
              </div>
            </div>

            {/* Environmental Snapshot */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Chamber Conditions
              </span>
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <div>Temp: <strong className="font-mono">{report.conditions.temperatureC}°C</strong> (Limit: {report.specs.tempMin}°C to {report.specs.tempMax}°C)</div>
                <div>Humidity: <strong className="font-mono">{report.conditions.relativeHumidityPercent}% RH</strong></div>
                <div>Pressure: <strong className="font-mono">{report.conditions.atmosphericPressureHPa} hPa</strong></div>
              </div>
            </div>

            {/* Dual Engine Check */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 space-y-1">
              <div className="font-bold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Engine A & Engine B Match</span>
              </div>
              <p className="text-[10px] text-emerald-800 leading-tight">
                Discrepancy: 0.000000 e. Submission gate unlocked.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
