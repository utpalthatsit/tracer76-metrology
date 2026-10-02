import { AuditLogEntry, EquipmentRecord, ReportRecord, UserProfile, UserRole } from '../types/metrology';
import { evaluateWeighingPerformanceEngineA } from './engineA';
import { runDualEngineVerification } from './dualEngineValidator';
import { sealReport, sha256 } from './cryptoSealer';
import { OIML_R76_RULESET } from './rulesets';

export const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'usr-eng-1',
    name: 'Dr. Marcus Vance',
    email: 'm.vance@national-metrology.org',
    role: 'test_engineer',
    labName: 'National Metrology Institute & Testing Laboratory',
    avatar: 'MV'
  },
  {
    id: 'usr-rev-1',
    name: 'Elena Rostova, M.Sc.',
    email: 'e.rostova@national-metrology.org',
    role: 'reviewer',
    labName: 'National Metrology Institute & Testing Laboratory',
    avatar: 'ER'
  },
  {
    id: 'usr-app-1',
    name: 'Prof. Hans-Peter Weber',
    email: 'hp.weber@national-metrology.org',
    role: 'approver',
    labName: 'National Metrology Institute & Testing Laboratory',
    avatar: 'HW'
  },
  {
    id: 'usr-adm-1',
    name: 'Kavita Sundaram',
    email: 'k.sundaram@national-metrology.org',
    role: 'lab_admin',
    labName: 'National Metrology Institute & Testing Laboratory',
    avatar: 'KS'
  },
  {
    id: 'usr-qm-1',
    name: 'Thomas Lindqvist',
    email: 't.lindqvist@national-metrology.org',
    role: 'quality_manager',
    labName: 'National Metrology Institute & Testing Laboratory',
    avatar: 'TL'
  },
  {
    id: 'usr-app-client',
    name: 'Arthur Pendelton (Applicant)',
    email: 'compliance@precision-scales-corp.com',
    role: 'applicant',
    labName: 'Precision Scales Corp (Client)',
    avatar: 'AP'
  }
];

export const INITIAL_EQUIPMENT: EquipmentRecord[] = [
  {
    id: 'EQ-WT-01',
    name: 'Class F1 Stainless Steel Weight Set (1g - 10kg)',
    type: 'standard_weight_set',
    serialNumber: 'F1-2024-8841',
    accuracyClass: 'F1 (OIML R 111)',
    calibrationCertNumber: 'NMI-CAL-2025-0842',
    calibratedBy: 'National Metrology Institute',
    calibrationDate: '2025-01-15',
    expiryDate: '2027-01-14',
    status: 'valid'
  },
  {
    id: 'EQ-WT-02',
    name: 'Class M1 Cast Iron Weights (5kg, 10kg, 20kg, 50kg)',
    type: 'standard_weight_set',
    serialNumber: 'M1-2023-1102',
    accuracyClass: 'M1 (OIML R 111)',
    calibrationCertNumber: 'NMI-CAL-2025-0911',
    calibratedBy: 'Legal Metrology Services',
    calibrationDate: '2025-03-10',
    expiryDate: '2026-10-25', // due soon
    status: 'due_soon'
  },
  {
    id: 'EQ-WT-03',
    name: 'Class E2 High Precision Micro-weight Set (1mg - 500g)',
    type: 'standard_weight_set',
    serialNumber: 'E2-2023-0094',
    accuracyClass: 'E2 (OIML R 111)',
    calibrationCertNumber: 'DKD-K-09201-2024',
    calibratedBy: 'PTB Accredited Metrology Lab',
    calibrationDate: '2024-06-20',
    expiryDate: '2026-06-19', // expired
    status: 'expired'
  },
  {
    id: 'EQ-ENV-01',
    name: 'Vaisala PTU300 Barometric, Humidity & Temp Transmitter',
    type: 'thermo_hygrometer',
    serialNumber: 'VAI-2024-0012',
    accuracyClass: 'Class A (±0.1°C, ±1.0% RH)',
    calibrationCertNumber: 'ENV-CAL-2025-004',
    calibratedBy: 'National Climatic Calibration Centre',
    calibrationDate: '2025-02-01',
    expiryDate: '2027-02-01',
    status: 'valid'
  },
  {
    id: 'EQ-DMM-01',
    name: 'Fluke 289 True-RMS Logging Multimeter',
    type: 'digital_multimeter',
    serialNumber: 'FLK-9921448',
    accuracyClass: '0.025% Basic DC',
    calibrationCertNumber: 'ELEC-2025-998',
    calibratedBy: 'Fluke Certified Calibration Service',
    calibrationDate: '2025-04-12',
    expiryDate: '2027-04-11',
    status: 'valid'
  }
];

