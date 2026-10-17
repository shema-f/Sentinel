import React, { useState } from 'react';
import { BookOpen, Shield, Lock, FileCode, CheckCircle2, X } from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  const [activeDoc, setActiveDoc] = useState<'zero-trust' | 'threat-model' | 'k-anonymity' | 'schema'>('zero-trust');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-4xl rounded-2xl border border-[#23354d] bg-[#0a0f19] p-6 shadow-2xl space-y-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#162233]">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-[#00f0a8]" />
            <h2 className="font-mono font-bold text-white text-base">SentinelKey Security & Threat Model Whitepaper</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-[#64748b] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex space-x-2 border-b border-[#162335] pb-2 text-xs font-mono">
          {[
            { id: 'zero-trust', label: 'Zero-Plaintext Invariant' },
            { id: 'k-anonymity', label: 'k-Anonymity Range Query' },
            { id: 'threat-model', label: 'STRIDE / PASTA Threat Model' },
            { id: 'schema', label: 'PostgreSQL Relational Schema' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveDoc(tab.id as any)}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                activeDoc === tab.id
                  ? 'bg-[#152238] text-[#00f0a8] font-bold border border-[#233550]'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Document Body */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-[#152233] bg-[#06090f] p-5 font-mono text-xs text-[#cbd5e1] space-y-4 leading-relaxed">
          {activeDoc === 'zero-trust' && (
            <div className="space-y-4 font-sans">
              <h3 className="text-sm font-bold font-mono text-[#00f0a8]">1. Zero-Plaintext Architecture Invariant</h3>
              <p className="text-xs text-[#94a3b8]">
                SentinelKey is explicitly architected so that even if our backend servers, databases, and memory snapshots are completely seized by an attacker, zero user passwords or authentication cookies can be extracted.
              </p>
              <div className="rounded bg-[#0a101b] border border-[#162335] p-3 text-xs font-mono space-y-1">
                <div className="text-[#00f0a8] font-bold">MATHEMATICAL INVARIANTS:</div>
                <div>1. Input password P is hashed locally: H = SHA-1(P)</div>
                <div>2. Prefix split: Prefix = H[0..5], Suffix = H[5..40]</div>
                <div>3. Network transmission: Egress = (Prefix) ONLY</div>
                <div>4. Storage invariant: No table or log column stores P or H[5..40]</div>
              </div>
            </div>
          )}

          {activeDoc === 'k-anonymity' && (
            <div className="space-y-4 font-sans">
              <h3 className="text-sm font-bold font-mono text-[#38bdf8]">2. k-Anonymity 5-Character Range Search</h3>
              <p className="text-xs text-[#94a3b8]">
                By transmitting only the first 5 hexadecimal characters of a SHA-1 hash (16^5 = 1,048,576 possible buckets), hundreds or thousands of unrelated breached password hashes share the same prefix.
              </p>
              <p className="text-xs text-[#94a3b8]">
                The server sends the list of candidate suffixes back to the client. The browser executes a constant-time memory comparison to identify if the private suffix exists in the set. The backend never learns whether a match was found or what account was checked.
              </p>
            </div>
          )}

          {activeDoc === 'threat-model' && (
            <div className="space-y-4 font-sans">
              <h3 className="text-sm font-bold font-mono text-[#ffa502]">3. STRIDE Threat Model Mitigations</h3>
              <ul className="space-y-2 text-xs text-[#94a3b8]">
                <li><strong className="text-white">Spoofing:</strong> FIDO2 WebAuthn hardware passkeys replace phishable SMS and shared passwords.</li>
                <li><strong className="text-white">Tampering:</strong> SHA-256 HMAC event ledger chains prevent unlogged modifications.</li>
                <li><strong className="text-white">Repudiation:</strong> Immutable audit streams record user actions with cryptographic timestamps.</li>
                <li><strong className="text-white">Information Disclosure:</strong> Zero plaintext architecture ensures no secrets are stored on server disks.</li>
                <li><strong className="text-white">Denial of Service:</strong> In-memory rate-limiting and Cloudflare edge filtering.</li>
                <li><strong className="text-white">Elevation of Privilege:</strong> Strict 5-role RBAC enforced server-side.</li>
              </ul>
            </div>
          )}

          {activeDoc === 'schema' && (
            <div className="space-y-2 text-xs font-mono">
              <div className="text-[#00f0a8] font-bold">POSTGRESQL RELATIONAL SCHEMA (14 TABLES):</div>
              <p className="text-[#94a3b8] font-sans">
                Normalized relational tables configured with foreign key constraints, indexes on hash prefixes, and audit triggers:
              </p>
              <div className="text-[11px] text-[#cbd5e1] space-y-0.5">
                <div>• users (id, email_hash, role, plan, mfa_enforced)</div>
                <div>• organizations (id, name, slug, tier)</div>
                <div>• devices (id, user_id, hardware_enclave, tpm_hash)</div>
                <div>• monitored_identities (id, user_id, hash_prefix, exposure_count)</div>
                <div>• breach_datasets (id, name, release_date, total_records)</div>
                <div>• risk_findings (id, user_id, severity, evidence, status)</div>
                <div>• containment_incidents (id, user_id, current_step, status)</div>
                <div>• incident_steps (incident_id, step_number, completed_at, notes)</div>
                <div>• security_policies (org_id, policy_key, enforced)</div>
                <div>• audit_logs (id, org_id, actor, action, checksum_sha256)</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#162233] text-xs font-mono text-[#64748b]">
          <span>Document Version: 1.0-PROD</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-[#152238] px-4 py-2 text-[#e2e8f0] hover:bg-[#1f314f] transition-colors"
          >
            Close Whitepaper
          </button>
        </div>
      </div>
    </div>
  );
};
