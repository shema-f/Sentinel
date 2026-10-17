import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  Radio,
  Laptop,
  KeyRound,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Clock,
  Filter,
  Check,
  X,
  RotateCcw,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { RiskFinding, SecurityPosture, Severity, SecurityEvent } from '../types';

interface IdentityDashboardProps {
  posture: SecurityPosture;
  findings: RiskFinding[];
  onUpdateFindingStatus: (id: string, status: 'open' | 'in_progress' | 'resolved' | 'ignored') => void;
  onNavigateToIncident: () => void;
  onAskAnalyst: (finding: RiskFinding) => void;
  events: SecurityEvent[];
}

export const IdentityDashboard: React.FC<IdentityDashboardProps> = ({
  posture,
  findings,
  onUpdateFindingStatus,
  onNavigateToIncident,
  onAskAnalyst,
  events,
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const filteredFindings = findings.filter(f => {
    if (severityFilter === 'ALL') return true;
    return f.severity === severityFilter;
  });

  const getSeverityIndicator = (severity: Severity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-400">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Critical Exposure</span>
          </div>
        );
      case 'HIGH':
        return (
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-orange-400">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span>High Risk</span>
          </div>
        );
      case 'MEDIUM':
        return (
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Moderate</span>
          </div>
        );
      case 'LOW':
        return (
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-cyan-400">
            <span className="h-2 w-2 rounded-full bg-cyan-500" />
            <span>Low Risk</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-1.5 text-xs font-medium text-slate-400">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            <span>Informational</span>
          </div>
        );
    }
  };

  const hasHighRisk = findings.some(f => (f.severity === 'HIGH' || f.severity === 'CRITICAL') && f.remediationStatus !== 'resolved');

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Top Banner: Emergency Trigger Alert */}
      {hasHighRisk && (
        <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-950/40 via-slate-900/80 to-slate-900/60 p-5 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 mt-0.5">
                <AlertTriangle className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Critical Credential Exposure Identified
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
                  A verified match was identified in Naz.API credential dump via local k-anonymity matching. Active containment is recommended to prevent session hijacking.
                </p>
              </div>
            </div>
            <button
              onClick={onNavigateToIncident}
              className="flex items-center space-x-2 rounded-lg bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/25 whitespace-nowrap"
            >
              <span>Execute Containment Runbook</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Posture Score & Empirical Evidence Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Posture Gauge Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col justify-between backdrop-blur-md shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <span className="text-xs font-semibold text-slate-300">Security Posture</span>
              <span className="text-[11px] text-slate-500">NIST SP 800-63B</span>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-extrabold tracking-tight text-white font-sans">{posture.overallScore}</span>
                  <span className="text-sm font-medium text-slate-500">/ 100</span>
                </div>
                <div className="flex items-center space-x-2 pt-1 text-xs text-slate-400">
                  <span className={`font-bold ${
                    posture.grade.startsWith('A')
                      ? 'text-emerald-400'
                      : posture.grade.startsWith('B')
                      ? 'text-cyan-400'
                      : 'text-amber-400'
                  }`}>
                    Grade {posture.grade}
                  </span>
                  <span>·</span>
                  <span className="capitalize">{posture.identityRisk.toLowerCase()} Risk</span>
                </div>
              </div>

              {/* Progress Arc Visual */}
              <div className="relative h-24 w-24 flex items-center justify-center">
                <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={posture.overallScore >= 80 ? 'text-emerald-400' : posture.overallScore >= 60 ? 'text-cyan-400' : 'text-amber-400'}
                    strokeDasharray={`${posture.overallScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-xs font-semibold text-slate-400">
                  {posture.overallScore}%
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-6 border-t border-slate-800/80 text-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span>Passkey & 2FA Adoption</span>
              <span className="font-semibold text-white">{posture.mfaPasskeyAdoption}%</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Browser Configuration</span>
              <span className="font-semibold text-emerald-400">{posture.browserSecurity}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Hardware Enclave / TPM</span>
              <span className="font-semibold text-cyan-400">{posture.deviceSecurity}</span>
            </div>
          </div>
        </div>

        {/* Empirical Evidence Behind Score */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Score Weighting & Empirical Evaluation
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">5 Evaluated Signals</span>
          </div>

          <div className="space-y-2.5">
            {posture.scoreEvidence.map((ev, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between rounded-xl border border-slate-800/80 bg-slate-950/50 p-3.5 text-xs transition-colors hover:border-slate-700/80"
              >
                <div className="space-y-1 pr-4">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        ev.status === 'PASS'
                          ? 'bg-emerald-400'
                          : ev.status === 'WARN'
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                    />
                    <span className="font-semibold text-slate-200">{ev.factor}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed pl-4">{ev.description}</p>
                </div>

                <div className="shrink-0 font-mono font-semibold text-right">
                  <span
                    className={`text-xs ${
                      ev.impact.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {ev.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Pillar KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Browser Shield</span>
            <Radio className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold tracking-tight text-white">Chromium 128</div>
          <div className="text-[11px] text-emerald-400 flex items-center space-x-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>DoH & HSTS Enforced</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Device Hardware</span>
            <Laptop className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold tracking-tight text-white">3 Active Devices</div>
          <div className="text-[11px] text-cyan-400 flex items-center space-x-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Apple Enclave & BitLocker</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Credential Exposure</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold tracking-tight text-rose-400">1 Match Detected</div>
          <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
            <span>Naz.API dump · k-Anonymity</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Authentication Tier</span>
            <KeyRound className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold tracking-tight text-white">FIDO2 Passkeys</div>
          <div className="text-[11px] text-emerald-400 flex items-center space-x-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Phishing-Resistant Active</span>
          </div>
        </div>
      </div>

      {/* Active Risk Findings (Mandated 5-Part UX Structure with Modern Aesthetics) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">Active Risk Findings</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical risk findings with technical evidence, plain-language rationale, and guided remediation.
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex items-center space-x-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setSeverityFilter(lvl)}
                className={`px-3 py-1.5 font-medium rounded-lg transition-all capitalize ${
                  severityFilter === lvl
                    ? 'bg-slate-800 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {filteredFindings.map(finding => {
            const isResolved = finding.remediationStatus === 'resolved';
            const isIgnored = finding.remediationStatus === 'ignored';

            return (
              <div
                key={finding.id}
                className={`rounded-2xl border transition-all ${
                  isResolved
                    ? 'border-slate-800/60 bg-slate-950/40 opacity-75'
                    : isIgnored
                    ? 'border-slate-800/40 bg-slate-950/30 opacity-60'
                    : 'border-slate-800 bg-slate-900/70 shadow-lg'
                }`}
              >
                {/* Header: Title, Severity Indicator & Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 px-6 py-4 bg-slate-950/40">
                  <div className="flex items-center space-x-4">
                    {getSeverityIndicator(finding.severity)}
                    <h3 className="text-sm font-semibold text-white tracking-tight">{finding.title}</h3>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 font-sans">
                    <span>Target: <strong className="text-slate-300 font-medium">{finding.affectedAsset}</strong></span>
                    <span>·</span>
                    <span>{new Date(finding.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="p-6 space-y-5 text-xs">
                  {/* 1. What Happened */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                      What Happened
                    </span>
                    <p className="text-slate-300 leading-relaxed text-sm">{finding.explanation}</p>
                  </div>

                  {/* 2. Why It Matters */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                      Why It Matters
                    </span>
                    <p className="text-slate-400 leading-relaxed">
                      If left unmitigated, attackers can exploit this exposure vector without requiring advanced persistence. Credential stuffing or token theft can lead to lateral account movement.
                    </p>
                  </div>

                  {/* 3. Evidence & Technical Telemetry */}
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      <Terminal className="h-3.5 w-3.5" />
                      <span>Technical Evidence & Telemetry</span>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-emerald-400/90 overflow-x-auto shadow-inner">
                      <pre>{JSON.stringify(finding.evidence, null, 2)}</pre>
                    </div>
                  </div>

                  {/* 4. What You Should Do */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                      Recommended Action
                    </span>
                    <p className="text-slate-200 font-medium leading-relaxed">{finding.recommendedAction}</p>
                  </div>

                  {/* 5. Action Buttons & Status */}
                  <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-2.5">
                      <button
                        onClick={() => {
                          if (finding.title.includes('Naz.API') || finding.severity === 'HIGH' || finding.severity === 'CRITICAL') {
                            onNavigateToIncident();
                          } else {
                            onUpdateFindingStatus(finding.id, 'resolved');
                          }
                        }}
                        disabled={isResolved}
                        className={`flex items-center space-x-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                          isResolved
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-emerald-400 text-slate-950 hover:bg-emerald-300 shadow-md shadow-emerald-400/10'
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>{isResolved ? 'Remediated' : 'Fix Now'}</span>
                      </button>

                      <button
                        onClick={() => onUpdateFindingStatus(finding.id, isIgnored ? 'open' : 'ignored')}
                        className="flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>{isIgnored ? 'Restore Finding' : 'Ignore'}</span>
                      </button>

                      <button
                        onClick={() => onAskAnalyst(finding)}
                        className="flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs font-medium text-cyan-300 hover:bg-slate-800 transition-colors"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Analyze with AI Advisor</span>
                      </button>
                    </div>

                    <div className="text-xs text-slate-500 font-sans">
                      Status: <span className="font-semibold text-slate-200 capitalize">{finding.remediationStatus.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
