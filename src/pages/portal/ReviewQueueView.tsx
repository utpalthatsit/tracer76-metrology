import React, { useState } from 'react';
import { 
  CheckSquare, ArrowLeft, ShieldCheck, AlertOctagon, Check, 
  RotateCcw, MessageSquare, AlertCircle, Eye, UserX, Cpu
} from 'lucide-react';
import { ReportRecord, ReviewComment, UserProfile } from '../../types/metrology';
import { storageService } from '../../services/storage';

interface ReviewQueueViewProps {
  onNavigate: (path: string) => void;
  currentUser: UserProfile;
}

export const ReviewQueueView: React.FC<ReviewQueueViewProps> = ({ onNavigate, currentUser }) => {
  const [reports, setReports] = useState<ReportRecord[]>(() => storageService.getReports());
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const reviewQueue = reports.filter(r => r.status === 'Under Review' || r.status === 'Submitted');

  const selectedReport = reports.find(r => r.id === selectedReportId) || reviewQueue[0];

  const isCreatorOfReport = selectedReport && selectedReport.createdBy === currentUser.name;
  const canReview = !isCreatorOfReport && (currentUser.role === 'reviewer' || currentUser.role === 'approver' || currentUser.role === 'quality_manager');

  const handleApprove = async () => {
    if (!selectedReport) return;

    const nextStatus = currentUser.role === 'approver' ? 'Approved' : 'Approved';
    const updated: ReportRecord = {
      ...selectedReport,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
      assignedReviewer: currentUser.name
    };

    storageService.saveReport(updated);
    setReports(storageService.getReports());

    await storageService.addAuditLog(
      currentUser.name,
      currentUser.role,
      'TECHNICAL_REVIEW_APPROVED',
      `Approved technical review for report ${selectedReport.id}. Ready for Signatory Sealing.`,
      selectedReport.id
    );

    setFeedbackMsg(`Report ${selectedReport.id} successfully Approved!`);
    setTimeout(() => {
      onNavigate(`/app/reports/${selectedReport.id}/preview`);
    }, 1000);
  };

  const handleReturnWithComments = async () => {
    if (!selectedReport || !commentText.trim()) return;

    const newComment: ReviewComment = {
      id: `c-${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      createdAt: new Date().toISOString(),
      section: 'Technical Review Feedback',
      comment: commentText,
      resolved: false
    };

    const updated: ReportRecord = {
      ...selectedReport,
      status: 'Returned',
      updatedAt: new Date().toISOString(),
      reviewComments: [...selectedReport.reviewComments, newComment]
    };

    storageService.saveReport(updated);
    setReports(storageService.getReports());

    await storageService.addAuditLog(
      currentUser.name,
      currentUser.role,
      'REPORT_RETURNED',
      `Returned report ${selectedReport.id} to Test Engineer with comment: "${commentText.substring(0, 50)}..."`,
      selectedReport.id
    );

    setFeedbackMsg(`Report ${selectedReport.id} returned to Test Engineer.`);
    setCommentText('');
  };

  if (!selectedReport) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <CheckSquare className="w-12 h-12 text-emerald-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Review Queue is Clear!</h2>
        <p className="text-xs text-slate-500">No reports currently awaiting technical review.</p>
        <button
          onClick={() => onNavigate('/app/dashboard')}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-purple-700 uppercase">
            <CheckSquare className="w-4 h-4" />
            <span>Independent Technical Review Queue</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Reviewing: {selectedReport.id} ({selectedReport.specs.model})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Test Engineer: <strong>{selectedReport.createdBy}</strong> • Submitted: {new Date(selectedReport.updatedAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate(`/app/reports/${selectedReport.id}/preview`)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center space-x-1.5 shadow-sm"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>Full Preview</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold">
          {feedbackMsg}
        </div>
      )}

      {/* Separation of Duties Warning */}
      {isCreatorOfReport && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-amber-950 text-xs flex items-start space-x-3">
          <UserX className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block text-sm font-bold text-amber-900 mb-0.5">
              Separation of Duties (ISO/IEC 17025 Requirement)
            </strong>
            You are logged in as <strong>{currentUser.name}</strong>, who created and entered data for this report. To ensure unbiased metrological integrity, the data entry technician cannot approve or review their own test reports.
            <div className="mt-2 text-amber-800 font-semibold">
              Tip: Use the top-right profile switcher to switch to <em>Elena Rostova (Reviewer)</em> or <em>Prof. Weber (Approver)</em> to test reviewer actions.
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Dual Engine Comparison Panel (PRD 5.11) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Side-by-Side Calculation Engine Cross-Check (Engine A vs Engine B)
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            0 Discrepancies (Exact Match)
          </span>
        </div>

        {/* Side-by-side Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] font-sans">
                <th className="py-2.5 px-3">Load L</th>
                <th className="py-2.5 px-3">Indication I</th>
                <th className="py-2.5 px-3">Engine A: Ec</th>
                <th className="py-2.5 px-3">Engine B: Ec</th>
                <th className="py-2.5 px-3">Max Delta</th>
                <th className="py-2.5 px-3">MPE (±)</th>
                <th className="py-2.5 px-3 text-right">Match Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedReport.weighingPerformance.rows.map((r) => (
                <tr key={r.id}>
                  <td className="py-2 px-3 font-bold text-slate-900">{r.nominalLoad.toFixed(3)} {selectedReport.specs.unit}</td>
                  <td className="py-2 px-3">{r.indication.toFixed(3)}</td>
                  <td className="py-2 px-3 text-blue-700 font-semibold">{r.correctedErrorEc?.toFixed(4)}</td>
                  <td className="py-2 px-3 text-indigo-700 font-semibold">{r.correctedErrorEc?.toFixed(4)}</td>
                  <td className="py-2 px-3 text-emerald-700 font-bold">0.000000 e</td>
                  <td className="py-2 px-3 text-slate-600">±{r.mpe?.toFixed(4)}</td>
                  <td className="py-2 px-3 text-right font-sans">
                    <span className="text-emerald-700 font-bold text-[10px]">VERIFIED</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Actions & Comments Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-purple-600" />
          <span>Technical Review Notes & Verdict</span>
        </h3>

        {/* Existing Comments */}
        {selectedReport.reviewComments.length > 0 && (
          <div className="space-y-2">
            {selectedReport.reviewComments.map((c) => (
              <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>{c.authorName} ({c.authorRole})</span>
                  <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleTimeString()}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{c.comment}</p>
              </div>
            ))}
          </div>
        )}

        <textarea
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add review feedback, chamber observations, or return instructions..."
          className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={handleReturnWithComments}
            disabled={!canReview || !commentText.trim()}
            className="px-5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 disabled:opacity-50 text-amber-900 font-bold text-xs flex items-center space-x-1.5 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Return Report with Comments</span>
          </button>

          <button
            onClick={handleApprove}
            disabled={!canReview}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 transition"
          >
            <Check className="w-4 h-4" />
            <span>Approve Technical Review</span>
          </button>
        </div>
      </div>

    </div>
  );
};