export function buildInitialReports(): ReportRecord[] {
  // Report 1: Issued & Sealed Benchmark Report
  const specs1 = {
    applicant: 'Avery Weigh-Tronix Global Ltd.',
    manufacturer: 'Avery Weigh-Tronix',
    model: 'ProScale Indicator ZM510-Bench',
    serialNumber: 'SN-2026-0042',
    softwareId: 'SW-R76-ZM510',
    softwareVersion: 'v2.10.4',
    accuracyClass: 'III' as const,
    verificationType: 'initial' as const,
    maxCapacity: 15.0,
    minCapacity: 0.1, // 20e
    scaleIntervalE: 0.005,
    scaleIntervalD: 0.005,
    numberOfIntervalsN: 3000,
    unit: 'kg' as const,
    rangeType: 'single' as const,
    tareType: 'subtractive' as const,
    maxTare: 15.0,
    powerSupply: '230 V AC / 50 Hz & Internal Li-ion 7.4 V',
    tempMin: -10,
    tempMax: 40,
    loadReceptorShape: 'rectangular' as const,
    loadReceptorDimensions: '350 mm × 400 mm'
  };

  const rawRows1 = [
    { id: 'row-1', direction: 'increasing' as const, nominalLoad: 0.0, indication: 0.000, addedDeltaL: 0.0025 },
    { id: 'row-2', direction: 'increasing' as const, nominalLoad: 0.100, indication: 0.100, addedDeltaL: 0.0025 },
    { id: 'row-3', direction: 'increasing' as const, nominalLoad: 2.500, indication: 2.500, addedDeltaL: 0.0024 }, // 500e
    { id: 'row-4', direction: 'increasing' as const, nominalLoad: 5.000, indication: 5.000, addedDeltaL: 0.0023 }, // 1000e
    { id: 'row-5', direction: 'increasing' as const, nominalLoad: 10.000, indication: 10.000, addedDeltaL: 0.0021 }, // 2000e
    { id: 'row-6', direction: 'increasing' as const, nominalLoad: 15.000, indication: 15.000, addedDeltaL: 0.0020 }, // Max (3000e)
    { id: 'row-7', direction: 'decreasing' as const, nominalLoad: 10.000, indication: 10.000, addedDeltaL: 0.0022 },
    { id: 'row-8', direction: 'decreasing' as const, nominalLoad: 5.000, indication: 5.000, addedDeltaL: 0.0024 },
    { id: 'row-9', direction: 'decreasing' as const, nominalLoad: 2.500, indication: 2.500, addedDeltaL: 0.0025 },
    { id: 'row-10', direction: 'decreasing' as const, nominalLoad: 0.100, indication: 0.100, addedDeltaL: 0.0025 },
    { id: 'row-11', direction: 'decreasing' as const, nominalLoad: 0.000, indication: 0.000, addedDeltaL: 0.0025 },
  ];

  const eval1 = evaluateWeighingPerformanceEngineA(rawRows1, specs1);

  const report1: ReportRecord = {
    id: 'R76-2026-0042',
    version: 1,
    status: 'Issued',
    createdAt: '2026-09-18T09:30:00Z',
    updatedAt: '2026-09-20T14:15:00Z',
    createdBy: 'Dr. Marcus Vance',
    assignedReviewer: 'Elena Rostova, M.Sc.',
    assignedApprover: 'Prof. Hans-Peter Weber',
    rulesetVersion: OIML_R76_RULESET.version,
    rulesetHash: OIML_R76_RULESET.hash,
    specs: specs1,
    conditions: {
      temperatureC: 21.4,
      relativeHumidityPercent: 48.5,
      atmosphericPressureHPa: 1013.2,
      mainsVoltageV: 230.1,
      mainsFrequencyHz: 50.0,
      location: 'Metrology Lab Chamber #3, Temperature Controlled',
      testDate: '2026-09-18'
    },
    equipmentIds: ['EQ-WT-01', 'EQ-ENV-01', 'EQ-DMM-01'],
    weighingPerformance: {
      status: 'completed',
      isPass: eval1.isPass,
      rows: eval1.rows
    },
    eccentricity: {
      status: 'completed',
      isPass: true,
      loadL: 5.0, // 1/3 Max
      positions: [
        { id: 'pos-1', positionNumber: 1, positionName: 'Center', loadL: 5.0, indication: 5.000, addedDeltaL: 0.0025, calculatedLoadP: 5.000, errorE: 0.000, correctedErrorEc: 0.000, mpe: 0.005, isPass: true },
        { id: 'pos-2', positionNumber: 2, positionName: 'Front Left', loadL: 5.0, indication: 5.000, addedDeltaL: 0.0024, calculatedLoadP: 5.0001, errorE: 0.0001, correctedErrorEc: 0.0001, mpe: 0.005, isPass: true },
        { id: 'pos-3', positionNumber: 3, positionName: 'Back Left', loadL: 5.0, indication: 5.000, addedDeltaL: 0.0023, calculatedLoadP: 5.0002, errorE: 0.0002, correctedErrorEc: 0.0002, mpe: 0.005, isPass: true },
        { id: 'pos-4', positionNumber: 4, positionName: 'Back Right', loadL: 5.0, indication: 5.000, addedDeltaL: 0.0024, calculatedLoadP: 5.0001, errorE: 0.0001, correctedErrorEc: 0.0001, mpe: 0.005, isPass: true },
        { id: 'pos-5', positionNumber: 5, positionName: 'Front Right', loadL: 5.0, indication: 5.000, addedDeltaL: 0.0025, calculatedLoadP: 5.000, errorE: 0.000, correctedErrorEc: 0.000, mpe: 0.005, isPass: true },
      ]
    },
    repeatability: {
      status: 'completed',
      isPass: true,
      halfMaxSeries: {
        loadLevel: 'half_max',
        nominalLoad: 7.5,
        runs: [
          { runNumber: 1, indication: 7.500, addedDeltaL: 0.0025, calculatedLoadP: 7.500, errorE: 0.000 },
          { runNumber: 2, indication: 7.500, addedDeltaL: 0.0024, calculatedLoadP: 7.5001, errorE: 0.0001 },
          { runNumber: 3, indication: 7.500, addedDeltaL: 0.0025, calculatedLoadP: 7.500, errorE: 0.000 },
        ],
        diffRange: 0.0001,
        maxAllowedRange: 0.005,
        isPass: true
      },
      maxSeries: {
        loadLevel: 'max',
        nominalLoad: 15.0,
        runs: [
          { runNumber: 1, indication: 15.000, addedDeltaL: 0.0020, calculatedLoadP: 15.0005, errorE: 0.0005 },
          { runNumber: 2, indication: 15.000, addedDeltaL: 0.0021, calculatedLoadP: 15.0004, errorE: 0.0004 },
          { runNumber: 3, indication: 15.000, addedDeltaL: 0.0020, calculatedLoadP: 15.0005, errorE: 0.0005 },
        ],
        diffRange: 0.0001,
        maxAllowedRange: 0.0075,
        isPass: true
      }
    },
    discrimination: {
      status: 'completed',
      isPass: true,
      tests: [
        {
          loadLevel: 'min',
          nominalLoad: 0.1,
          initialIndication: 0.100,
          addedDeltaLInitial: 0.0025,
          calculatedP1: 0.100,
          extraLoad14d: 0.007,
          subsequentIndication: 0.105,
          indicationDifference: 0.005,
          requiredDifference: 0.005,
          isPass: true
        },
        {
          loadLevel: 'max',
          nominalLoad: 15.0,
          initialIndication: 15.000,
          addedDeltaLInitial: 0.0020,
          calculatedP1: 15.0005,
          extraLoad14d: 0.007,
          subsequentIndication: 15.005,
          indicationDifference: 0.005,
          requiredDifference: 0.005,
          isPass: true
        }
      ]
    },
    sensitivityAndZero: {
      status: 'completed',
      isPass: true,
      data: {
        initialZeroSettingRangePercent: 19.5,
        initialZeroRangePass: true,
        semiAutoZeroSettingRangePercent: 3.8,
        semiAutoZeroRangePass: true,
        zeroTrackingRateLimit: '0.4 d/s',
        zeroTrackingPass: true,
        centerOfZeroIndication: 0.000,
        centerOfZeroError: 0.0005,
        centerOfZeroPass: true
      }
    },
    tareTest: {
      status: 'completed',
      isPass: true,
      data: {
        tareLoadApplied: 5.0,
        tareIndication: 0.000,
        netZeroAccuracyError: 0.0002,
        netWeighingErrorsPass: true
      }
    },
    dualEngineVerification: runDualEngineVerification(eval1.rows, specs1),
    reviewComments: [
      {
        id: 'c-1',
        authorName: 'Elena Rostova, M.Sc.',
        authorRole: 'reviewer',
        createdAt: '2026-09-19T11:00:00Z',
        section: 'Weighing Performance',
        comment: 'Changeover points verified against dual engines. Excellent margin across 2000e band.',
        resolved: true
      }
    ],
    overallVerdict: 'PASS',
    digitalSeal: {
      algorithm: 'SHA-256 / ECDSA-P256',
      reportHashSha256: '9f83a45c213e8b091c8411b7dfb8f2c256087da344b1c3e1e91244e8839cb542',
      signatureValue: 'MEYCIQC9F83A45C213E8B091C8411B7DFB8F2C25IhAIdfB8F2C256087DA344B1C3E1E91244E8839CB542==',
      signerName: 'Prof. Hans-Peter Weber',
      signerRole: 'Head of Metrology & Authorized Signatory',
      signerCertificateFingerprint: 'SHA256:4F:9A:88:B1:0C:9F83A45C21:ISO17025',
      sealedAt: '2026-09-20T14:15:00Z',
      verificationUrl: 'https://tracer76.metrology.org/verify/R76-2026-0042',
      qrCodeDataUrl: '',
      iso17025AccreditationStatement: 'This report is generated under ISO/IEC 17025 accredited laboratory quality procedures and conforms to OIML R 76-1:2006 and OIML R 76-2:2007 test record standards.',
      rulesetVersion: OIML_R76_RULESET.version
    }
  };

  // Report 2: Submitted & Under Review
  const specs2 = {
    applicant: 'Sartorius Metrology Solutions GmbH',
    manufacturer: 'Sartorius',
    model: 'Secura Analytical Balance 224-1S',
    serialNumber: 'SN-2026-0089',
    softwareId: 'SEC-FIRMWARE-V4',
    softwareVersion: '4.2.1',
    accuracyClass: 'I' as const,
    verificationType: 'initial' as const,
    maxCapacity: 220.0,
    minCapacity: 0.01,
    scaleIntervalE: 0.001,
    scaleIntervalD: 0.0001,
    numberOfIntervalsN: 220000,
    unit: 'g' as const,
    rangeType: 'single' as const,
    tareType: 'subtractive' as const,
    powerSupply: '12V DC / 100-240V Adapter',
    tempMin: 10,
    tempMax: 30,
    loadReceptorShape: 'circular' as const,
    loadReceptorDimensions: 'Ø 90 mm'
  };

  const rawRows2 = [
    { id: 'r2-1', direction: 'increasing' as const, nominalLoad: 0.0, indication: 0.0000, addedDeltaL: 0.0005 },
    { id: 'r2-2', direction: 'increasing' as const, nominalLoad: 0.01, indication: 0.0100, addedDeltaL: 0.0005 },
    { id: 'r2-3', direction: 'increasing' as const, nominalLoad: 50.0, indication: 50.0000, addedDeltaL: 0.0004 }, // 50,000e (Band 1 limit)
    { id: 'r2-4', direction: 'increasing' as const, nominalLoad: 100.0, indication: 100.0001, addedDeltaL: 0.0003 }, // 100,000e (Band 2)
    { id: 'r2-5', direction: 'increasing' as const, nominalLoad: 200.0, indication: 200.0002, addedDeltaL: 0.0002 }, // 200,000e (Band 2 limit)
    { id: 'r2-6', direction: 'increasing' as const, nominalLoad: 220.0, indication: 220.0002, addedDeltaL: 0.0001 }, // Max
    { id: 'r2-7', direction: 'decreasing' as const, nominalLoad: 100.0, indication: 100.0001, addedDeltaL: 0.0004 },
    { id: 'r2-8', direction: 'decreasing' as const, nominalLoad: 0.0, indication: 0.0000, addedDeltaL: 0.0005 },
  ];

  const eval2 = evaluateWeighingPerformanceEngineA(rawRows2, specs2);

  const report2: ReportRecord = {
    id: 'R76-2026-0089',
    version: 1,
    status: 'Under Review',
    createdAt: '2026-10-01T08:15:00Z',
    updatedAt: '2026-10-01T16:00:00Z',
    createdBy: 'Dr. Marcus Vance',
    assignedReviewer: 'Elena Rostova, M.Sc.',
    assignedApprover: 'Prof. Hans-Peter Weber',
    rulesetVersion: OIML_R76_RULESET.version,
    rulesetHash: OIML_R76_RULESET.hash,
    specs: specs2,
    conditions: {
      temperatureC: 20.1,
      relativeHumidityPercent: 44.0,
      atmosphericPressureHPa: 1018.0,
      mainsVoltageV: 229.8,
      mainsFrequencyHz: 50.0,
      location: 'Cleanroom Class ISO 7 - Analytical Mass Vault',
      testDate: '2026-10-01'
    },
    equipmentIds: ['EQ-WT-01', 'EQ-ENV-01'],
    weighingPerformance: {
      status: 'completed',
      isPass: eval2.isPass,
      rows: eval2.rows
    },
    eccentricity: {
      status: 'completed',
      isPass: true,
      loadL: 70.0,
      positions: [
        { id: 'p2-1', positionNumber: 1, positionName: 'Center', loadL: 70.0, indication: 70.0000, addedDeltaL: 0.0005, calculatedLoadP: 70.0000, errorE: 0.0000, correctedErrorEc: 0.0000, mpe: 0.001, isPass: true },
        { id: 'p2-2', positionNumber: 2, positionName: 'Quadrant 1 (North)', loadL: 70.0, indication: 70.0001, addedDeltaL: 0.0004, calculatedLoadP: 70.0002, errorE: 0.0002, correctedErrorEc: 0.0002, mpe: 0.001, isPass: true },
        { id: 'p2-3', positionNumber: 3, positionName: 'Quadrant 2 (East)', loadL: 70.0, indication: 70.0000, addedDeltaL: 0.0005, calculatedLoadP: 70.0000, errorE: 0.0000, correctedErrorEc: 0.0000, mpe: 0.001, isPass: true },
        { id: 'p2-4', positionNumber: 4, positionName: 'Quadrant 3 (South)', loadL: 70.0, indication: 70.0001, addedDeltaL: 0.0004, calculatedLoadP: 70.0002, errorE: 0.0002, correctedErrorEc: 0.0002, mpe: 0.001, isPass: true },
        { id: 'p2-5', positionNumber: 5, positionName: 'Quadrant 4 (West)', loadL: 70.0, indication: 70.0000, addedDeltaL: 0.0005, calculatedLoadP: 70.0000, errorE: 0.0000, correctedErrorEc: 0.0000, mpe: 0.001, isPass: true },
      ]
    },
    repeatability: {
      status: 'completed',
      isPass: true,
      halfMaxSeries: {
        loadLevel: 'half_max',
        nominalLoad: 100.0,
        runs: [
          { runNumber: 1, indication: 100.0000, addedDeltaL: 0.0005, calculatedLoadP: 100.0000, errorE: 0.0000 },
          { runNumber: 2, indication: 100.0001, addedDeltaL: 0.0005, calculatedLoadP: 100.0001, errorE: 0.0001 },
          { runNumber: 3, indication: 100.0000, addedDeltaL: 0.0005, calculatedLoadP: 100.0000, errorE: 0.0000 },
        ],
        diffRange: 0.0001,
        maxAllowedRange: 0.001,
        isPass: true
      },
      maxSeries: {
        loadLevel: 'max',
        nominalLoad: 200.0,
        runs: [
          { runNumber: 1, indication: 200.0000, addedDeltaL: 0.0005, calculatedLoadP: 200.0000, errorE: 0.0000 },
          { runNumber: 2, indication: 200.0001, addedDeltaL: 0.0004, calculatedLoadP: 200.0002, errorE: 0.0002 },
          { runNumber: 3, indication: 200.0000, addedDeltaL: 0.0005, calculatedLoadP: 200.0000, errorE: 0.0000 },
        ],
        diffRange: 0.0002,
        maxAllowedRange: 0.0015,
        isPass: true
      }
    },
    discrimination: {
      status: 'completed',
      isPass: true,
      tests: [
        {
          loadLevel: 'max',
          nominalLoad: 200.0,
          initialIndication: 200.0000,
          addedDeltaLInitial: 0.0005,
          calculatedP1: 200.0000,
          extraLoad14d: 0.00014,
          subsequentIndication: 200.0002,
          indicationDifference: 0.0002,
          requiredDifference: 0.0001,
          isPass: true
        }
      ]
    },
    sensitivityAndZero: {
      status: 'completed',
      isPass: true,
      data: {
        initialZeroSettingRangePercent: 20.0,
        initialZeroRangePass: true,
        semiAutoZeroSettingRangePercent: 4.0,
        semiAutoZeroRangePass: true,
        zeroTrackingRateLimit: '0.2 d/s',
        zeroTrackingPass: true,
        centerOfZeroIndication: 0.0000,
        centerOfZeroError: 0.0001,
        centerOfZeroPass: true
      }
    },
    tareTest: {
      status: 'completed',
      isPass: true,
      data: {
        tareLoadApplied: 50.0,
        tareIndication: 0.0000,
        netZeroAccuracyError: 0.00005,
        netWeighingErrorsPass: true
      }
    },
    dualEngineVerification: runDualEngineVerification(eval2.rows, specs2),
    reviewComments: [
      {
        id: 'c-201',
        authorName: 'Elena Rostova, M.Sc.',
        authorRole: 'reviewer',
        createdAt: '2026-10-01T16:30:00Z',
        section: 'General',
        comment: 'Please confirm cleanroom draft shield was deployed during discrimination at 200g.',
        resolved: false
      }
    ],
    overallVerdict: 'PASS'
  };

  // Report 3: Draft
  const specs3 = {
    applicant: 'Kern & Sohn GmbH',
    manufacturer: 'Kern & Sohn',
    model: 'PCB Precision Balance 3500-2',
    serialNumber: 'SN-2026-0104',
    softwareId: 'KERN-PCB-2026',
    softwareVersion: 'v1.4',
    accuracyClass: 'II' as const,
    verificationType: 'initial' as const,
    maxCapacity: 3500.0,
    minCapacity: 0.5,
    scaleIntervalE: 0.05,
    scaleIntervalD: 0.01,
    numberOfIntervalsN: 70000,
    unit: 'g' as const,
    rangeType: 'single' as const,
    tareType: 'subtractive' as const,
    powerSupply: '9V DC Battery / 230V Mains',
    tempMin: 15,
    tempMax: 35,
    loadReceptorShape: 'rectangular' as const,
    loadReceptorDimensions: '130 mm × 130 mm'
  };

  const report3: ReportRecord = {
    id: 'R76-2026-0104',
    version: 1,
    status: 'Draft',
    createdAt: '2026-10-02T09:00:00Z',
    updatedAt: '2026-10-02T11:20:00Z',
    createdBy: 'Dr. Marcus Vance',
    rulesetVersion: OIML_R76_RULESET.version,
    rulesetHash: OIML_R76_RULESET.hash,
    specs: specs3,
    conditions: {
      temperatureC: 22.0,
      relativeHumidityPercent: 50.0,
      atmosphericPressureHPa: 1012.0,
      mainsVoltageV: 230.0,
      mainsFrequencyHz: 50.0,
      location: 'Bench 2 - Legal Metrology Lab',
      testDate: '2026-10-02'
    },
    equipmentIds: ['EQ-WT-01', 'EQ-ENV-01'],
    weighingPerformance: {
      status: 'in_progress',
      isPass: true,
      rows: [
        { id: 'r3-1', direction: 'increasing', nominalLoad: 0.0, indication: 0.00, addedDeltaL: 0.025, calculatedLoadP: 0.00, errorE: 0.00, correctedErrorEc: 0.00, mpe: 0.025, margin: 0.025, isPass: true },
        { id: 'r3-2', direction: 'increasing', nominalLoad: 250.0, indication: 250.00, addedDeltaL: 0.024, calculatedLoadP: 250.001, errorE: 0.001, correctedErrorEc: 0.001, mpe: 0.025, margin: 0.024, isPass: true },
      ]
    },
    eccentricity: {
      status: 'pending',
      isPass: true,
      loadL: 1000.0,
      positions: []
    },
    repeatability: {
      status: 'pending',
      isPass: true,
      halfMaxSeries: { loadLevel: 'half_max', nominalLoad: 1750, runs: [] },
      maxSeries: { loadLevel: 'max', nominalLoad: 3500, runs: [] }
    },
    discrimination: {
      status: 'pending',
      isPass: true,
      tests: []
    },
    sensitivityAndZero: {
      status: 'pending',
      isPass: true,
      data: {
        initialZeroSettingRangePercent: 20,
        initialZeroRangePass: true,
        semiAutoZeroSettingRangePercent: 4,
        semiAutoZeroRangePass: true,
        zeroTrackingRateLimit: '0.5 d/s',
        zeroTrackingPass: true,
        centerOfZeroIndication: 0,
        centerOfZeroError: 0,
        centerOfZeroPass: true
      }
    },
    tareTest: {
      status: 'pending',
      isPass: true,
      data: {
        tareLoadApplied: 500,
        tareIndication: 0,
        netZeroAccuracyError: 0,
        netWeighingErrorsPass: true
      }
    },
    reviewComments: [],
    overallVerdict: 'PENDING'
  };

  return [report1, report2, report3];
}

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    reportId: 'R76-2026-0042',
    timestamp: '2026-09-18T09:30:00Z',
    actorName: 'Dr. Marcus Vance',
    actorRole: 'test_engineer',
    action: 'REPORT_CREATED',
    details: 'Initialized report for Avery Weigh-Tronix ZM510-Bench (Class III, 15kg/5g). Ruleset v3.2.1-intl locked.',
    previousHash: 'GENESIS_0000000000000000000000000000000000000000000000000000000000000000',
    entryHash: 'b7f43b7194f481a5323497e551e18d3ef711b7d5bf2962fa9c3be79efc39bf58'
  },
  {
    id: 'aud-002',
    reportId: 'R76-2026-0042',
    timestamp: '2026-09-18T16:45:00Z',
    actorName: 'Dr. Marcus Vance',
    actorRole: 'test_engineer',
    action: 'TESTS_COMPLETED',
    details: 'Completed Weighing Performance, Eccentricity, Repeatability, and Discrimination. All verdicts PASS.',
    previousHash: 'b7f43b7194f481a5323497e551e18d3ef711b7d5bf2962fa9c3be79efc39bf58',
    entryHash: '438b97d19e8cf19ba072f53d850e0d5d5402df918a5b9d3659a844dc92182281'
  },
  {
    id: 'aud-003',
    reportId: 'R76-2026-0042',
    timestamp: '2026-09-18T17:10:00Z',
    actorName: 'Dr. Marcus Vance',
    actorRole: 'test_engineer',
    action: 'SUBMITTED_FOR_REVIEW',
    details: 'Submitted for Technical Review. Pre-flight dual-engine verification passed with zero discrepancies.',
    previousHash: '438b97d19e8cf19ba072f53d850e0d5d5402df918a5b9d3659a844dc92182281',
    entryHash: '98d1a10842fe928b92b51f041b36932454a4f89552140bbfa236d22efca8234a'
  },
  {
    id: 'aud-004',
    reportId: 'R76-2026-0042',
    timestamp: '2026-09-19T11:15:00Z',
    actorName: 'Elena Rostova, M.Sc.',
    actorRole: 'reviewer',
    action: 'TECHNICAL_REVIEW_APPROVED',
    details: 'Dual-engine cross calculations verified. Environmental stability checked. Approved for final issuance.',
    previousHash: '98d1a10842fe928b92b51f041b36932454a4f89552140bbfa236d22efca8234a',
    entryHash: 'f4172db632d4b47ebcb108ca8b5c90a2cf75bb7090b8f06f527c73a90327fbc1'
  },
  {
    id: 'aud-005',
    reportId: 'R76-2026-0042',
    timestamp: '2026-09-20T14:15:00Z',
    actorName: 'Prof. Hans-Peter Weber',
    actorRole: 'approver',
    action: 'REPORT_ISSUED_AND_SEALED',
    details: 'Cryptographically sealed with SHA-256 seal 9f83a45c213... and ISO/IEC 17025 certificate. Locked for audit.',
    previousHash: 'f4172db632d4b47ebcb108ca8b5c90a2cf75bb7090b8f06f527c73a90327fbc1',
    entryHash: '9f83a45c213e8b091c8411b7dfb8f2c256087da344b1c3e1e91244e8839cb542'
  }
];

