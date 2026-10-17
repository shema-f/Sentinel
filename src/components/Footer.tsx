import React from 'react';
import { Shield, FileText, CheckCircle2, GitBranch } from 'lucide-react';

interface FooterProps {
  openDocs: () => void;
}

export const Footer: React.FC<FooterProps> = ({ openDocs }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-6 text-xs text-slate-400">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800/60">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold text-white tracking-tight">SentinelKey</span>
              <span className="text-slate-500 text-[11px]">· Built by Ferrivox Ltd</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Privacy-preserving digital identity exposure intelligence and rapid compromise containment, engineered by Ferrivox Ltd (Rwanda · <em>“Iron will, infinite dreams.”</em>).
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Zero-Plaintext Invariant Enforced</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-200 text-xs">Cryptographic Architecture</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Client-Side Hashing (SHA-1 / SHA-256)</li>
              <li>k-Anonymity 5-Character Suffix Search</li>
              <li>Argon2id Key Derivation</li>
              <li>Hardware FIDO2 Passkey Support</li>
              <li>Differential Privacy Geospatial Jitter</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-200 text-xs">Governance & Open Source</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Apache-2.0 Global Open Source License</li>
              <li>OpenSSF Best Practices Gold Standard</li>
              <li>RFC 9116 security.txt Vulnerability Policy</li>
              <li>NIST SP 800-63B Identity Guidelines</li>
              <li>CycloneDX JSON v1.5 Open SBOM</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-200 text-xs">Threat Model & Transparency</h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              We strictly refrain from marketing claims such as &quot;100% unhackable&quot;. Real security requires continuous vigilance, empirical evidence, and layered defense.
            </p>
            <button
              onClick={openDocs}
              className="mt-1 inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Inspect Security Threat Model →</span>
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-sans">
          <div>
            © {new Date().getFullYear()} SentinelKey · Maintained by <strong className="text-slate-300 font-medium">Ferrivox Ltd</strong>. Released under Apache-2.0.
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center space-x-1 text-slate-400">
              <GitBranch className="h-3.5 w-3.5 text-emerald-400" />
              <span>v1.2-oss</span>
            </span>
            <span>·</span>
            <span className="hidden md:inline-flex items-center space-x-1 text-slate-400">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-400 font-semibold">
                ⌘K
              </kbd>
              <span>or</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-400 font-semibold">
                ?
              </kbd>
              <span>for Shortcuts</span>
            </span>
            <span className="hidden md:inline text-slate-600">·</span>
            <span>Zero Data Brokerage</span>
            <span>·</span>
            <span>Local-First Cryptography</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
