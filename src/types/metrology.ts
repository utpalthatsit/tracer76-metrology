export type AccuracyClass = 'I' | 'II' | 'III' | 'IIII';
export type VerificationType = 'initial' | 'in_service';
export type ReportStatus = 
  | 'Draft' 
  | 'Submitted' 
  | 'Under Review' 
  | 'Returned' 
  | 'Approved' 
  | 'Issued' 
  | 'Superseded';

export type UserRole = 
  | 'test_engineer' 
  | 'reviewer' 
  | 'approver' 
  | 'lab_admin' 
  | 'quality_manager' 
  | 'applicant' 
  | 'public_verifier';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  labName: string;
  avatar?: string;
  signatureImage?: string;
}

export interface InstrumentSpecs {
  applicant: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  softwareId: string;
  softwareVersion: string;
  accuracyClass: AccuracyClass;
  verificationType: VerificationType;
  maxCapacity: number; // in unit
  minCapacity: number; // in unit
  scaleIntervalE: number; // verification scale interval e
  scaleIntervalD: number; // actual scale interval d
  numberOfIntervalsN: number; // n = Max / e
  unit: 'g' | 'kg' | 't' | 'mg';
  rangeType: 'single' | 'multi_interval' | 'multiple_range';
  tareType: 'none' | 'subtractive' | 'additive';
  maxTare?: number;
  powerSupply: string; // e.g. 230V AC / 50Hz or Battery 12V
  tempMin: number; // °C
  tempMax: number; // °C
  humidityLimit?: number; // %
  loadReceptorShape: 'rectangular' | 'circular';
  loadReceptorDimensions?: string; // e.g. "300 x 400 mm"
}

export interface CalculationWhy {
  clause: string;
  standard: string;
  formula: string;
  substitutions: {
    label: string;
    symbol: string;
    value: string | number;
    unit?: string;
  }[];
  steps: string[];
  mpeBand: {
    rangeMin: number;
    rangeMax: number;
    unit: string;
    factorE: number;
    computedMpe: number;
  };
  margin: number; // |MPE| - |Ec|
  verdictRationale: string;
}

export interface WeighingRow {
  id: string;
  direction: 'increasing' | 'decreasing';
  nominalLoad: number; // L
  indication: number; // I
  addedDeltaL: number; // ΔL
  calculatedLoadP?: number; // P = I + 0.5e - ΔL
  errorE?: number; // E = P - L
  zeroErrorE0?: number; // E0 from zero load
  correctedErrorEc?: number; // Ec = E - E0
  mpe?: number; // ± MPE
  margin?: number; // |MPE| - |Ec|
  isPass?: boolean;
  why?: CalculationWhy;
  remarks?: string;
  photoUrl?: string;
}

export interface EccentricityPosition {
  id: string;
  positionNumber: number; // 1 = Center, 2-5 = Corners/Quadrants
  positionName: string;
  loadL: number; // e.g. 1/3 Max
  indication: number;
  addedDeltaL: number;
  calculatedLoadP?: number;
  errorE?: number;
  correctedErrorEc?: number;
  mpe?: number;
  isPass?: boolean;
  why?: CalculationWhy;
}

export interface RepeatabilityRun {
  runNumber: number;
  indication: number;
  addedDeltaL: number;
  calculatedLoadP: number;
  errorE: number;
}

export interface RepeatabilitySeries {
  loadLevel: 'half_max' | 'max';
  nominalLoad: number;
  runs: RepeatabilityRun[];
  maxP?: number;
  minP?: number;
  diffRange?: number; // Pmax - Pmin
  maxAllowedRange?: number; // MPE for that load
  isPass?: boolean;
  why?: CalculationWhy;
}

export interface DiscriminationTest {
  loadLevel: 'min' | 'half_max' | 'max';
  nominalLoad: number;
  initialIndication: number;
  addedDeltaLInitial: number;
  calculatedP1: number;
  extraLoad14d: number; // 1.4 * d
  subsequentIndication: number;
  indicationDifference: number; // I2 - I1
  requiredDifference: number; // at least 1d
  isPass: boolean;
  why?: CalculationWhy;
}

