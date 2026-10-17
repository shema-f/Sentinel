import React, { useState } from 'react';
import {
  Building2,
  Shield,
  Users,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Download,
  FileCheck,
  Laptop,
  Radio,
  Sliders,
} from 'lucide-react';
import { Role, Device, SecurityPolicy } from '../types';

interface BusinessSecurityViewProps {
  currentRole: Role;
  devices: Device[];
  policies: SecurityPolicy[];
  onTogglePolicy: (id: string, enabled: boolean) => void;
}

export const BusinessSecurityView: React.FC<BusinessSecurityViewProps> = ({
  currentRole,
  devices,
  policies,
  onTogglePolicy,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'rbac' | 'devices' | 'policies' | 'audit'>('overview');

  const rolePermissions: Record<Role, { label: string; perms: string[] }> = {
    owner: {
      label: 'Owner',
      perms: ['Full Tenant Administration', 'Billing & Subscription', 'Policy Enactment', 'Emergency Session Revocation', 'Compliance Audit Export'],
    },
    security_admin: {
      label: 'Security Admin',
      perms: ['Incident Response Lead', 'Threat Remediation', 'Policy Enactment', 'Emergency Session Revocation', 'Compliance Audit Export'],
    },
    admin: {
      label: 'Administrator',
      perms: ['Member Management', 'Device Onboarding', 'Basic Policy Inspection', 'Session Revocation'],
    },
    member: {
      label: 'Team Member',
      perms: ['Personal Posture View', 'Self-Incident Containment', 'Passkey Registration'],
    },
    auditor: {
      label: 'Compliance Auditor',
      perms: ['Read-Only Compliance Export', 'Audit Log Inspection', 'Policy Verification'],
    },
  };

  const isPrivileged = currentRole === 'owner' || currentRole === 'security_admin' || currentRole === 'admin';

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#162335]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-[#00f0a8]" />
            <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
              Enterprise Identity & Governance Console
            </h1>
          </div>
          <p className="text-xs text-[#94a3b8]">
            Organization: <strong className="text-white">Vance Cyber Defense Lab</strong> • Active Role: <strong className="text-[#00f0a8] uppercase font-mono">{currentRole.replace('_', ' ')}</strong>
          </p>
        </div>

        {/* Export SOC 2 Audit Report */}
        <button
          onClick={() => {
            alert('SOC 2 Type II Compliance Evidence Package (JSON/PDF) downloaded.');
          }}
          className="flex items-center space-x-1.5 rounded-lg border border-[#1e2d42] bg-[#101726] px-3.5 py-2 font-mono text-xs text-[#38bdf8] hover:bg-[#162238] transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export SOC 2 Evidence</span>
        </button>
      </div>

      {/* Sub-Nav Tabs */}
      <div className="flex space-x-2 border-b border-[#162335] pb-2 text-xs font-mono">
        {[
          { id: 'overview', label: 'Fleet Overview' },
          { id: 'rbac', label: 'RBAC Matrix' },
          { id: 'devices', label: `Devices (${devices.length})` },
          { id: 'policies', label: `Security Policies (${policies.length})` },
          { id: 'audit', label: 'Compliance Audit Log' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              activeTab === tab.id
                ? 'bg-[#152238] text-[#00f0a8] font-bold border border-[#233550]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Fleet Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[#1a273b] bg-[#0c121e] p-5 space-y-2">
              <span className="text-xs font-mono text-[#64748b]">FLEET POSTURE</span>
              <div className="text-2xl font-bold font-mono text-white">88 / 100</div>
              <div className="text-xs text-[#00f0a8]">Grade A- • High Compliance</div>
            </div>

            <div className="rounded-xl border border-[#1a273b] bg-[#0c121e] p-5 space-y-2">
              <span className="text-xs font-mono text-[#64748b]">PASSKEY COMPLIANCE</span>
              <div className="text-2xl font-bold font-mono text-[#00f0a8]">94%</div>
              <div className="text-xs text-[#94a3b8]">FIDO2 WebAuthn Enforced</div>
            </div>

            <div className="rounded-xl border border-[#1a273b] bg-[#0c121e] p-5 space-y-2">
              <span className="text-xs font-mono text-[#64748b]">ACTIVE ENDPOINTS</span>
              <div className="text-2xl font-bold font-mono text-[#38bdf8]">{devices.length} Devices</div>
              <div className="text-xs text-[#38bdf8]">100% Hardware TPM Verified</div>
            </div>

            <div className="rounded-xl border border-[#1a273b] bg-[#0c121e] p-5 space-y-2">
              <span className="text-xs font-mono text-[#64748b]">OPEN CONTAINMENT INCIDENTS</span>
              <div className="text-2xl font-bold font-mono text-[#ff4757]">1 Active</div>
              <div className="text-xs text-[#ff4757]">Naz.API Credential Match</div>
            </div>
          </div>

          <div className="rounded-xl border border-[#1a273b] bg-[#0c121e] p-6 space-y-4">
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              Zero-Trust Architecture Status (NIST SP 800-207)
            </h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Every access request is verified explicitly, relying on device hardware posture, passkey authentication, and cryptographic session bounds. Static passwords are systematically phased out in favor of biometric WebAuthn credentials.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: RBAC Matrix */}
      {activeTab === 'rbac' && (
        <div className="rounded-xl border border-[#1a273b] bg-[#0c121e] p-6 space-y-6">
          <div>
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              Role-Based Access Control (RBAC) Specification
            </h3>
            <p className="text-xs text-[#94a3b8]">
              SentinelKey enforces 5 least-privilege security roles across organizational identities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(rolePermissions) as Role[]).map(r => {
              const info = rolePermissions[r];
              const isCurrent = currentRole === r;

              return (
                <div
                  key={r}
                  className={`rounded-xl border p-5 space-y-3 ${
                    isCurrent
                      ? 'border-[#00f0a8] bg-[#0c1724]'
                      : 'border-[#182538] bg-[#090f18]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white text-sm">{info.label}</span>
                    {isCurrent && (
                      <span className="rounded bg-[#00f0a8]/20 px-2 py-0.5 text-[10px] font-mono font-bold text-[#00f0a8]">
                        YOUR ROLE
                      </span>
                    )}
                  </div>

                  <ul className="space-y-1.5 text-xs text-[#cbd5e1]">
                    {info.perms.map((p, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#00f0a8] shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Devices */}
      {activeTab === 'devices' && (
        <div className="rounded-xl border border-[#1a273b] bg-[#0c121e] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#162335]">
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              Enrolled Endpoint Hardware Inventory
            </h3>
            <span className="text-xs font-mono text-[#00f0a8]">TPM / ENCLAVE VALIDATED</span>
          </div>

          <div className="space-y-3">
            {devices.map(dev => (
              <div
                key={dev.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-[#182538] bg-[#080d16] text-xs font-mono gap-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-[#182638] text-[#38bdf8]">
                    <Laptop className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{dev.deviceName}</div>
                    <div className="text-[#64748b]">{dev.os} • Enclave: {dev.hardwareEnclaveType}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-[#00f0a8] font-bold">Disk Encrypted ({dev.diskEncryption})</div>
                    <div className="text-[#64748b]">Last sync {dev.lastSync || dev.lastCheckIn || 'Just now'}</div>
                  </div>
                  <span className="rounded bg-[#00f0a8]/20 px-2 py-0.5 text-[10px] text-[#00f0a8] font-bold">
                    {dev.complianceStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Policies */}
      {activeTab === 'policies' && (
        <div className="rounded-xl border border-[#1a273b] bg-[#0c121e] p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#162335]">
            <div>
              <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                Defensive Security Policy Enforcement
              </h3>
              <p className="text-xs text-[#94a3b8]">
                {isPrivileged ? 'Click to toggle organization-wide security rules.' : 'View active organization policies (Read-only for your role).'}
              </p>
            </div>
            {!isPrivileged && (
              <span className="rounded bg-[#ffa502]/20 px-2 py-0.5 text-[10px] font-mono text-[#ffa502]">
                READ-ONLY
              </span>
            )}
          </div>

          <div className="space-y-3">
            {policies.map(pol => (
              <div
                key={pol.id}
                className="flex items-center justify-between p-4 rounded-xl border border-[#162233] bg-[#080d16] text-xs"
              >
                <div className="space-y-1 pr-4">
                  <div className="flex items-center space-x-2">
                    <Sliders className="h-4 w-4 text-[#00f0a8]" />
                    <span className="font-bold text-white font-mono">{pol.name}</span>
                  </div>
                  <p className="text-[#94a3b8] leading-relaxed">{pol.description}</p>
                </div>

                <button
                  disabled={!isPrivileged}
                  onClick={() => onTogglePolicy(pol.id, !pol.enabled)}
                  className={`shrink-0 rounded-full px-4 py-1.5 font-mono text-xs font-bold transition-colors ${
                    pol.enabled
                      ? 'bg-[#00f0a8] text-[#05080e]'
                      : 'bg-[#1e2a3c] text-[#94a3b8]'
                  } ${!isPrivileged ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                  {pol.enabled ? 'ENFORCED' : 'DISABLED'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Compliance Audit Log */}
      {activeTab === 'audit' && (
        <div className="rounded-xl border border-[#1a273b] bg-[#0c121e] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#162335]">
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              Immutable SOC 2 / ISO 27001 Access Audit Stream
            </h3>
            <span className="text-xs font-mono text-[#00f0a8]">CRYPTOGRAPHIC CHECKSUM PASS</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {[
              { time: '10:42:15 UTC', action: 'GLOBAL_SESSION_REVOCATION', actor: 'alex.vance (Security Admin)', result: 'SUCCESS (4 edge nodes)' },
              { time: '09:15:30 UTC', action: 'POLICY_MODIFICATION: ENFORCE_PASSKEYS', actor: 'alex.vance (Owner)', result: 'ENFORCED' },
              { time: '08:00:12 UTC', action: 'ENDPOINT_HEALTH_HEARTBEAT', actor: 'system-agent-mbp', result: 'COMPLIANT' },
              { time: 'Yesterday', action: 'k-ANONYMITY_BREACH_MATCH', actor: 'threat-engine-worker', result: 'TRIGGERED_ALERT_INC-2026-0921-A' },
            ].map((log, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-[#070b13] border border-[#141e2e] text-[#cbd5e1] gap-2">
                <div>
                  <span className="text-[#64748b] mr-3">{log.time}</span>
                  <span className="font-bold text-[#38bdf8]">{log.action}</span>
                </div>
                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="text-[#94a3b8]">{log.actor}</span>
                  <span className="text-[#00f0a8] font-bold">{log.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
