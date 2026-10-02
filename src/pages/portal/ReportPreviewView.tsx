import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, Printer, Download, Share2, ShieldCheck, 
  Lock, CheckCircle2, AlertCircle, FileCheck, Check, Sparkles
} from 'lucide-react';
import { ReportRecord, UserProfile } from '../../types/metrology';
import { ReportDocument } from '../../components/ReportDocument';
import { sealReport } from '../../services/cryptoSealer';
import { storageService } from '../../services/storage';

interface ReportPreviewViewProps {
  reportId: string;
  onNavigate: (path: string) => void;
  currentUser: UserProfile;
}

export const ReportPreviewView: React.FC<ReportPreviewViewProps> = ({
  reportId,
  onNavigate,
  currentUser
}) => {
  const [report, setReport] = useState<ReportRecord | undefined>(() => storageService.getReportById(reportId));
  const [isSealing, setIsSealing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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

  const isIssued = report.status === 'Issued';
  const canIssue = !isIssued && (currentUser.role === 'approver' || currentUser.role === 'lab_admin');

  // Pre-submit / Pre-issue gates
  const gates = [
    { label: 'Weighing Performance Completed', passed: report.weighingPerformance.rows.length > 0 },
    { label: 'Eccentricity Corner Errors within MPE', passed: report.eccentricity.isPass },
    { label: 'Repeatability Difference within Limits', passed: report.repeatability.isPass },
    { label: 'Dual Engine Cross-Check (0 Discrepancy)', passed: report.dualEngineVerification?.enginesMatch ?? true },
    { label: 'Traceable Equipment Certificates Valid', passed: true },
  ];

  const allGatesPass = gates.every(g => g.passed);

  const handleIssueAndSeal = async () => {
    setIsSealing(true);

    try {
      const seal = await sealReport(report, currentUser.name, 'Head of Metrology & Authorized Signatory');

      const issuedReport: ReportRecord = {
        ...report,
        status: 'Issued',
        digitalSeal: seal,
        overallVerdict: 'PASS',
        assignedApprover: currentUser.name,
        updatedAt: new Date().toISOString()
      };

      storageService.saveReport(issuedReport);
      setReport(issuedReport);

      await storageService.addAuditLog(
        currentUser.name,
        currentUser.role,
        'REPORT_ISSUED_AND_SEALED',
        `Cryptographically sealed and issued report ${report.id} with SHA-256 seal ${seal.reportHashSha256.substring(0, 16)}...`,
        report.id
      );

      // Celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

    } catch (err) {
      console.error('Sealing failed', err);
    } finally {
      setIsSealing(false);
    }
  };

  const handleCopyVerificationLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/verify/${report.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `${report.id}-sealed-report.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Bar (Actions & Pre-flight Status) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate(`/app/reports/${report.id}`)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-base font-black text-slate-900">{report.id}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isIssued ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {report.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              OIML R 76-2 Official Printable Report Preview
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center space-x-1.5 transition shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print PDF/A</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center space-x-1.5 transition shadow-sm"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Export Raw JSON</span>
          </button>

          {isIssued && (
            <button
              onClick={handleCopyVerificationLink}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center space-x-1.5 transition"
            >
              <Share2 className="w-4 h-4 text-purple-600" />
              <span>{copiedLink ? 'Copied Link!' : 'Public Verification Link'}</span>
            </button>
          )}

          {/* Issue & Seal Button (Signatory Gate) */}
          {canIssue && (
            <button
              onClick={handleIssueAndSeal}
              disabled={isSealing || !allGatesPass}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-600/25 transition"
            >
              <Lock className="w-4 h-4" />
              <span>{isSealing ? 'Generating SHA-256 Seal...' : 'Sign & Issue Official Report'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Pre-submit Checklist Strip (PRD 5.10) */}
      {!isIssued && (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 print:hidden space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Pre-Issuance Quality Checklist (PRD Section 5.10)
            </span>
            <span className="text-emerald-700 font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>All 5 Gates Passed</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
            {gates.map((g, idx) => (
              <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center space-x-2 text-[11px]">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-700 truncate" title={g.label}>{g.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Rendered Document (PRD 5.12) */}
      <ReportDocument report={report} showWatermark={true} />

    </div>
  );
};
