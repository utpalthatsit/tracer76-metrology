import { getSupabaseClient } from './supabaseClient';
import { AuditLogEntry, EquipmentRecord, ReportRecord } from '../types/metrology';
import { buildInitialReports, INITIAL_EQUIPMENT, INITIAL_AUDIT_LOGS } from './storage';

export class SupabaseStorageService {
  /**
   * Fetch all reports from Supabase (or fallback to local storage)
   */
  public async getReports(): Promise<{ reports: ReportRecord[]; fromSupabase: boolean }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { reports: this.getLocalReports(), fromSupabase: false };
    }

    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error || !data || data.length === 0) {
        console.warn('Supabase reports fetch returned empty or error, using local fallback:', error?.message);
        return { reports: this.getLocalReports(), fromSupabase: false };
      }

      // Map DB snake_case/jsonb fields to camelCase ReportRecord
      const mapped: ReportRecord[] = data.map((d: any) => ({
        id: d.id,
        version: d.version,
        status: d.status,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
        createdBy: d.created_by,
        assignedReviewer: d.assigned_reviewer,
        assignedApprover: d.assigned_approver,
        rulesetVersion: d.ruleset_version,
        rulesetHash: d.ruleset_hash,
        overallVerdict: d.overall_verdict,
        specs: d.specs,
        conditions: d.conditions,
        equipmentIds: d.equipment_ids || [],
        weighingPerformance: d.weighing_performance,
        eccentricity: d.eccentricity,
        repeatability: d.repeatability,
        discrimination: d.discrimination,
        sensitivityAndZero: d.sensitivity_and_zero,
        tareTest: d.tare_test,
        dualEngineVerification: d.dual_engine_verification,
        digitalSeal: d.digital_seal,
        reviewComments: d.review_comments || []
      }));

      // Cache locally as offline mirror
      localStorage.setItem('tracer76_reports_v3', JSON.stringify(mapped));
      return { reports: mapped, fromSupabase: true };
    } catch (err) {
      console.error('Supabase query error:', err);
      return { reports: this.getLocalReports(), fromSupabase: false };
    }
  }

  /**
   * Save or update a single report into Supabase
   */
  public async saveReport(report: ReportRecord): Promise<{ success: boolean; error?: string }> {
    // 1. Always update local cache
    const local = this.getLocalReports();
    const idx = local.findIndex(r => r.id === report.id);
    if (idx >= 0) {
      local[idx] = { ...report, updatedAt: new Date().toISOString() };
    } else {
      local.unshift(report);
    }
    localStorage.setItem('tracer76_reports_v3', JSON.stringify(local));

    // 2. Sync to Supabase if configured
    const supabase = getSupabaseClient();
    if (!supabase) return { success: true };

    try {
      const payload = {
        id: report.id,
        version: report.version,
        status: report.status,
        updated_at: new Date().toISOString(),
        created_by: report.createdBy,
        assigned_reviewer: report.assignedReviewer || null,
        assigned_approver: report.assignedApprover || null,
        ruleset_version: report.rulesetVersion,
        ruleset_hash: report.rulesetHash,
        overall_verdict: report.overallVerdict,
        specs: report.specs,
        conditions: report.conditions,
        equipment_ids: report.equipmentIds,
        weighing_performance: report.weighingPerformance,
        eccentricity: report.eccentricity,
        repeatability: report.repeatability,
        discrimination: report.discrimination,
        sensitivity_and_zero: report.sensitivityAndZero,
        tare_test: report.tareTest,
        dual_engine_verification: report.dualEngineVerification || null,
        digital_seal: report.digitalSeal || null,
        review_comments: report.reviewComments || []
      };

      const { error } = await supabase.from('reports').upsert(payload, { onConflict: 'id' });
      if (error) {
        console.error('Supabase report upsert error:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Fetch equipment from Supabase
   */
  public async getEquipment(): Promise<EquipmentRecord[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      const raw = localStorage.getItem('tracer76_equipment_v3');
      return raw ? JSON.parse(raw) : INITIAL_EQUIPMENT;
    }

    try {
      const { data, error } = await supabase.from('equipment').select('*');
      if (error || !data || data.length === 0) {
        const raw = localStorage.getItem('tracer76_equipment_v3');
        return raw ? JSON.parse(raw) : INITIAL_EQUIPMENT;
      }

      return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        type: d.type,
        serialNumber: d.serial_number,
        accuracyClass: d.accuracy_class,
        calibrationCertNumber: d.calibration_cert_number,
        calibratedBy: d.calibrated_by,
        calibrationDate: d.calibration_date,
        expiryDate: d.expiry_date,
        status: d.status
      }));
    } catch {
      const raw = localStorage.getItem('tracer76_equipment_v3');
      return raw ? JSON.parse(raw) : INITIAL_EQUIPMENT;
    }
  }

  /**
   * Seed default benchmark reports and equipment into newly created Supabase DB
   */
  public async seedSupabaseDatabase(): Promise<{ success: boolean; message: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, message: 'Supabase client is not configured. Please save your URL and Anon Key first.' };
    }

    try {
      // 1. Seed equipment
      for (const eq of INITIAL_EQUIPMENT) {
        await supabase.from('equipment').upsert({
          id: eq.id,
          name: eq.name,
          type: eq.type,
          serial_number: eq.serialNumber,
          accuracy_class: eq.accuracyClass,
          calibration_cert_number: eq.calibrationCertNumber,
          calibrated_by: eq.calibratedBy,
          calibration_date: eq.calibrationDate,
          expiry_date: eq.expiryDate,
          status: eq.status
        }, { onConflict: 'id' });
      }

      // 2. Seed initial reports
      const reports = buildInitialReports();
      for (const rep of reports) {
        await this.saveReport(rep);
      }

      // 3. Seed initial audit logs
      for (const aud of INITIAL_AUDIT_LOGS) {
        await supabase.from('audit_logs').upsert({
          id: aud.id,
          report_id: aud.reportId,
          timestamp: aud.timestamp,
          actor_name: aud.actorName,
          actor_role: aud.actorRole,
          action: aud.action,
          details: aud.details,
          previous_hash: aud.previousHash,
          entry_hash: aud.entryHash
        }, { onConflict: 'id' });
      }

      return {
        success: true,
        message: 'Successfully seeded 3 benchmark test reports, standard weights, and audit logs into your Supabase PostgreSQL database!'
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Seeding failed. Ensure SQL schema migration has been executed in Supabase.' };
    }
  }

  private getLocalReports(): ReportRecord[] {
    const raw = localStorage.getItem('tracer76_reports_v3');
    if (!raw) {
      const initial = buildInitialReports();
      localStorage.setItem('tracer76_reports_v3', JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return buildInitialReports();
    }
  }
}

export const supabaseStorage = new SupabaseStorageService();
