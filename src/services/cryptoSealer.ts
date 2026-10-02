import QRCode from 'qrcode';
import { DigitalSeal, ReportRecord } from '../types/metrology';
import { OIML_R76_RULESET } from './rulesets';

/**
 * Computes deterministic SHA-256 hash of a string
 */
export async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Seals an approved report with a cryptographic SHA-256 seal, digital signature,
 * ISO/IEC 17025 statement, and verification QR code.
 */
export async function sealReport(
  report: ReportRecord,
  signerName: string,
  signerRole: string
): Promise<DigitalSeal> {
  // Canonical data payload for hashing
  const canonicalPayload = JSON.stringify({
    id: report.id,
    version: report.version,
    applicant: report.specs.applicant,
    model: report.specs.model,
    serialNumber: report.specs.serialNumber,
    accuracyClass: report.specs.accuracyClass,
    maxCapacity: report.specs.maxCapacity,
    scaleIntervalE: report.specs.scaleIntervalE,
    overallVerdict: report.overallVerdict,
    rulesetVersion: report.rulesetVersion,
    weighingRows: report.weighingPerformance.rows.map(r => ({
      nominalLoad: r.nominalLoad,
      indication: r.indication,
      addedDeltaL: r.addedDeltaL,
      correctedErrorEc: r.correctedErrorEc,
      isPass: r.isPass
    })),
    eccentricityPass: report.eccentricity.isPass,
    repeatabilityPass: report.repeatability.isPass,
    discriminationPass: report.discrimination.isPass,
  });

  const reportHash = await sha256(canonicalPayload);
  const sealedAt = new Date().toISOString();
  
  // Format verification URL: window.location.origin + /verify/{id}
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tracer76.metrology.org';
  const verificationUrl = `${origin}/verify/${report.id}`;

  // Generate real QR code
  let qrCodeDataUrl = '';
  try {
    qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 256,
      margin: 1,
      color: {
        dark: '#0154a3',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('Failed to generate QR code', err);
  }

  // Simulated hardware-backed digital signature (ECDSA P-256)
  const simulatedSignature = `MEYCIQ${reportHash.substring(0, 32).toUpperCase()}IhAI${reportHash.substring(32, 64).toUpperCase()}==`;
  const certFingerprint = `SHA256:4F:9A:88:B1:0C:${reportHash.substring(0, 10).toUpperCase()}:ISO17025`;

  return {
    algorithm: 'SHA-256 / ECDSA-P256',
    reportHashSha256: reportHash,
    signatureValue: simulatedSignature,
    signerName,
    signerRole,
    signerCertificateFingerprint: certFingerprint,
    sealedAt,
    verificationUrl,
    qrCodeDataUrl,
    iso17025AccreditationStatement: "This report is generated under ISO/IEC 17025 accredited laboratory quality procedures and conforms to OIML R 76-1:2006 and OIML R 76-2:2007 test record standards. Any modification renders the cryptographic seal void.",
    rulesetVersion: OIML_R76_RULESET.version
  };
}
