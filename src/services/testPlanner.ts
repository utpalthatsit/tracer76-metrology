import { AccuracyClass, InstrumentSpecs } from '../types/metrology';
import { OIML_R76_RULESET } from './rulesets';

export interface PlannedLoadSequence {
  weighingLoads: {
    nominalLoad: number;
    description: string;
    mpeBandLabel: string;
    isChangeoverPoint: boolean;
  }[];
  eccentricLoad: number;
  repeatabilityLoadHalf: number;
  repeatabilityLoadMax: number;
  discriminationLoad14d: number;
  requiredStandardWeightPieces: {
    denomination: number;
    quantity: number;
    unit: string;
  }[];
  validationErrors: string[];
}

export function generateTestPlan(specs: Partial<InstrumentSpecs>): PlannedLoadSequence {
  const errors: string[] = [];
  const max = specs.maxCapacity || 15;
  const e = specs.scaleIntervalE || 0.005;
  const d = specs.scaleIntervalD || 0.005;
  const min = specs.minCapacity || (20 * e);
  const cls: AccuracyClass = specs.accuracyClass || 'III';
  const unit = specs.unit || 'kg';

  // 1. Validate n = Max / e
  const n = Math.round(max / e);
  const limits = OIML_R76_RULESET.limits[cls];
  if (n < limits.minN) {
    errors.push(`Scale intervals n = ${n} is below minimum allowed for Class ${cls} (${limits.minN}).`);
  }
  if (n > limits.maxN) {
    errors.push(`Scale intervals n = ${n} exceeds maximum allowed for Class ${cls} (${limits.maxN}).`);
  }

  // 2. Identify MPE band points in physical units
  const bands = OIML_R76_RULESET.bands[cls];
  const bandCutoffsInE = bands.map(b => b.maxMInE).filter(v => v < Infinity && v < n);

  // 3. Generate Weighing Sequence covering every band & key metrological points
  const candidatePointsInE = new Set<number>();
  candidatePointsInE.add(0); // Zero
  candidatePointsInE.add(Math.round(min / e)); // Min
  bandCutoffsInE.forEach(b => candidatePointsInE.add(b)); // Band changeover points
  candidatePointsInE.add(Math.round(n * 0.5)); // 50% Max
  candidatePointsInE.add(n); // 100% Max

  const sortedPointsInE = Array.from(candidatePointsInE).sort((a, b) => a - b);
  
  const weighingLoads = sortedPointsInE.map(ptInE => {
    const nominal = Math.round(ptInE * e * 1000000) / 1000000;
    let label = `${nominal} ${unit}`;
    let isChangeover = false;
    let mpeLabel = "±0.5 e";

    if (ptInE === 0) {
      label = `Zero load (0 ${unit})`;
    } else if (ptInE === Math.round(min / e)) {
      label = `Min capacity (${nominal} ${unit})`;
    } else if (ptInE === n) {
      label = `Max capacity (${nominal} ${unit})`;
    } else if (bandCutoffsInE.includes(ptInE)) {
      isChangeover = true;
      label = `MPE Changeover Point (${nominal} ${unit} = ${ptInE} e)`;
    }

    if (cls === 'III') {
      if (ptInE <= 500) mpeLabel = "±0.5 e";
      else if (ptInE <= 2000) mpeLabel = "±1.0 e";
      else mpeLabel = "±1.5 e";
    }

    return {
      nominalLoad: nominal,
      description: label,
      mpeBandLabel: mpeLabel,
      isChangeoverPoint: isChangeover,
    };
  });

  // Eccentric load: Clause 3.6.2 specifies 1/3 Max for instruments with not more than 4 points of support
  const eccentricLoad = Math.round((max / 3) * 1000) / 1000;

  // Repeatability: at ~50% Max and ~Max
  const repeatabilityLoadHalf = Math.round((max * 0.5) * 1000) / 1000;
  const repeatabilityLoadMax = max;

  // Discrimination: 1.4 * d
  const discriminationLoad14d = Math.round(1.4 * d * 1000000) / 1000000;

  // Weight combination decomposition
  const standardDenominations = [20, 10, 5, 2, 2, 1, 0.5, 0.2, 0.2, 0.1, 0.05, 0.02, 0.02, 0.01, 0.005, 0.002, 0.001];
  let remaining = max;
  const pieces: { denomination: number; quantity: number; unit: string }[] = [];
  
  for (const denom of standardDenominations) {
    if (remaining >= denom - 0.00001) {
      const count = Math.floor(remaining / denom);
      pieces.push({
        denomination: denom,
        quantity: count,
        unit
      });
      remaining = Math.round((remaining - count * denom) * 1000000) / 1000000;
    }
  }

  return {
    weighingLoads,
    eccentricLoad,
    repeatabilityLoadHalf,
    repeatabilityLoadMax,
    discriminationLoad14d,
    requiredStandardWeightPieces: pieces,
    validationErrors: errors
  };
}