class StorageService {
  private reportsKey = 'tracer76_reports_v3';
  private equipmentKey = 'tracer76_equipment_v3';
  private auditKey = 'tracer76_audit_v3';
  private userKey = 'tracer76_current_user_v3';

  public getReports(): ReportRecord[] {
    const raw = localStorage.getItem(this.reportsKey);
    if (!raw) {
      const initial = buildInitialReports();
      this.saveReports(initial);
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return buildInitialReports();
    }
  }

  public getReportById(id: string): ReportRecord | undefined {
    return this.getReports().find(r => r.id === id);
  }

  public saveReports(reports: ReportRecord[]) {
    localStorage.setItem(this.reportsKey, JSON.stringify(reports));
  }

  public saveReport(report: ReportRecord) {
    const reports = this.getReports();
    const index = reports.findIndex(r => r.id === report.id);
    if (index >= 0) {
      reports[index] = { ...report, updatedAt: new Date().toISOString() };
    } else {
      reports.unshift(report);
    }
    this.saveReports(reports);

    // Asynchronously sync to Supabase if configured
    try {
      import('./supabaseStorage').then(m => {
        m.supabaseStorage.saveReport(report).catch(e => console.warn('Supabase sync skipped:', e));
      });
    } catch {}
  }

  public getEquipment(): EquipmentRecord[] {
    const raw = localStorage.getItem(this.equipmentKey);
    if (!raw) {
      localStorage.setItem(this.equipmentKey, JSON.stringify(INITIAL_EQUIPMENT));
      return INITIAL_EQUIPMENT;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_EQUIPMENT;
    }
  }

