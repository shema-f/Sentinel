import React, { useState } from 'react';
import {
  Layers,
  Shield,
  User,
  Laptop,
  Radio,
  Key,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { SecurityNode, SecurityEdge } from '../types';

interface SecurityGraphViewProps {
  nodes: SecurityNode[];
  edges: SecurityEdge[];
}

export const SecurityGraphView: React.FC<SecurityGraphViewProps> = ({
  nodes,
  edges,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-threat-nazapi');
  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const getNodeColor = (status: string, type: string) => {
    if (status === 'compromised' || status === 'critical' || type === 'threat') return '#ff4757';
    if (status === 'warning' || status === 'vulnerable') return '#ffa502';
    return '#00f0a8';
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#162335]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Layers className="h-5 w-5 text-[#00f0a8]" />
            <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
              Interactive Identity & Threat Graph
            </h1>
          </div>
          <p className="text-xs text-[#94a3b8]">
            Visualizes relationships between your identity roots, authenticated devices, active browser profiles, cloud services, and threat actors.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="flex items-center space-x-1.5 text-[#00f0a8]">
            <span className="h-2 w-2 rounded-full bg-[#00f0a8]" />
            <span>SECURE</span>
          </span>
          <span className="flex items-center space-x-1.5 text-[#ffa502]">
            <span className="h-2 w-2 rounded-full bg-[#ffa502]" />
            <span>ELEVATED PRIVILEGE</span>
          </span>
          <span className="flex items-center space-x-1.5 text-[#ff4757]">
            <span className="h-2 w-2 rounded-full bg-[#ff4757]" />
            <span>COMPROMISE LINK</span>
          </span>
        </div>
      </div>

      {/* Main Graph & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph Canvas Visualizer */}
        <div className="lg:col-span-8 rounded-xl border border-[#1a273b] bg-[#090d16] p-6 relative overflow-hidden min-h-[500px] flex flex-col justify-between">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#101827_1px,transparent_1px),linear-gradient(to_bottom,#101827_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40 pointer-events-none" />

          {/* SVG Links Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1="20%" y1="50%" x2="50%" y2="25%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="#334155" strokeWidth="2" />
            <line x1="20%" y1="50%" x2="50%" y2="75%" stroke="#334155" strokeWidth="2" />
            <line x1="50%" y1="25%" x2="80%" y2="20%" stroke="#ff4757" strokeWidth="2" strokeDasharray="5 5" />
            <line x1="50%" y1="50%" x2="80%" y2="50%" stroke="#ffa502" strokeWidth="2" />
            <line x1="50%" y1="75%" x2="80%" y2="80%" stroke="#00f0a8" strokeWidth="2" />
          </svg>

          {/* Graph Nodes Placement */}
          <div className="relative z-10 grid grid-cols-3 gap-6 h-full items-center">
            {/* Column 1: Identity Root */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <button
                onClick={() => setSelectedNodeId('node-root-user')}
                className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all ${
                  selectedNodeId === 'node-root-user'
                    ? 'border-[#00f0a8] bg-[#0c1824] shadow-lg shadow-[#00f0a8]/20 scale-105'
                    : 'border-[#1b283d] bg-[#0c121e] hover:border-[#38bdf8]'
                }`}
              >
                <div className="h-12 w-12 rounded-full bg-[#00f0a8]/10 border border-[#00f0a8]/40 flex items-center justify-center text-[#00f0a8] mb-2">
                  <User className="h-6 w-6" />
                </div>
                <span className="font-mono text-xs font-bold text-white">Alex Vance</span>
                <span className="font-mono text-[10px] text-[#00f0a8]">Identity Root</span>
              </button>
            </div>

            {/* Column 2: Devices & Browsers */}
            <div className="flex flex-col space-y-6 items-center">
              <button
                onClick={() => setSelectedNodeId('node-dev-mbp')}
                className={`w-full max-w-[200px] flex items-center space-x-3 p-3 rounded-lg border text-left transition-all ${
                  selectedNodeId === 'node-dev-mbp'
                    ? 'border-[#38bdf8] bg-[#0c1824] shadow-md scale-105'
                    : 'border-[#1b283d] bg-[#0c121e] hover:border-[#38bdf8]'
                }`}
              >
                <Laptop className="h-5 w-5 text-[#38bdf8] shrink-0" />
                <div className="truncate font-mono text-xs">
                  <div className="font-bold text-white truncate">MacBook Pro 16&quot;</div>
                  <div className="text-[10px] text-[#00f0a8]">Enclave Active</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedNodeId('node-brw-chrome')}
                className={`w-full max-w-[200px] flex items-center space-x-3 p-3 rounded-lg border text-left transition-all ${
                  selectedNodeId === 'node-brw-chrome'
                    ? 'border-[#ffa502] bg-[#0c1824] shadow-md scale-105'
                    : 'border-[#1b283d] bg-[#0c121e] hover:border-[#ffa502]'
                }`}
              >
                <Radio className="h-5 w-5 text-[#ffa502] shrink-0" />
                <div className="truncate font-mono text-xs">
                  <div className="font-bold text-white truncate">Chrome 128</div>
                  <div className="text-[10px] text-[#ffa502]">High Priv Ext</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedNodeId('node-dev-phone')}
                className={`w-full max-w-[200px] flex items-center space-x-3 p-3 rounded-lg border text-left transition-all ${
                  selectedNodeId === 'node-dev-phone'
                    ? 'border-[#00f0a8] bg-[#0c1824] shadow-md scale-105'
                    : 'border-[#1b283d] bg-[#0c121e] hover:border-[#00f0a8]'
                }`}
              >
                <Lock className="h-5 w-5 text-[#00f0a8] shrink-0" />
                <div className="truncate font-mono text-xs">
                  <div className="font-bold text-white truncate">iPhone 15 Pro</div>
                  <div className="text-[10px] text-[#00f0a8]">FaceID Passkey</div>
                </div>
              </button>
            </div>

            {/* Column 3: Accounts & Threats */}
            <div className="flex flex-col space-y-6 items-center">
              <button
                onClick={() => setSelectedNodeId('node-threat-nazapi')}
                className={`w-full max-w-[220px] flex items-center space-x-3 p-3 rounded-lg border text-left transition-all animate-pulse ${
                  selectedNodeId === 'node-threat-nazapi'
                    ? 'border-[#ff4757] bg-[#1a0f15] shadow-lg shadow-[#ff4757]/20 scale-105'
                    : 'border-[#ff4757]/60 bg-[#12080d] hover:border-[#ff4757]'
                }`}
              >
                <AlertTriangle className="h-5 w-5 text-[#ff4757] shrink-0" />
                <div className="truncate font-mono text-xs">
                  <div className="font-bold text-[#ff4757] truncate">Naz.API Stealer Dump</div>
                  <div className="text-[10px] text-[#ff6b81]">Credential Match</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedNodeId('node-ext-quickpdf')}
                className={`w-full max-w-[220px] flex items-center space-x-3 p-3 rounded-lg border text-left transition-all ${
                  selectedNodeId === 'node-ext-quickpdf'
                    ? 'border-[#ffa502] bg-[#1a140b] shadow-md scale-105'
                    : 'border-[#1b283d] bg-[#0c121e] hover:border-[#ffa502]'
                }`}
              >
                <Radio className="h-5 w-5 text-[#ffa502] shrink-0" />
                <div className="truncate font-mono text-xs">
                  <div className="font-bold text-white truncate">Quick PDF Extension</div>
                  <div className="text-[10px] text-[#ffa502]">&lt;all_urls&gt; Access</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedNodeId('node-acc-github')}
                className={`w-full max-w-[220px] flex items-center space-x-3 p-3 rounded-lg border text-left transition-all ${
                  selectedNodeId === 'node-acc-github'
                    ? 'border-[#00f0a8] bg-[#0c1824] shadow-md scale-105'
                    : 'border-[#1b283d] bg-[#0c121e] hover:border-[#00f0a8]'
                }`}
              >
                <Key className="h-5 w-5 text-[#00f0a8] shrink-0" />
                <div className="truncate font-mono text-xs">
                  <div className="font-bold text-white truncate">GitHub Enterprise</div>
                  <div className="text-[10px] text-[#00f0a8]">Passkey 2FA Bound</div>
                </div>
              </button>
            </div>
          </div>

          <div className="pt-4 text-[11px] font-mono text-[#64748b] border-t border-[#141e2e]">
            Select any node to inspect telemetry evidence, exposure risks, and mitigation actions.
          </div>
        </div>

        {/* Right Column: Node Inspector */}
        <div className="lg:col-span-4 rounded-xl border border-[#1a273b] bg-[#0c121e] p-6 space-y-6">
          <div className="pb-3 border-b border-[#162335]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#64748b] uppercase">Node Inspector</span>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase"
                style={{
                  color: getNodeColor(selectedNode.status, selectedNode.type),
                  backgroundColor: `${getNodeColor(selectedNode.status, selectedNode.type)}20`,
                }}
              >
                {selectedNode.status}
              </span>
            </div>
            <h3 className="mt-2 text-lg font-bold font-mono text-white">{selectedNode.label}</h3>
            <span className="text-xs font-mono text-[#38bdf8] uppercase">{selectedNode.type} NODE</span>
          </div>

          {/* Node Metadata Table */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
              Telemetry Attributes
            </h4>
            <div className="rounded-lg border border-[#162233] bg-[#080d16] p-3 space-y-2 text-xs font-mono">
              {Object.entries(selectedNode.metadata || { status: selectedNode.status, type: selectedNode.type, details: selectedNode.details || 'Hardened parameters' }).map(([k, v]) => (
                <div key={k} className="flex justify-between text-[#cbd5e1]">
                  <span className="text-[#64748b] capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="font-bold text-white">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Assessment */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
              Defensive Recommendation
            </h4>
            <div className="rounded-lg border border-[#1a293f] bg-[#080e1a] p-3 text-xs text-[#cbd5e1] leading-relaxed">
              {selectedNode.status === 'critical'
                ? 'High severity exposure detected. Initiate password rotation and session termination immediately via the "SECURE MY ACCOUNTS" center.'
                : selectedNode.status === 'warning'
                ? 'Elevated privilege scope detected. Pin this extension to explicit domain patterns rather than <all_urls> to reduce risk.'
                : 'Node is operating within hardened defense parameters with active cryptographic verification.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
