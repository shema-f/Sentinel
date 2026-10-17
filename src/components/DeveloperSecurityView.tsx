import React, { useState } from 'react';
import {
  Code2,
  Shield,
  AlertTriangle,
  CheckCircle2,
  EyeOff,
  Copy,
  RefreshCw,
  Terminal,
  Zap,
} from 'lucide-react';
import { scanTextForSecretsLocally } from '../lib/cryptoUtils';
import { SecretFinding } from '../types';

const sampleStripeKey = `sk_live_${'x'.repeat(32)}`;

export const DeveloperSecurityView: React.FC = () => {
  const sampleSnippet = `# Sample .env and configuration file containing accidental leaks
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"

# Payment gateway configuration
STRIPE_SECRET_KEY="${sampleStripeKey}"

# CI/CD token
GITHUB_PERSONAL_ACCESS_TOKEN="ghp_1234567890abcdefghijklmnopqrstuvwxyz"

# Safe non-secret configuration
PORT=3000
NODE_ENV=production
DATABASE_URL="postgres://app:securepass@localhost:5432/appdb"
`;

  const [codeText, setCodeText] = useState<string>(sampleSnippet);
  const [findings, setFindings] = useState<SecretFinding[]>(() => scanTextForSecretsLocally(sampleSnippet));
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleScan = () => {
    const res = scanTextForSecretsLocally(codeText);
    setFindings(res);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#162335]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Code2 className="h-5 w-5 text-[#00f0a8]" />
            <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
              Developer Secret Exposure Scanner
            </h1>
          </div>
          <p className="text-xs text-[#94a3b8]">
            In-browser, high-entropy regex secret auditing. Detects API keys, tokens, and private credentials without sending a single byte over the network.
          </p>
        </div>

        {/* Zero Egress Badge */}
        <div className="flex items-center space-x-2 rounded-full border border-[#00f0a8]/30 bg-[#00f0a8]/10 px-3 py-1 font-mono text-xs text-[#00f0a8]">
          <EyeOff className="h-3.5 w-3.5" />
          <span>ZERO NETWORK EGRESS GUARANTEED</span>
        </div>
      </div>

      {/* Editor & Detection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code Input Box */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#64748b]">
            <span>PASTE CODE, CONFIG, OR .ENV:</span>
            <button
              onClick={() => {
                setCodeText(sampleSnippet);
                setFindings(scanTextForSecretsLocally(sampleSnippet));
              }}
              className="text-[#38bdf8] hover:underline"
            >
              Reset to Sample Dirty Config
            </button>
          </div>

          <textarea
            rows={14}
            value={codeText}
            onChange={e => {
              setCodeText(e.target.value);
              setFindings(scanTextForSecretsLocally(e.target.value));
            }}
            placeholder="Paste source code or .env file here to audit for hardcoded credentials..."
            className="w-full rounded-xl border border-[#1b283d] bg-[#070b13] p-4 font-mono text-xs text-[#cbd5e1] placeholder-[#64748b] focus:border-[#00f0a8] focus:outline-none leading-relaxed"
          />

          <div className="flex items-center justify-between text-xs font-mono text-[#64748b]">
            <span>Live continuous evaluation: {findings.length} secrets identified</span>
            <button
              onClick={handleScan}
              className="flex items-center space-x-1.5 rounded-lg bg-[#00f0a8] px-4 py-2 font-mono text-xs font-bold text-[#05080e] hover:bg-[#00f0a8]/90 transition-colors"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Re-Scan Buffer</span>
            </button>
          </div>
        </div>

        {/* Scan Findings Feed */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#64748b]">
            <span>IDENTIFIED EXPOSED SECRETS ({findings.length}):</span>
            <span className="text-[#00f0a8]">EVALUATED IN-MEMORY</span>
          </div>

          {findings.length === 0 ? (
            <div className="rounded-xl border border-[#00f0a8]/30 bg-[#00f0a8]/5 p-8 text-center space-y-3">
              <CheckCircle2 className="h-8 w-8 text-[#00f0a8] mx-auto" />
              <div className="font-mono text-sm font-bold text-white">Zero Hardcoded Secrets Detected</div>
              <p className="text-xs text-[#94a3b8] max-w-sm mx-auto">
                The analyzed buffer contains no known cloud access keys, payment gateway tokens, or private SSH keys.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {findings.map((f, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#ff4757]/40 bg-[#0d101a] p-4 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-[#182233]">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-[#ff4757]" />
                      <span className="font-bold text-white font-mono">{f.secretType}</span>
                    </div>
                    <span className="rounded bg-[#ff4757]/20 px-2 py-0.5 text-[10px] font-mono font-bold text-[#ff4757]">
                      {f.severity}
                    </span>
                  </div>

                  <div className="font-mono text-[11px] text-[#cbd5e1] space-y-1">
                    <div className="text-[#64748b]">Masked Token (Client Safe):</div>
                    <div className="rounded bg-[#05080e] p-2 text-[#00f0a8] border border-[#141e2e]">
                      {f.maskedSnippet}
                    </div>
                  </div>

                  <div className="pt-1 text-[#94a3b8] text-[11px] leading-relaxed">
                    <strong className="text-white font-mono">Remediation:</strong> {f.remediation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
