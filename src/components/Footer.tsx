import React from 'react';
import { Scale, ShieldCheck, ExternalLink, BookCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Scale className="w-4 h-4" />
              </div>
              <span className="text-white text-base font-bold">TraceR76</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Automated OIML R 76-1:2006 and R 76-2:2007 evaluation, dual-engine calculations, and tamper-evident sealed test reports for non-automatic weighing instruments (NAWI).
            </p>
            <div className="flex items-center space-x-2 text-emerald-400 text-[11px] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>ISO/IEC 17025 Record Integrity Compliant</span>
            </div>
          </div>

          {/* Standards & Metrology */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Metrology Standards
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/standards')} className="hover:text-white transition">
                  OIML R 76-1:2006 Clause Matrix
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/standards')} className="hover:text-white transition">
                  OIML R 76-2:2007 Test Report Formats
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/validation')} className="hover:text-white transition">
                  Dual-Engine Verification & 300+ Vectors
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/docs')} className="hover:text-white transition">
                  Changeover-Point Calculation Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Verification & Lab Portal */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Platform & Verification
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/verify')} className="hover:text-white transition">
                  Public Report Verification (/verify)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/app/dashboard')} className="hover:text-white transition">
                  Laboratory Secure Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/app/reports/new')} className="hover:text-white transition">
                  NAWI Test Planner Wizard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/app/equipment')} className="hover:text-white transition">
                  Standard Weights Registry (F1, M1, E2)
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Compliance & Security
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/security')} className="hover:text-white transition">
                  Security Architecture & Digital Seals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-white transition">
                  DPDP Act 2023 & GDPR Privacy Notice
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-white transition">
                  Terms of Service & Audit Terms
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition">
                  Request Laboratory Evaluation Demo
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Metrology SME Disclaimer Notice */}
        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 mb-6 flex items-start space-x-2.5">
          <BookCheck className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-200">Metrological Compliance Notice:</strong> Formulas, MPE tables, and test report layouts in TraceR76 are designed in accordance with OIML R 76-1:2006, OIML R 76-2:2007, and ISO/IEC 17025. Laboratory quality management systems must validate ruleset configurations against national legal metrology requirements prior to statutory type-approval issuance.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} TraceR76 Metrology Systems. Version 3.0 (Website Edition). All rights reserved.
          </div>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <span>Server: India Region (Data Residency)</span>
            <span>•</span>
            <span>Cryptographic Engine: SHA-256 / ECDSA-P256</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
