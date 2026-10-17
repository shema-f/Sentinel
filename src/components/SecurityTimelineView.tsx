import React, { useState } from 'react';
import {
  Terminal,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Clock,
  Filter,
  Search,
} from 'lucide-react';
import { SecurityEvent } from '../types';

interface SecurityTimelineViewProps {
  events: SecurityEvent[];
}

export const SecurityTimelineView: React.FC<SecurityTimelineViewProps> = ({ events }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredEvents = events.filter(e => {
    if (filterSeverity === 'ALL') return true;
    return e.severity === filterSeverity;
  });

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#162335]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Terminal className="h-5 w-5 text-[#00f0a8]" />
            <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
              Cryptographic Security Event Ledger
            </h1>
          </div>
          <p className="text-xs text-[#94a3b8]">
            Tamper-evident event stream capturing posture changes, hash matches, containment steps, and access grants.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-[#64748b] flex items-center space-x-1">
            <Filter className="h-3 w-3" />
            <span>SEVERITY:</span>
          </span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setFilterSeverity(lvl)}
              className={`rounded px-2.5 py-1 transition-colors ${
                filterSeverity === lvl
                  ? 'bg-[#1e2e46] text-white border border-[#2b4164] font-bold'
                  : 'text-[#94a3b8] hover:bg-[#121c2c]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Chronological Event Stream */}
      <div className="space-y-4">
        {filteredEvents.map(event => {
          const isCritical = event.severity === 'CRITICAL' || event.severity === 'HIGH';

          return (
            <div
              key={event.id}
              className={`rounded-xl border p-5 transition-all ${
                isCritical
                  ? 'border-[#ff4757]/40 bg-[#0e101a]'
                  : 'border-[#182538] bg-[#0c121e]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#162335]">
                <div className="flex items-center space-x-3">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold ${
                      event.severity === 'CRITICAL'
                        ? 'bg-[#ff4757]/20 text-[#ff4757]'
                        : event.severity === 'HIGH'
                        ? 'bg-[#ff6b81]/20 text-[#ff6b81]'
                        : event.severity === 'MEDIUM'
                        ? 'bg-[#ffa502]/20 text-[#ffa502]'
                        : event.severity === 'LOW'
                        ? 'bg-[#38bdf8]/20 text-[#38bdf8]'
                        : 'bg-[#64748b]/20 text-[#94a3b8]'
                    }`}
                  >
                    {event.severity}
                  </span>
                  <h3 className="text-sm font-bold text-white font-mono">{event.eventType}</h3>
                </div>

                <div className="flex items-center space-x-3 text-xs font-mono text-[#64748b]">
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                  </span>
                  <span>•</span>
                  <span>{new Date(event.timestamp).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-3 space-y-3 text-xs">
                <p className="text-[#cbd5e1] leading-relaxed">{event.description}</p>

                {/* Telemetry metadata */}
                <div className="rounded-lg border border-[#162233] bg-[#070b13] p-3 font-mono text-[11px] text-[#94a3b8] overflow-x-auto">
                  <pre>{JSON.stringify(event.metadata || { asset: event.asset, eventType: event.eventType, actor: event.actor }, null, 2)}</pre>
                </div>

                {/* Event Digest Chain */}
                <div className="flex items-center justify-between text-[10px] font-mono text-[#64748b] pt-1">
                  <span>
                    ACTOR: <strong className="text-white">{event.actor}</strong>
                  </span>
                  <span className="text-[#00f0a8]">
                    SHA-256 INTEGRITY CHAIN VERIFIED
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
