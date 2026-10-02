import { DualEngineResult, InstrumentSpecs, WeighingRow } from '../types/metrology';
import { calculateWeighingRowEngineA } from './engineA';
import { calculateWeighingRowEngineB } from './engineB';

export function runDualEngineVerification(
  rows: WeighingRow[],
  specs: InstrumentSpecs
): DualEngineResult {
  const zeroRow = rows.find(r => r.nominalLoad === 0) || rows[0];
  let zeroErrorE0 = 0;
  if (zeroRow) {
    const P0 = zeroRow.indication + 0.5 * specs.scaleIntervalE - zeroRow.addedDeltaL;
    zeroErrorE0 = P0 - zeroRow.nominalLoad;
  }

  let engineAPass = true;
  let engineBPass = true;
  let maxEcA = 0;
  let maxEcB = 0;
  const discrepancies: DualEngineResult['discrepancies'] = [];

  rows.forEach((row) => {
    const resA = calculateWeighingRowEngineA(row, zeroErrorE0, specs);
    const resB = calculateWeighingRowEngineB(row, zeroErrorE0, specs);

    if (!resA.isPass) engineAPass = false;
    if (!resB.isPass) engineBPass = false;

    if (Math.abs(resA.correctedErrorEc) > maxEcA) maxEcA = Math.abs(resA.correctedErrorEc);
    if (Math.abs(resB.correctedErrorEc) > maxEcB) maxEcB = Math.abs(resB.correctedErrorEc);

    // Delta between Engine A and Engine B
    const deltaEc = Math.abs(resA.correctedErrorEc - resB.correctedErrorEc);
    const deltaP = Math.abs(resA.calculatedLoadP - resB.calculatedLoadP);
    const delta = Math.max(deltaEc, deltaP);

    // Mismatch threshold: 1e-6 e
    const tolerance = 1e-6 * specs.scaleIntervalE;
    if (delta > tolerance || resA.isPass !== resB.isPass) {
      discrepancies.push({
        testName: `Weighing Performance (${row.direction} load ${row.nominalLoad}${specs.unit})`,
        rowId: row.id,
        engineAValue: resA.correctedErrorEc,
        engineBValue: resB.correctedErrorEc,
        delta
      });
    }
  });

  const enginesMatch = discrepancies.length === 0;

  // Simple deterministic hash representations
  const hashA = `A-${rows.length}r-max${maxEcA.toFixed(4)}-${engineAPass ? 'P' : 'F'}`;
  const hashB = `B-${rows.length}r-max${maxEcB.toFixed(4)}-${engineBPass ? 'P' : 'F'}`;

  return {
    engineA: {
      status: engineAPass ? 'pass' : 'fail',
      computedHash: hashA,
      totalEvaluations: rows.length,
      maxEc: maxEcA
    },
    engineB: {
      status: engineBPass ? 'pass' : 'fail',
      computedHash: hashB,
      totalEvaluations: rows.length,
      maxEc: maxEcB
    },
    enginesMatch,
    discrepancies,
    verifiedTimestamp: new Date().toISOString()
  };
}
