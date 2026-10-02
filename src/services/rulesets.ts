import { AccuracyClass, VerificationType } from '../types/metrology';

export interface MpeBand {
  minMInE: number; // in units of e
  maxMInE: number; // in units of e
  mpeFactorE: number; // e.g. 0.5, 1.0, 1.5
}

export const OIML_R76_RULESET = {
  version: "OIML-R76-1:2006 (Ruleset v3.2.1-intl)",
  hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  title: "Non-automatic weighing instruments - Metrological and technical requirements - Tests",
  references: ["OIML R 76-1:2006(E)", "OIML R 76-2:2007(E)", "WELMEC 7.2", "ISO/IEC 17025:2017"],
  bands: {
    'I': [
      { minMInE: 0, maxMInE: 50000, mpeFactorE: 0.5 },
      { minMInE: 50000, maxMInE: 200000, mpeFactorE: 1.0 },
      { minMInE: 200000, maxMInE: Infinity, mpeFactorE: 1.5 },
    ],
    'II': [
      { minMInE: 0, maxMInE: 5000, mpeFactorE: 0.5 },
      { minMInE: 5000, maxMInE: 20000, mpeFactorE: 1.0 },
      { minMInE: 20000, maxMInE: 100000, mpeFactorE: 1.5 },
    ],
    'III': [
      { minMInE: 0, maxMInE: 500, mpeFactorE: 0.5 },
      { minMInE: 500, maxMInE: 2000, mpeFactorE: 1.0 },
      { minMInE: 2000, maxMInE: 10000, mpeFactorE: 1.5 },
    ],
    'IIII': [
      { minMInE: 0, maxMInE: 50, mpeFactorE: 0.5 },
      { minMInE: 50, maxMInE: 200, mpeFactorE: 1.0 },
      { minMInE: 200, maxMInE: 1000, mpeFactorE: 1.5 },
    ]
  } as Record<AccuracyClass, MpeBand[]>,
  
  limits: {
    'I': { minE: 0.001, minN: 50000, maxN: Infinity },
    'II': { minE: 0.001, minN: 100, maxN: 100000 },
    'III': { minE: 0.1, minN: 500, maxN: 10000 },
    'IIII': { minE: 5, minN: 100, maxN: 1000 },
  }
};

/**
 * Get MPE band factor for given class and load in e units
 */
export function getMpeFactor(accuracyClass: AccuracyClass, loadInE: number, type: VerificationType = 'initial'): { factor: number, band: MpeBand } {
  const bands = OIML_R76_RULESET.bands[accuracyClass];
  const absLoad = Math.abs(loadInE);
  
  let selected = bands[0];
  for (const b of bands) {
    if (absLoad > b.minMInE && absLoad <= b.maxMInE) {
      selected = b;
      break;
    }
  }
  // For in_service verification, MPE is doubled per Clause 3.5.2
  const multiplier = type === 'in_service' ? 2 : 1;
  return {
    factor: selected.mpeFactorE * multiplier,
    band: selected
  };
}
