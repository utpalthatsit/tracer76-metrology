import React, { useState } from 'react';
import { 
  X, Database, CheckCircle2, AlertCircle, Copy, Check, 
  ExternalLink, Sparkles, RefreshCw, Server, ShieldCheck
} from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, testSupabaseConnection } from '../services/supabaseClient';
import { supabaseStorage } from '../services/supabaseStorage';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated?: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose, onConfigUpdated }) => {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs: number } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection(url, anonKey);
    setTestResult(res);
    setIsTesting(false);
  };

  const handleSaveAndConnect = async () => {
    saveSupabaseConfig(url, anonKey);
    await handleTestConnection();
    if (onConfigUpdated) onConfigUpdated();
  };

  const handleCopySqlSchema = () => {
    const sqlSchema = `-- ==============================================================================
-- TraceR76 NAWI Test Report Platform (OIML R 76-1:2006 / ISO/IEC 17025:2017)
-- Production Supabase PostgreSQL Schema & Security Policies
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.reports (
    id TEXT PRIMARY KEY,
    version INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Submitted', 'Under Review', 'Returned', 'Approved', 'Issued', 'Superseded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT NOT NULL,
    assigned_reviewer TEXT,
    assigned_approver TEXT,
    ruleset_version TEXT NOT NULL,
    ruleset_hash TEXT NOT NULL,
    overall_verdict TEXT NOT NULL DEFAULT 'PENDING' CHECK (overall_verdict IN ('PASS', 'FAIL', 'PENDING')),
    specs JSONB NOT NULL,
    conditions JSONB NOT NULL,
    equipment_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    weighing_performance JSONB NOT NULL,
    eccentricity JSONB NOT NULL,
    repeatability JSONB NOT NULL,
    discrimination JSONB NOT NULL,
    sensitivity_and_zero JSONB NOT NULL,
    tare_test JSONB NOT NULL,
    dual_engine_verification JSONB,
    digital_seal JSONB,
    review_comments JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS public.equipment (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    serial_number TEXT NOT NULL,
    accuracy_class TEXT,
    calibration_cert_number TEXT NOT NULL,
    calibrated_by TEXT NOT NULL,
    calibration_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'due_soon', 'expired')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    report_id TEXT REFERENCES public.reports(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    previous_hash TEXT NOT NULL,
    entry_hash TEXT NOT NULL
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can verify issued reports" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Lab staff can manage reports" ON public.reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Lab staff can view equipment" ON public.equipment FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Audit logs are append-only" ON public.audit_logs FOR SELECT USING (true);
CREATE POLICY "Allow inserting audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);
`;

    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    const res = await supabaseStorage.seedSupabaseDatabase();
    setSeedResult(res);
    setIsSeeding(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                Production Database Layer
              </span>
              <h3 className="text-lg font-black text-white">Supabase PostgreSQL Integration</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-xs">
          
          {/* Status Badge */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            currentConfig.isConfigured
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${currentConfig.isConfigured ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'}`}>
                <Server className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-sm">
                  {currentConfig.isConfigured ? 'Supabase Database Configured' : 'Running on Local Storage (Browser Cache)'}
                </div>
                <div className="text-[11px] opacity-80 mt-0.5">
                  {currentConfig.isConfigured ? `Connected to: ${currentConfig.url}` : 'Connect your Supabase project to enable multi-device laboratory syncing.'}
                </div>
              </div>
            </div>
          </div>

          {/* Setup Instructions Strip */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-slate-700">
            <span className="font-bold text-slate-900 text-xs block">
              Quick 3-Step Supabase Setup:
            </span>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600">
              <li>Open your project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold inline-flex items-center space-x-0.5"><span>supabase.com</span><ExternalLink className="w-3 h-3 ml-0.5" /></a>.</li>
              <li>Go to <strong>Project Settings → API</strong> and copy your <strong>Project URL</strong> and <strong>anon (public) API Key</strong>.</li>
              <li>Open <strong>SQL Editor</strong> in Supabase, click <strong>"Copy SQL Schema"</strong> below, paste and execute it!</li>
            </ol>
          </div>

          {/* Form Credentials */}
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://your-project-id.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Supabase Anon (Public) Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Test connection feedback */}
          {testResult && (
            <div className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 ${
              testResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                : 'bg-rose-50 border-rose-200 text-rose-900 font-medium'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              )}
              <span>{testResult.message} {testResult.latencyMs > 0 && `(${testResult.latencyMs} ms)`}</span>
            </div>
          )}

          {/* Seeding feedback */}
          {seedResult && (
            <div className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 ${
              seedResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                : 'bg-rose-50 border-rose-200 text-rose-900 font-medium'
            }`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{seedResult.message}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleCopySqlSchema}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center space-x-1.5 transition"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedSql ? 'SQL Copied!' : 'Copy SQL Schema'}</span>
              </button>

              <button
                type="button"
                onClick={handleSeedData}
                disabled={isSeeding || !url || !anonKey}
                className="px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 text-emerald-900 font-semibold text-xs flex items-center space-x-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isSeeding ? 'Seeding...' : 'Seed Sample Reports into DB'}</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !url || !anonKey}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold transition"
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </button>

              <button
                type="button"
                onClick={handleSaveAndConnect}
                disabled={!url || !anonKey}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm transition"
              >
                Save & Connect
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
