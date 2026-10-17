import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Shield,
  FileText,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  Download,
  Printer,
  ChevronDown,
} from 'lucide-react';
import { IncidentStep } from '../types';

interface CompromiseResponseCenterProps {
  steps: IncidentStep[];
  onToggleStep: (stepNumber: number, completed: boolean, notes?: string) => void;
  onResetIncident: () => void;
}

export const CompromiseResponseCenter: React.FC<CompromiseResponseCenterProps> = ({
  steps,
  onToggleStep,
  onResetIncident,
}) => {
  const [activeStepTab, setActiveStepTab] = useState<number>(4);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [userNotes, setUserNotes] = useState<Record<number, string>>({
    1: 'Wi-Fi disabled on suspect workstation; switched to verified MacBook Pro.',
    2: 'Operating from MacBook Pro with hardware Secure Enclave.',
    3: 'Primary Gmail password rotated; 0 forwarding filters detected.',
  });

  const completedCount = steps.filter(s => s.isCompleted).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const activeStep = steps.find(s => s.stepNumber === activeStepTab) || steps[0];

  const handleNotesChange = (stepNum: number, text: string) => {
    setUserNotes(prev => ({ ...prev, [stepNum]: text }));
  };

  const handleStepCompletionToggle = (stepNum: number) => {
    const step = steps.find(s => s.stepNumber === stepNum);
    const willBeCompleted = !step?.isCompleted;
    onToggleStep(stepNum, willBeCompleted, userNotes[stepNum]);
    if (willBeCompleted && stepNum < 10) {
      setActiveStepTab(stepNum + 1);
    }
  };

  const generateReportText = () => {
    return `# SENTINELKEY FORENSIC INCIDENT CONTAINMENT REPORT
Incident Reference: INC-2026-0921-A
Classification: HIGH SEVERITY / CONTAINMENT PROTOCOL
Generated: ${new Date().toISOString()}
Integrity Hash (SHA-256): 8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a

STATUS: ${completedCount === 10 ? 'RESOLVED' : completedCount >= 3 ? 'CONTAINED' : 'ACTIVE IN PROGRESS'}
Progress: ${completedCount} of 10 Steps Verified (${progressPercent}%)

## CHRONOLOGICAL CONTAINMENT AUDIT TRAIL:
${steps.map(s => `[${s.isCompleted ? 'COMPLETED' : 'PENDING'}] Step ${s.stepNumber}: ${s.title}
  Summary: ${s.summary}
  Notes: ${userNotes[s.stepNumber] || 'N/A'}
  Timestamp: ${s.completedAt || 'Pending verification'}
`).join('\n')}

## RESIDUAL RISK ASSESSMENT & RECOMMENDATIONS:
- Plaintext credentials were not stored on SentinelKey servers.
- Primary email credentials successfully secured.
- Hardware passkeys (FIDO2) should be kept active across all tier-1 services.
- Periodic re-audit recommended in 48 hours.
`;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleDownloadReport = () => {
    const blob = new Blob([generateReportText()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinelkey-incident-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header with Incident Banner */}
      <div className="rounded-xl border border-[#ff4757]/40 bg-[#0f1422] p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="rounded bg-[#ff4757]/20 border border-[#ff4757]/40 px-2 py-0.5 text-[10px] font-mono font-bold text-[#ff4757]">
                EMERGENCY RESPONSE PROTOCOL
              </span>
              <span className="text-xs font-mono text-[#64748b]">ID: INC-2026-0921-A</span>
            </div>
            <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
              &quot;SECURE MY ACCOUNTS&quot; Incident Response Workflow
            </h1>
            <p className="text-xs text-[#94a3b8] max-w-2xl leading-relaxed">
              When an endpoint infection or credential theft is suspected, this systematic 10-step protocol guides you through isolating the machine, preserving identity roots, and eliminating adversary persistence.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center space-x-1.5 rounded-lg border border-[#23354d] bg-[#121b2a] px-3.5 py-2 font-mono text-xs font-bold text-[#38bdf8] hover:bg-[#18253a] transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>Incident Report ({completedCount}/10)</span>
            </button>
            <button
              onClick={onResetIncident}
              className="flex items-center space-x-1 rounded-lg border border-[#1e2a3c] bg-[#0c1320] px-3 py-2 font-mono text-xs text-[#94a3b8] hover:text-white transition-colors"
              title="Reset checklist progress"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#94a3b8]">
              CONTAINMENT PROGRESS: <strong className="text-white">{completedCount} of 10 Steps Complete</strong>
            </span>
            <span className={`font-bold ${completedCount === 10 ? 'text-[#00f0a8]' : 'text-[#ffa502]'}`}>
              {progressPercent}% {completedCount >= 3 ? '• PERIMETER CONTAINED' : '• UNCONTAINED'}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#162235] overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                completedCount === 10 ? 'bg-[#00f0a8]' : completedCount >= 3 ? 'bg-[#ffa502]' : 'bg-[#ff4757]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Workspace: Step Selector vs Step Execution Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 10 Steps Vertical Navigation */}
        <div className="lg:col-span-4 space-y-2">
          <div className="pb-2 text-xs font-mono text-[#64748b] uppercase tracking-wider">
            Incident Playbook Steps (1 - 10)
          </div>

          <div className="space-y-1.5">
            {steps.map(step => {
              const isCurrent = activeStepTab === step.stepNumber;
              return (
                <button
                  key={step.stepNumber}
                  onClick={() => setActiveStepTab(step.stepNumber)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                    isCurrent
                      ? 'border-[#38bdf8] bg-[#121c2c] text-white shadow-md'
                      : step.isCompleted
                      ? 'border-[#142335] bg-[#090f18] text-[#94a3b8]'
                      : 'border-[#1a2638] bg-[#0c121e] text-[#cbd5e1] hover:bg-[#101826]'
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-mono font-bold ${
                        step.isCompleted
                          ? 'bg-[#00f0a8]/20 text-[#00f0a8]'
                          : isCurrent
                          ? 'bg-[#38bdf8] text-[#06090f]'
                          : 'bg-[#1a2538] text-[#94a3b8]'
                      }`}
                    >
                      {step.isCompleted ? <Check className="h-3.5 w-3.5" /> : step.stepNumber}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold truncate">STEP {step.stepNumber}</div>
                      <div className="text-[11px] text-[#94a3b8] truncate">{step.title}</div>
                    </div>
                  </div>

                  <div className="shrink-0 text-[10px] font-mono">
                    {step.isCompleted ? (
                      <span className="text-[#00f0a8]">DONE</span>
                    ) : (
                      <span className="text-[#64748b]">PENDING</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Step Interactive Guidance & Execution */}
        <div className="lg:col-span-8 rounded-xl border border-[#1e2d42] bg-[#0c121e] p-6 space-y-6">
          <div className="flex items-start justify-between pb-4 border-b border-[#162335]">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="rounded bg-[#38bdf8]/15 border border-[#38bdf8]/30 px-2 py-0.5 text-[10px] font-mono font-bold text-[#38bdf8]">
                  ACTIVE STEP {activeStep.stepNumber} OF 10
                </span>
                {activeStep.isCompleted && (
                  <span className="rounded bg-[#00f0a8]/15 border border-[#00f0a8]/30 px-2 py-0.5 text-[10px] font-mono font-bold text-[#00f0a8]">
                    VERIFIED COMPLETED
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold font-mono text-white">{activeStep.title}</h2>
              <p className="text-xs text-[#38bdf8] font-mono">{activeStep.summary}</p>
            </div>

            <button
              onClick={() => handleStepCompletionToggle(activeStep.stepNumber)}
              className={`flex items-center space-x-1.5 rounded-lg px-4 py-2 font-mono text-xs font-bold transition-all shadow-md ${
                activeStep.isCompleted
                  ? 'bg-[#152335] text-[#94a3b8] hover:bg-[#1a2d44]'
                  : 'bg-[#00f0a8] text-[#05080e] hover:bg-[#00f0a8]/90'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{activeStep.isCompleted ? 'Mark as Incomplete' : 'Mark Step Complete'}</span>
            </button>
          </div>

          {/* Step Action Instruction */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
              Execution Guidance
            </h3>
            <div className="rounded-lg border border-[#1b2a3f] bg-[#080d16] p-4 text-xs text-[#e2e8f0] leading-relaxed">
              {activeStep.instruction}
            </div>
          </div>

          {/* Technical Deep Dive */}
          <div className="space-y-2">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#64748b]">
              Why This Step Is Critical
            </h3>
            <ul className="space-y-1.5 text-xs text-[#94a3b8]">
              {activeStep.technicalDetails.map((detail, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-[#00f0a8] mt-0.5">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Link to Provider if applicable */}
          {activeStep.actionUrl && (
            <div className="pt-2">
              <a
                href={activeStep.actionUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center space-x-1.5 rounded-md border border-[#38bdf8]/40 bg-[#38bdf8]/10 px-3 py-1.5 text-xs font-mono font-bold text-[#38bdf8] hover:bg-[#38bdf8]/20 transition-colors"
              >
                <span>{activeStep.actionLinkText || 'Open External Security Console'}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {/* Forensic Notes for Incident Report */}
          <div className="space-y-2 pt-4 border-t border-[#162335]">
            <label className="block font-mono text-xs font-bold text-[#cbd5e1]">
              Incident Responder Notes (Saved to Forensic Report):
            </label>
            <textarea
              rows={2}
              value={userNotes[activeStep.stepNumber] || ''}
              onChange={e => handleNotesChange(activeStep.stepNumber, e.target.value)}
              placeholder="Record actions taken, affected accounts rotated, or forensic observations..."
              className="w-full rounded-lg border border-[#1b2a3e] bg-[#080d16] p-3 text-xs text-white placeholder-[#64748b] focus:border-[#38bdf8] focus:outline-none font-mono"
            />
          </div>

          {/* Bottom Pagination */}
          <div className="pt-4 flex items-center justify-between border-t border-[#162335] text-xs font-mono">
            <button
              onClick={() => setActiveStepTab(Math.max(1, activeStep.stepNumber - 1))}
              disabled={activeStep.stepNumber === 1}
              className="px-3 py-1.5 rounded border border-[#1b283d] text-[#94a3b8] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Previous Step
            </button>
            <span className="text-[#64748b]">Step {activeStep.stepNumber} of 10</span>
            <button
              onClick={() => setActiveStepTab(Math.min(10, activeStep.stepNumber + 1))}
              disabled={activeStep.stepNumber === 10}
              className="px-3 py-1.5 rounded border border-[#1b283d] text-[#38bdf8] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next Step →
            </button>
          </div>
        </div>
      </div>

      {/* Incident Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-3xl rounded-xl border border-[#23354d] bg-[#0a0f19] p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#162233]">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-[#00f0a8]" />
                <h3 className="font-mono font-bold text-white text-base">Cryptographic Incident Report</h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="rounded p-1 text-[#64748b] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto rounded-lg border border-[#152233] bg-[#06090f] p-4 font-mono text-xs text-[#cbd5e1] whitespace-pre-wrap leading-relaxed">
              {generateReportText()}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-[11px] font-mono text-[#64748b]">
                SHA-256 Digest: <span className="text-[#00f0a8]">8f7a6b5c4d3e2f1a0b9c...</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyReport}
                  className="flex items-center space-x-1 rounded-md border border-[#1e2d42] bg-[#111928] px-3 py-1.5 font-mono text-xs text-[#e2e8f0] hover:bg-[#182438]"
                >
                  {copiedReport ? <Check className="h-3.5 w-3.5 text-[#00f0a8]" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedReport ? 'Copied' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={handleDownloadReport}
                  className="flex items-center space-x-1 rounded-md bg-[#00f0a8] px-3 py-1.5 font-mono text-xs font-bold text-[#05080e] hover:bg-[#00f0a8]/90"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download .MD</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