  public saveEquipment(equipment: EquipmentRecord[]) {
    localStorage.setItem(this.equipmentKey, JSON.stringify(equipment));
  }

  public getAuditLogs(): AuditLogEntry[] {
    const raw = localStorage.getItem(this.auditKey);
    if (!raw) {
      localStorage.setItem(this.auditKey, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  }

  public async addAuditLog(actorName: string, actorRole: UserRole, action: string, details: string, reportId?: string) {
    const logs = this.getAuditLogs();
    const lastEntry = logs[logs.length - 1];
    const previousHash = lastEntry ? lastEntry.entryHash : 'GENESIS';
    const timestamp = new Date().toISOString();
    
    const entryPayload = `${previousHash}|${timestamp}|${actorName}|${actorRole}|${action}|${details}|${reportId || ''}`;
    const entryHash = await sha256(entryPayload);

    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now().toString(36)}`,
      reportId,
      timestamp,
      actorName,
      actorRole,
      action,
      details,
      previousHash,
      entryHash
    };

    logs.push(newEntry);
    localStorage.setItem(this.auditKey, JSON.stringify(logs));
  }

  public getCurrentUser(): UserProfile {
    const raw = localStorage.getItem(this.userKey);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return DEFAULT_USERS[0]; // Dr. Marcus Vance (Test Engineer)
  }

  public setCurrentUser(user: UserProfile) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }
}

export const storageService = new StorageService();
