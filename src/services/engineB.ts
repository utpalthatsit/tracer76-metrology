import { AccuracyClass, InstrumentSpecs } from '../types/metrology';

/**
 * Engine B: Independent Metrology Engine using scaled BigInt/Integer Rational arithmetic.
 * Verifies calculation independently to prevent compiler/runtime/rounding bugs.
 */
const SCALE = 1000000000n; // 1e9 precision

function toBig(n: number): bigint {
  return BigInt(Math.round(n * 1e9));
}

function fromBig(b: bigint): number {
  return Number(b) / 1e9;
}

export function calculateWeighingRowEngineB(
  row: { nominalLoad: number; indication: number; addedDeltaL: number },
  zeroErrorE0: number,
  specs: InstrumentSpecs
): {
  calculatedLoadP: number;
  errorE: number;
  correctedErrorEc: number;
  mpe: number;
  isPass: boolean;
} {
  const eBig = toBig(specs.scaleIntervalE);
  const halfEBig = eBig / 2n;
  const IBig = toBig(row.indication);
  const deltaLBig = toBig(row.addedDeltaL);
  const LBig = toBig(row.nominalLoad);
  const zeroE0Big = toBig(zeroErrorE0);

  // P = I + 0.5e - deltaL
  const PBig = IBig + halfEBig - deltaLBig;
  // E = P - L
  const EBig = PBig - LBig;
  // Ec = E - E0
  const EcBig = EBig - zeroE0Big;

  // MPE via independent lookup table
  const loadInE = Math.round(row.nominalLoad / specs.scaleIntervalE);
  let factorNumerator = 1n;
  let factorDenominator = 2n; // 0.5 default

  const cls = specs.accuracyClass;
  const absLoad = Math.abs(loadInE);

  if (cls === 'I') {
    if (absLoad <= 50000) { factorNumerator = 1n; factorDenominator = 2n; }
    else if (absLoad <= 200000) { factorNumerator = 1n; factorDenominator = 1n; }
    else { factorNumerator = 3n; factorDenominator = 2n; }
  } else if (cls === 'II') {
    if (absLoad <= 5000) { factorNumerator = 1n; factorDenominator = 2n; }
    else if (absLoad <= 20000) { factorNumerator = 1n; factorDenominator = 1n; }
    else { factorNumerator = 3n; factorDenominator = 2n; }
  } else if (cls === 'III') {
    if (absLoad <= 500) { factorNumerator = 1n; factorDenominator = 2n; }
    else if (absLoad <= 2000) { factorNumerator = 1n; factorDenominator = 1n; }
    else { factorNumerator = 3n; factorDenominator = 2n; }
  } else {
    // Class IIII
    if (absLoad <= 50) { factorNumerator = 1n; factorDenominator = 2n; }
    else if (absLoad <= 200) { factorNumerator = 1n; factorDenominator = 1n; }
    else { factorNumerator = 3n; factorDenominator = 2n; }
  }

  if (specs.verificationType === 'in_service') {
    factorNumerator *= 2n;
  }

  // MPE = (factorNumerator / factorDenominator) * e
  const mpeBig = (eBig * factorNumerator) / factorDenominator;

  const absEcBig = EcBig < 0n ? -EcBig : EcBig;
  const isPass = absEcBig <= mpeBig;

  return {
    calculatedLoadP: fromBig(PBig),
    errorE: fromBig(EBig),
    correctedErrorEc: fromBig(EcBig),
    mpe: fromBig(mpeBig),
    isPass
  };
}