export interface SensitivityAndZeroTest {
  initialZeroSettingRangePercent: number; // Clause 4.5.1: e.g. ± 2% of Max
  initialZeroRangePass: boolean;
  semiAutoZeroSettingRangePercent: number; // Clause 4.5.2: e.g. 4% of Max (-1% to +3%)
  semiAutoZeroRangePass: boolean;
  zeroTrackingRateLimit: string; // Clause 4.5.4: max 0.5d/s
  zeroTrackingPass: boolean;
  centerOfZeroIndication: number;
  centerOfZeroError: number; // max ± 0.25e
  centerOfZeroPass: boolean;
  why?: CalculationWhy;
}

export interface TareTest {
  tareLoadApplied: number;
  tareIndication: number;
  netZeroAccuracyError: number; // within ± 0.25e
  netWeighingErrorsPass: boolean;
  why?: CalculationWhy;
}

export interface TestConditions {
  temperatureC: number;
  relativeHumidityPercent: number;
  atmosphericPressureHPa?: number;
  mainsVoltageV: number;
  mainsFrequencyHz: number;
  location: string;
  testDate: string;
}

export interface EquipmentRecord {
  id: string;
  name: string;
  type: 'standard_weight_set' | 'digital_multimeter' | 'thermo_hygrometer' | 'barometer';
  serialNumber: string;
  accuracyClass?: string; // e.g. E2, F1, F2, M1
  calibrationCertNumber: string;
  calibratedBy: string;
  calibrationDate: string;
  expiryDate: string;
  status: 'valid' | 'due_soon' | 'expired';
}

export interface DualEngineResult {
  engineA: {
    status: 'pass' | 'fail';
    computedHash: string;
    totalEvaluations: number;
    maxEc: number;
  };
  engineB: {
    status: 'pass' | 'fail';
    computedHash: string;
    totalEvaluations: number;
    maxEc: number;
  };
  enginesMatch: boolean;
  discrepancies: {
    testName: string;
    rowId: string;
    engineAValue: number;
    engineBValue: number;
    delta: number;
  }[];
  verifiedTimestamp: string;
}

export interface DigitalSeal {
  algorithm: 'SHA-256 / RSA-PSS-2048' | 'SHA-256 / ECDSA-P256';
  reportHashSha256: string;
  signatureValue: string;
  signerName: string;
  signerRole: string;
  signerCertificateFingerprint: string;
  sealedAt: string;
  verificationUrl: string;
  qrCodeDataUrl: string;
  iso17025AccreditationStatement: string;
  rulesetVersion: string;
}

export interface ReviewComment {
  id: string;
  authorName: string;
  authorRole: UserRole;
  createdAt: string;
  section: string;
  comment: string;
  resolved: boolean;
}

export interface AuditLogEntry {
  id: string;
  reportId?: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  details: string;
  previousHash: string;
  entryHash: string;
}

export interface ReportRecord {
  id: string; // e.g. "R76-2026-0042"
  version: number;
  revisionReason?: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedReviewer?: string;
  assignedApprover?: string;
  rulesetVersion: string;
  rulesetHash: string;
  
  specs: InstrumentSpecs;
  conditions: TestConditions;
  equipmentIds: string[];

  // Tests data
  weighingPerformance: {
    status: 'pending' | 'in_progress' | 'completed';
    isPass: boolean;
    rows: WeighingRow[];
  };
  eccentricity: {
    status: 'pending' | 'in_progress' | 'completed';
    isPass: boolean;
    loadL: number;
    positions: EccentricityPosition[];
  };
  repeatability: {
    status: 'pending' | 'in_progress' | 'completed';
    isPass: boolean;
    halfMaxSeries: RepeatabilitySeries;
    maxSeries: RepeatabilitySeries;
  };
  discrimination: {
    status: 'pending' | 'in_progress' | 'completed';
    isPass: boolean;
    tests: DiscriminationTest[];
  };
  sensitivityAndZero: {
    status: 'pending' | 'in_progress' | 'completed';
    isPass: boolean;
    data: SensitivityAndZeroTest;
  };
  tareTest: {
    status: 'pending' | 'in_progress' | 'completed';
    isPass: boolean;
    data: TareTest;
  };

  dualEngineVerification?: DualEngineResult;
  digitalSeal?: DigitalSeal;
  reviewComments: ReviewComment[];
  overallVerdict: 'PASS' | 'FAIL' | 'PENDING';
}
