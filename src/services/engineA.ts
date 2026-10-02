import { AccuracyClass, CalculationWhy, InstrumentSpecs, WeighingRow } from '../types/metrology';
import { getMpeFactor } from './rulesets';

/**
 * Decimal rounder to avoid JS binary floating point artefacts
 */
export function round(value: number, decimals: number = 6): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Engine A: Primary OIML R 76 Metrology Engine
 * Changeover point method:
 * P = I + 0.5e - ΔL (Clause A.4.4.3)
 * E = P - L
 * Ec = E - E0
 */
export function calculateWeighingRowEngineA(
  row: { nominalLoad: number; indication: number; addedDeltaL: number },
  zeroErrorE0: number,
  specs: InstrumentSpecs
): {
  calculatedLoadP: number;
  errorE: number;
  correctedErrorEc: number;
  mpe: number;
  margin: number;
  isPass: boolean;
  why: CalculationWhy;
} {
  const e = specs.scaleIntervalE;
  const I = row.indication;
  const deltaL = row.addedDeltaL;
  const L = row.nominalLoad;

  // 1. Corrected indication P
  const P = round(I + 0.5 * e - deltaL, 6);

  // 2. Uncorrected error E
  const E = round(P - L, 6);

  // 3. Corrected error Ec
  const Ec = round(E - zeroErrorE0, 6);

  // 4. MPE calculation
  // Load in units of e: m / e
  const loadInE = Math.round(L / e);
  const { factor, band } = getMpeFactor(specs.accuracyClass, loadInE, specs.verificationType);
  const mpe = round(factor * e, 6);

  // 5. Margin and verdict
  // OIML R 76-1 clause 3.5.1: |Ec| <= MPE
  const absEc = Math.abs(Ec);
  const margin = round(mpe - absEc, 6);
  // Allow floating point epsilon of 1e-9
  const isPass = absEc <= (mpe + 1e-9);

  // 6. Detailed Traceability "Why" Breakdown (D1)
  const why: CalculationWhy = {
    clause: "OIML R 76-1:2006 Clause A.4.4.3 & Clause 3.5.1",
    standard: "OIML R 76-1:2006 / OIML R 76-2:2007 Clause 4.2",
    formula: "P = I + 0.5e − ΔL,  E = P − L,  Ec = E − E₀",
    substitutions: [
      { label: "Nominal Load", symbol: "L", value: L, unit: specs.unit },
      { label: "Instrument Indication", symbol: "I", value: I, unit: specs.unit },
      { label: "Verification Interval", symbol: "e", value: e, unit: specs.unit },
      { label: "Added Small Load (Changeover)", symbol: "ΔL", value: deltaL, unit: specs.unit },
      { label: "Zero Point Error", symbol: "E₀", value: zeroErrorE0, unit: specs.unit },
      { label: "Load in Scale Intervals", symbol: "m/e", value: `${loadInE} e`, unit: "" },
    ],
    steps: [
      `1. Compute changeover-point indication: P = ${I} + 0.5×${e} − ${deltaL} = ${P} ${specs.unit}`,
      `2. Compute raw error: E = ${P} − ${L} = ${E >= 0 ? '+' : ''}${E} ${specs.unit}`,
      `3. Apply zero compensation: Ec = ${E} − (${zeroErrorE0}) = ${Ec >= 0 ? '+' : ''}${Ec} ${specs.unit}`,
      `4. Determine MPE band: For Class ${specs.accuracyClass} at ${loadInE}e (Band: ${band.minMInE}e to ${band.maxMInE === Infinity ? 'Max' : band.maxMInE + 'e'}), MPE factor = ±${factor} e (±${mpe} ${specs.unit})`,
      `5. Evaluate compliance: |${Ec}| ${isPass ? '≤' : '>'} ${mpe} ${specs.unit}. Margin = ${margin >= 0 ? '+' : ''}${margin} ${specs.unit}.`,
    ],
    mpeBand: {
      rangeMin: band.minMInE,
      rangeMax: band.maxMInE === Infinity ? 9999999 : band.maxMInE,
      unit: 'e',
      factorE: factor,
      computedMpe: mpe,
    },
    margin,
    verdictRationale: isPass
      ? `PASS: Corrected error |Ec| = ${absEc} ${specs.unit} is within the maximum permissible error (±${mpe} ${specs.unit}) by a compliance margin of ${margin} ${specs.unit}.`
      : `FAIL: Corrected error |Ec| = ${absEc} ${specs.unit} exceeds the maximum permissible error (±${mpe} ${specs.unit}) by ${Math.abs(margin)} ${specs.unit} (Clause 3.5.1 violation).`
  };

  return {
    calculatedLoadP: P,
    errorE: E,
    correctedErrorEc: Ec,
    mpe,
    margin,
    isPass,
    why
  };
}

/**
 * Evaluates entire Weighing Performance Table
 */
export function evaluateWeighingPerformanceEngineA(
  rows: WeighingRow[],
  specs: InstrumentSpecs
): { rows: WeighingRow[]; isPass: boolean } {
  // Find zero row (first row or nominalLoad == 0) to determine E0
  const zeroRow = rows.find(r => r.nominalLoad === 0) || rows[0];
  let zeroErrorE0 = 0;
  if (zeroRow) {
    const P0 = round(zeroRow.indication + 0.5 * specs.scaleIntervalE - zeroRow.addedDeltaL, 6);
    zeroErrorE0 = round(P0 - zeroRow.nominalLoad, 6);
  }

  let allPass = true;
  const updatedRows = rows.map(r => {
    const res = calculateWeighingRowEngineA(r, zeroErrorE0, specs);
    if (!res.isPass) allPass = false;
    return {
      ...r,
      zeroErrorE0,
      calculatedLoadP: res.calculatedLoadP,
      errorE: res.errorE,
      correctedErrorEc: res.correctedErrorEc,
      mpe: res.mpe,
      margin: res.margin,
      isPass: res.isPass,
      why: res.why,
    };
  });

  return {
    rows: updatedRows,
    isPass: allPass
  };
}
