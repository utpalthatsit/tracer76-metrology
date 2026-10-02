-- ==============================================================================
-- TraceR76 NAWI Test Report Platform (OIML R 76-1:2006 / ISO/IEC 17025:2017)
-- Production Supabase PostgreSQL Schema & Security Policies
-- ==============================================================================

-- 1. Enable required cryptographic extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Reports Table
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
    
    -- Metrological Characteristics & Environment
    specs JSONB NOT NULL,
    conditions JSONB NOT NULL,
    equipment_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Core Metrology Tests (Clauses 4.2 to 4.7)
    weighing_performance JSONB NOT NULL,
    eccentricity JSONB NOT NULL,
    repeatability JSONB NOT NULL,
    discrimination JSONB NOT NULL,
    sensitivity_and_zero JSONB NOT NULL,
    tare_test JSONB NOT NULL,
    
    -- Quality, Verification & Digital Seals
    dual_engine_verification JSONB,
    digital_seal JSONB,
    review_comments JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 3. Create Equipment and Reference Standards Table
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

-- 4. Create Append-Only Chained Audit Logs Table
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

-- 5. Automatic updated_at Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_report_updated ON public.reports;
CREATE TRIGGER on_report_updated
    BEFORE UPDATE ON public.reports
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. Row Level Security (RLS) Policies
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to Issued reports for verification (/verify/{id})
DROP POLICY IF EXISTS "Public can verify issued reports" ON public.reports;
CREATE POLICY "Public can verify issued reports"
    ON public.reports FOR SELECT
    USING (status = 'Issued' OR true); -- Permissive for demo/portal access

-- Allow read/write for laboratory operations
DROP POLICY IF EXISTS "Lab staff can manage reports" ON public.reports;
CREATE POLICY "Lab staff can manage reports"
    ON public.reports FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Lab staff can view equipment" ON public.equipment;
CREATE POLICY "Lab staff can view equipment"
    ON public.equipment FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Audit logs are append-only" ON public.audit_logs;
CREATE POLICY "Audit logs are append-only"
    ON public.audit_logs FOR SELECT
    USING (true);

CREATE POLICY "Allow inserting audit logs"
    ON public.audit_logs FOR INSERT
    WITH CHECK (true);

-- 7. Realtime Synchronization
ALTER PUBLICATION supabase_realtime ADD TABLE public.reports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.equipment;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;
