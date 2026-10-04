import { createClient } from '@supabase/supabase-js';

const url = 'https://ttetjzftfklteqodwphu.supabase.co';
const key = 'sb_publishable__bhvpXgiqwx5JumRZIJ_tA_qIg8Ehxy';
const supabase = createClient(url, key);

async function run() {
  console.log('--- 1. Testing Supabase Connection ---');
  const { data: ping, error: pingErr } = await supabase.from('equipment').select('count').limit(1);
  if (pingErr) {
    console.error('Connection failed:', pingErr);
    return;
  }
  console.log('Connected to Supabase PostgreSQL!');

  console.log('--- 2. Seeding Benchmark Reports ---');
  // Report 1: Avery Weigh-Tronix Benchmark
  const report1 = {
    id: 'R76-2026-0042',
    version: 1,
    status: 'Issued',
    created_at: '2026-09-18T09:30:00Z',
    updated_at: '2026-09-20T14:15:00Z',
    created_by: 'Dr. Marcus Vance',
    assigned_reviewer: 'Elena Rostova, M.Sc.',
    assigned_approver: 'Prof. Hans-Peter Weber',
    ruleset_version: '2026.1-A',
    ruleset_hash: '8f7a6b5c4d3e2f1a',
    overall_verdict: 'PASS',
    specs: {
      applicant: 'Avery Weigh-Tronix Global Ltd.',
      manufacturer: 'Avery Weigh-Tronix',
      model: 'ProScale Indicator ZM510-Bench',
      serialNumber: 'SN-2026-0042',
      softwareId: 'SW-R76-ZM510',
      softwareVersion: 'v2.10.4',
      accuracyClass: 'III',
      verificationType: 'initial',
      maxCapacity: 15.0,
      minCapacity: 0.1,
      scaleIntervalE: 0.005,
      scaleIntervalD: 0.005,
      numberOfIntervalsN: 3000,
      unit: 'kg',
      rangeType: 'single',
      tareType: 'subtractive',
      maxTare: 15.0,
      powerSupply: '230 V AC / 50 Hz & Internal Li-ion 7.4 V',
      tempMin: -10,
      tempMax: 40,
      loadReceptorShape: 'rectangular',
      loadReceptorDimensions: '350 mm × 400 mm'
    },
    conditions: {
      temperatureC: 21.4,
      relativeHumidityPercent: 52,
      atmosphericPressureHPa: 1012,
      mainsVoltageV: 230.2,
      mainsFrequencyHz: 50.0,
      location: 'National Testing Bay 3, Environmental Chamber A',
      testDate: '2026-09-18'
    },
    equipment_ids: ['EQ-WT-01', 'EQ-ENV-01'],
    weighing_performance: {
      status: 'completed',
      isPass: true,
      rows: [
        { id: 'row-1', direction: 'increasing', nominalLoad: 0.0, indication: 0.000, addedDeltaL: 0.0025, calculatedLoadP: 0.0, errorE: 0.0, zeroErrorE0: 0.0, correctedErrorEc: 0.0, mpe: 0.0025, margin: 0.0025, isPass: true },
        { id: 'row-2', direction: 'increasing', nominalLoad: 0.1, indication: 0.100, addedDeltaL: 0.0025, calculatedLoadP: 0.1, errorE: 0.0, zeroErrorE0: 0.0, correctedErrorEc: 0.0, mpe: 0.0025, margin: 0.0025, isPass: true },
        { id: 'row-3', direction: 'increasing', nominalLoad: 2.5, indication: 2.500, addedDeltaL: 0.0024, calculatedLoadP: 2.5001, errorE: 0.0001, zeroErrorE0: 0.0, correctedErrorEc: 0.0001, mpe: 0.0025, margin: 0.0024, isPass: true },
        { id: 'row-4', direction: 'increasing', nominalLoad: 5.0, indication: 5.000, addedDeltaL: 0.0023, calculatedLoadP: 5.0002, errorE: 0.0002, zeroErrorE0: 0.0, correctedErrorEc: 0.0002, mpe: 0.005, margin: 0.0048, isPass: true },
        { id: 'row-5', direction: 'increasing', nominalLoad: 10.0, indication: 10.000, addedDeltaL: 0.0021, calculatedLoadP: 10.0004, errorE: 0.0004, zeroErrorE0: 0.0, correctedErrorEc: 0.0004, mpe: 0.005, margin: 0.0046, isPass: true },
        { id: 'row-6', direction: 'increasing', nominalLoad: 15.0, indication: 15.000, addedDeltaL: 0.0020, calculatedLoadP: 15.0005, errorE: 0.0005, zeroErrorE0: 0.0, correctedErrorEc: 0.0005, mpe: 0.0075, margin: 0.0070, isPass: true }
      ]
    },
    eccentricity: { status: 'completed', isPass: true, loadL: 5.0, positions: [] },
    repeatability: { status: 'completed', isPass: true, halfMaxSeries: { loadLevel: 'half_max', nominalLoad: 7.5, runs: [] }, maxSeries: { loadLevel: 'max', nominalLoad: 15.0, runs: [] } },
    discrimination: { status: 'completed', isPass: true, tests: [] },
    sensitivity_and_zero: { status: 'completed', isPass: true, data: { initialZeroSettingRangePercent: 2.0, initialZeroRangePass: true, semiAutoZeroSettingRangePercent: 4.0, semiAutoZeroRangePass: true, zeroTrackingRateLimit: '0.5d/s', zeroTrackingPass: true, centerOfZeroIndication: 0, centerOfZeroError: 0.05, centerOfZeroPass: true } },
    tare_test: { status: 'completed', isPass: true, data: { tareLoadApplied: 5.0, tareIndication: 5.0, netZeroAccuracyError: 0.05, netWeighingErrorsPass: true } },
    dual_engine_verification: {
      engineA: { status: 'pass', computedHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', totalEvaluations: 11, maxEc: 0.0005 },
      engineB: { status: 'pass', computedHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', totalEvaluations: 11, maxEc: 0.0005 },
      enginesMatch: true,
      discrepancies: [],
      verifiedTimestamp: '2026-09-19T11:20:00Z'
    },
    digital_seal: {
      algorithm: 'SHA-256 / RSA-PSS-2048',
      reportHashSha256: '9a8f4c1e8b23c5d6e7f80123456789abcdef0123456789abcdef0123456789ab',
      signatureValue: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0f9k8...',
      signerName: 'Prof. Hans-Peter Weber',
      signerRole: 'Lead Legal Metrologist & Head of Certification',
      signerCertificateFingerprint: 'SHA256:4A:8B:12:F3:99:01:C2:55:7E:AA:BB:CC:DD:EE:FF:00',
      sealedAt: '2026-09-20T14:15:00Z',
      verificationUrl: 'http://localhost:3000/verify/R76-2026-0042',
      qrCodeDataUrl: '',
      iso17025AccreditationStatement: 'Testing performed under ISO/IEC 17025:2017 accreditation #MET-9941. Dual calculation engine verified with zero arithmetic fault.',
      rulesetVersion: '2026.1-A'
    },
    review_comments: []
  };

  // Report 2: Mettler Toledo Class II In-Progress
  const report2 = {
    id: 'R76-2026-0043',
    version: 1,
    status: 'Under Review',
    created_at: '2026-09-28T08:15:00Z',
    updated_at: '2026-10-01T16:00:00Z',
    created_by: 'Dr. Marcus Vance',
    assigned_reviewer: 'Elena Rostova, M.Sc.',
    assigned_approver: 'Prof. Hans-Peter Weber',
    ruleset_version: '2026.1-A',
    ruleset_hash: '8f7a6b5c4d3e2f1a',
    overall_verdict: 'PASS',
    specs: {
      applicant: 'Mettler Toledo International Inc.',
      manufacturer: 'Mettler Toledo AG, Greifensee',
      model: 'Precision Balance ME-204TE',
      serialNumber: 'MT-ME-204-7721',
      softwareId: 'SW-MT-ME-V3',
      softwareVersion: 'v3.0.1',
      accuracyClass: 'II',
      verificationType: 'initial',
      maxCapacity: 220.0,
      minCapacity: 0.02,
      scaleIntervalE: 0.001,
      scaleIntervalD: 0.0001,
      numberOfIntervalsN: 220000,
      unit: 'g',
      rangeType: 'single',
      tareType: 'subtractive',
      maxTare: 220.0,
      powerSupply: '12V DC via external 100-240V adapter',
      tempMin: 10,
      tempMax: 30,
      loadReceptorShape: 'circular',
      loadReceptorDimensions: 'Ø 90 mm'
    },
    conditions: {
      temperatureC: 20.1,
      relativeHumidityPercent: 45,
      atmosphericPressureHPa: 1015,
      mainsVoltageV: 229.8,
      mainsFrequencyHz: 50.0,
      location: 'Cleanroom Metrology Lab #2',
      testDate: '2026-09-28'
    },
    equipment_ids: ['EQ-WT-01', 'EQ-ENV-01'],
    weighing_performance: { status: 'completed', isPass: true, rows: [] },
    eccentricity: { status: 'completed', isPass: true, loadL: 70.0, positions: [] },
    repeatability: { status: 'completed', isPass: true, halfMaxSeries: { loadLevel: 'half_max', nominalLoad: 100.0, runs: [] }, maxSeries: { loadLevel: 'max', nominalLoad: 200.0, runs: [] } },
    discrimination: { status: 'completed', isPass: true, tests: [] },
    sensitivity_and_zero: { status: 'completed', isPass: true, data: { initialZeroSettingRangePercent: 2.0, initialZeroRangePass: true, semiAutoZeroSettingRangePercent: 4.0, semiAutoZeroRangePass: true, zeroTrackingRateLimit: '0.5d/s', zeroTrackingPass: true, centerOfZeroIndication: 0, centerOfZeroError: 0.02, centerOfZeroPass: true } },
    tare_test: { status: 'completed', isPass: true, data: { tareLoadApplied: 50.0, tareIndication: 50.0, netZeroAccuracyError: 0.02, netWeighingErrorsPass: true } },
    dual_engine_verification: {
      engineA: { status: 'pass', computedHash: 'f4b1c2...', totalEvaluations: 8, maxEc: 0.0002 },
      engineB: { status: 'pass', computedHash: 'f4b1c2...', totalEvaluations: 8, maxEc: 0.0002 },
      enginesMatch: true,
      discrepancies: [],
      verifiedTimestamp: '2026-10-01T15:45:00Z'
    },
    review_comments: []
  };

  // Report 3: Sartorius Class I Analytical Draft
  const report3 = {
    id: 'R76-2026-0044',
    version: 1,
    status: 'Draft',
    created_at: '2026-10-02T07:00:00Z',
    updated_at: '2026-10-02T07:30:00Z',
    created_by: 'Dr. Marcus Vance',
    ruleset_version: '2026.1-A',
    ruleset_hash: '8f7a6b5c4d3e2f1a',
    overall_verdict: 'PENDING',
    specs: {
      applicant: 'Sartorius Lab Instruments GmbH & Co. KG',
      manufacturer: 'Sartorius Lab Instruments, Goettingen',
      model: 'Cubis II Micro-Balance MCA2.7S',
      serialNumber: 'SAR-2026-MCA-0019',
      softwareId: 'SW-CUBIS-II',
      softwareVersion: 'v1.4.0',
      accuracyClass: 'I',
      verificationType: 'initial',
      maxCapacity: 2.1,
      minCapacity: 0.0001,
      scaleIntervalE: 0.001,
      scaleIntervalD: 0.0001,
      numberOfIntervalsN: 2100000,
      unit: 'g',
      rangeType: 'single',
      tareType: 'subtractive',
      maxTare: 2.1,
      powerSupply: '15V DC via external medical-grade PSU',
      tempMin: 15,
      tempMax: 25,
      loadReceptorShape: 'circular',
      loadReceptorDimensions: 'Ø 30 mm'
    },
    conditions: {
      temperatureC: 20.0,
      relativeHumidityPercent: 50,
      atmosphericPressureHPa: 1013,
      mainsVoltageV: 230.0,
      mainsFrequencyHz: 50.0,
      location: 'Sub-Micro Analytical Isolation Cell',
      testDate: '2026-10-02'
    },
    equipment_ids: ['EQ-WT-03', 'EQ-ENV-01'],
    weighing_performance: { status: 'in_progress', isPass: false, rows: [] },
    eccentricity: { status: 'pending', isPass: false, loadL: 0.7, positions: [] },
    repeatability: { status: 'pending', isPass: false, halfMaxSeries: { loadLevel: 'half_max', nominalLoad: 1.0, runs: [] }, maxSeries: { loadLevel: 'max', nominalLoad: 2.0, runs: [] } },
    discrimination: { status: 'pending', isPass: false, tests: [] },
    sensitivity_and_zero: { status: 'pending', isPass: false, data: { initialZeroSettingRangePercent: 0, initialZeroRangePass: false, semiAutoZeroSettingRangePercent: 0, semiAutoZeroRangePass: false, zeroTrackingRateLimit: '', zeroTrackingPass: false, centerOfZeroIndication: 0, centerOfZeroError: 0, centerOfZeroPass: false } },
    tare_test: { status: 'pending', isPass: false, data: { tareLoadApplied: 0, tareIndication: 0, netZeroAccuracyError: 0, netWeighingErrorsPass: false } },
    review_comments: []
  };

  const reports = [report1, report2, report3];
  for (const r of reports) {
    const { error } = await supabase.from('reports').upsert(r, { onConflict: 'id' });
    if (error) console.error('Error inserting report ' + r.id + ':', error.message);
    else console.log('✔ Successfully saved report ' + r.id + ' to Supabase!');
  }

  console.log('--- 3. Seeding Audit Logs ---');
  const logs = [
    {
      id: 'aud-001',
      report_id: 'R76-2026-0042',
      timestamp: '2026-09-18T09:30:00Z',
      actor_name: 'Dr. Marcus Vance',
      actor_role: 'test_engineer',
      action: 'REPORT_CREATED',
      details: 'Initialized report for Avery Weigh-Tronix ZM510-Bench (Class III, 15kg/5g). Ruleset v3.2.1-intl locked.',
      previous_hash: 'GENESIS_0000000000000000000000000000000000000000000000000000000000000000',
      entry_hash: 'b7f43b7194f481a5323497e551e18d3ef711b7d5bf2962fa9c3be79efc39bf58'
    },
    {
      id: 'aud-002',
      report_id: 'R76-2026-0042',
      timestamp: '2026-09-18T10:45:00Z',
      actor_name: 'Dr. Marcus Vance',
      actor_role: 'test_engineer',
      action: 'DATA_INGESTION_COMPLETED',
      details: 'Captured 11 weighing observations (6 increasing, 5 decreasing) via Web Serial RS-232 telemetry stream.',
      previous_hash: 'b7f43b7194f481a5323497e551e18d3ef711b7d5bf2962fa9c3be79efc39bf58',
      entry_hash: '4d8a1c93f0b2e8a1567d4e3c9a2f1b0c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a'
    },
    {
      id: 'aud-003',
      report_id: 'R76-2026-0042',
      timestamp: '2026-09-19T11:20:00Z',
      actor_name: 'Elena Rostova, M.Sc.',
      actor_role: 'reviewer',
      action: 'DUAL_ENGINE_VERIFIED',
      details: 'Dual calculation verified. Engine A (TypeScript) and Engine B (Python/WASM) produced 100% identical results. 0 discrepancies.',
      previous_hash: '4d8a1c93f0b2e8a1567d4e3c9a2f1b0c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a',
      entry_hash: '9e2b4c6d8f0a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f7a9c1e'
    },
    {
      id: 'aud-004',
      report_id: 'R76-2026-0042',
      timestamp: '2026-09-20T14:15:00Z',
      actor_name: 'Prof. Hans-Peter Weber',
      actor_role: 'approver',
      action: 'REPORT_ISSUED_AND_SEALED',
      details: 'Certificate sealed with SHA-256 digital fingerprint and issued. Public QR verification enabled at /verify/R76-2026-0042.',
      previous_hash: '9e2b4c6d8f0a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f7a9c1e',
      entry_hash: 'c3f1e5a7b9d2f4a6c8e0b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3'
    }
  ];

  for (const log of logs) {
    const { error } = await supabase.from('audit_logs').upsert(log, { onConflict: 'id' });
    if (error) console.error('Error inserting log ' + log.id + ':', error.message);
    else console.log('✔ Successfully saved audit log ' + log.id + ' to Supabase!');
  }

  console.log('--- 4. Verification Check ---');
  const repCount = await supabase.from('reports').select('id', { count: 'exact' });
  const eqCount = await supabase.from('equipment').select('id', { count: 'exact' });
  const audCount = await supabase.from('audit_logs').select('id', { count: 'exact' });

  console.log(`Supabase Live Stats:
  - Reports in DB: ${repCount.count}
  - Equipment in DB: ${eqCount.count}
  - Audit Logs in DB: ${audCount.count}`);
}

run();
