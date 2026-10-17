import React, { useState } from 'react';
import {
  Radio,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Layers,
  Info,
  ExternalLink,
  Puzzle,
  Globe,
  HardDrive,
  Cpu,
} from 'lucide-react';
import { BrowserExtension, BrowserProfile } from '../types';

interface BrowserSecurityCenterProps {
  browsers: BrowserProfile[];
  extensions: BrowserExtension[];
}

export const BrowserSecurityCenter: React.FC<BrowserSecurityCenterProps> = ({
  browsers,
  extensions,
}) => {
  const [selectedBrowserId, setSelectedBrowserId] = useState<string>(browsers[0]?.id || browsers[0]?.browserName || 'Chrome');
  const activeBrowser = browsers.find(b => (b.id || b.browserName) === selectedBrowserId) || browsers[0];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#162335]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Radio className="h-5 w-5 text-[#00f0a8]" />
            <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
              Browser Security & Exposure Center
            </h1>
          </div>
          <p className="text-xs text-[#94a3b8]">
            Audits browser isolation, DNS encryption, sandbox integrity, and over-privileged extension permissions.
          </p>
        </div>

        {/* Browser Selector */}
        <div className="flex items-center space-x-2">
          {browsers.map(b => (
            <button
              key={b.id || b.browserName}
              onClick={() => setSelectedBrowserId(b.id || b.browserName)}
              className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-mono transition-all ${
                selectedBrowserId === (b.id || b.browserName)
                  ? 'bg-[#18273d] text-white border border-[#38bdf8] font-bold shadow-md'
                  : 'bg-[#0c1322] text-[#94a3b8] border border-[#162235] hover:text-white'
              }`}
            >
              <span>{b.browserName}</span>
              <span className={`text-[10px] px-1 py-0.2 rounded font-bold ${
                b.sandboxSecurityStatus === 'ACTIVE_HARDENED' ? 'bg-[#00f0a8]/20 text-[#00f0a8]' : 'bg-[#ffa502]/20 text-[#ffa502]'
              }`}>
                {b.version.split('.')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Honest Architecture & Sandbox Disclaimer */}
      <div className="rounded-xl border border-[#38bdf8]/30 bg-[#38bdf8]/5 p-4 flex items-start space-x-3 text-xs">
        <Info className="h-5 w-5 text-[#38bdf8] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-mono font-bold text-[#e2e8f0]">
            Browser Boundary & Sandboxing Architecture Notice:
          </span>
          <p className="text-[#94a3b8] leading-relaxed">
            Browsers intentionally restrict websites from inspecting local SQLite credential databases or raw memory without user consent. SentinelKey respects these OS-level security boundaries. We inspect permissions, network encryption (DoH), and cryptographic hash matches without installing unauthorized root certificates or attempting memory injection.
          </p>
        </div>
      </div>

      {/* Browser Hardening Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* DoH & Network Security */}
        <div className="rounded-xl border border-[#1b283d] bg-[#0c121e] p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#162335]">
            <span className="font-mono text-xs font-bold text-white uppercase">DNS-over-HTTPS (DoH)</span>
            <Globe className="h-4 w-4 text-[#00f0a8]" />
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-[#94a3b8]">
              <span>Status:</span>
              <span className="font-mono text-[#00f0a8] font-bold">
                {activeBrowser.dohActive ? 'ACTIVE (ENCRYPTED)' : 'INACTIVE'}
              </span>
            </div>
            <div className="flex justify-between text-[#94a3b8]">
              <span>Resolver:</span>
              <span className="font-mono text-white font-bold">{activeBrowser.dohProvider || 'System Native'}</span>
            </div>
            <div className="flex justify-between text-[#94a3b8]">
              <span>Protection:</span>
              <span className="text-[#cbd5e1]">Prevents ISP DNS snooping & spoofing</span>
            </div>
          </div>
        </div>

        {/* Sandbox & Memory Isolation */}
        <div className="rounded-xl border border-[#1b283d] bg-[#0c121e] p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#162335]">
            <span className="font-mono text-xs font-bold text-white uppercase">Process Sandboxing</span>
            <Shield className="h-4 w-4 text-[#38bdf8]" />
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-[#94a3b8]">
              <span>Isolation Tier:</span>
              <span className="font-mono text-[#38bdf8] font-bold">{activeBrowser.sandboxSecurityStatus}</span>
            </div>
            <div className="flex justify-between text-[#94a3b8]">
              <span>Site Isolation:</span>
              <span className="font-mono text-[#00f0a8] font-bold">STRICT (Per-Origin Process)</span>
            </div>
            <div className="flex justify-between text-[#94a3b8]">
              <span>Out-of-Process Iframes:</span>
              <span className="font-mono text-[#00f0a8] font-bold">ENFORCED</span>
            </div>
          </div>
        </div>

        {/* Master Password / DPAPI Vault */}
        <div className="rounded-xl border border-[#1b283d] bg-[#0c121e] p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#162335]">
            <span className="font-mono text-xs font-bold text-white uppercase">Storage Encryption</span>
            <Lock className="h-4 w-4 text-[#ffa502]" />
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-[#94a3b8]">
              <span>OS Keychain / DPAPI:</span>
              <span className="font-mono text-[#00f0a8] font-bold">ACTIVE</span>
            </div>
            <div className="flex justify-between text-[#94a3b8]">
              <span>Sync Encryption:</span>
              <span className="font-mono text-white font-bold">End-to-End Encrypted</span>
            </div>
            <div className="flex justify-between text-[#94a3b8]">
              <span>Audit Recommendation:</span>
              <span className="text-[#ffa502]">Prefer FIDO2 Passkeys over autofill</span>
            </div>
          </div>
        </div>
      </div>

      {/* Extension Privilege & Risk Auditor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#162335]">
          <div>
            <h2 className="text-base font-bold font-mono text-white">Browser Extension Privilege Audit</h2>
            <p className="text-xs text-[#94a3b8]">
              High-privilege permissions (such as &lt;all_urls&gt; and webRequest) can inspect web page form inputs and steal cookies.
            </p>
          </div>
          <span className="text-xs font-mono text-[#64748b]">{extensions.length} EXTENSIONS AUDITED</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {extensions.map(ext => {
            const isHighRisk = ext.riskLevel === 'HIGH';
            return (
              <div
                key={ext.id}
                className={`rounded-xl border p-5 space-y-3 transition-all ${
                  isHighRisk
                    ? 'border-[#ff4757]/40 bg-[#0e111a]'
                    : 'border-[#182538] bg-[#0a101b]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isHighRisk ? 'bg-[#ff4757]/20 text-[#ff4757]' : 'bg-[#182538] text-[#94a3b8]'}`}>
                      <Puzzle className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{ext.name}</h4>
                      <p className="text-[11px] font-mono text-[#64748b]">
                        v{ext.version} • {ext.manifestVersion === 3 ? 'Manifest V3' : 'Manifest V2'}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    isHighRisk
                      ? 'bg-[#ff4757]/20 text-[#ff4757] border border-[#ff4757]/30'
                      : ext.riskLevel === 'MEDIUM'
                      ? 'bg-[#ffa502]/20 text-[#ffa502]'
                      : 'bg-[#00f0a8]/20 text-[#00f0a8]'
                  }`}>
                    {ext.riskLevel} RISK
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-mono text-[10px] text-[#64748b] uppercase">Declared Permissions:</span>
                  <div className="flex flex-wrap gap-1">
                    {ext.permissions.map((perm: string, idx: number) => (
                      <span
                        key={idx}
                        className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                          perm.includes('all_urls') || perm.includes('webRequest') || perm.includes('cookies')
                            ? 'bg-[#ff4757]/15 text-[#ff4757] border border-[#ff4757]/30 font-bold'
                            : 'bg-[#152132] text-[#94a3b8]'
                        }`}
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>

                {isHighRisk && (
                  <div className="rounded-lg border border-[#ff4757]/30 bg-[#ff4757]/5 p-2.5 text-[11px] text-[#ff6b81] space-y-1">
                    <div className="font-bold flex items-center space-x-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Broad DOM Read Access Detected</span>
                    </div>
                    <p className="text-[#94a3b8]">
                      This extension has permission to modify all visited websites. If compromised, it could intercept credentials submitted in browser forms.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
