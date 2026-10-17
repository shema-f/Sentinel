import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Shield,
  Terminal,
  Activity,
  Check,
} from 'lucide-react';
import { runSecurityTests } from '../../tests/security.test';

export const TestRunnerView: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testSummary, setTestSummary] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: { suite: string; name: string; passed: boolean; message?: string }[];
  } | null>(null);

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      const summary = await runSecurityTests();
      setTestSummary(summary);
    } catch (err) {
      console.error('Test run failed:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#162335]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-[#00f0a8]" />
            <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
              Automated Security & Integrity Test Suite
            </h1>
          </div>
          <p className="text-xs text-[#94a3b8]">
            Validates cryptographic primitives, k-anonymity boundaries, secret scanners, XSS sanitation, and RBAC matrix.
          </p>
        </div>

        <button
          onClick={handleRunTests}
          disabled={isRunning}
          className="flex items-center space-x-2 rounded-lg bg-[#00f0a8] px-5 py-2.5 font-mono text-xs font-bold text-[#05080e] hover:bg-[#00f0a8]/90 transition-colors shadow-md disabled:opacity-50"
        >
          <Play className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Executing Suite...' : 'Execute Security Tests (22)'}</span>
        </button>
      </div>

      {/* Summary Stats */}
      {testSummary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-[#1a273b] bg-[#0c121e] p-5 space-y-1">
            <span className="text-xs font-mono text-[#64748b]">TOTAL ASSERTIONS</span>
            <div className="text-2xl font-bold font-mono text-white">{testSummary.total}</div>
          </div>
          <div className="rounded-xl border border-[#00f0a8]/30 bg-[#00f0a8]/5 p-5 space-y-1">
            <span className="text-xs font-mono text-[#00f0a8]">PASSED</span>
            <div className="text-2xl font-bold font-mono text-[#00f0a8]">{testSummary.passed}</div>
          </div>
          <div className="rounded-xl border border-[#1a273b] bg-[#0c121e] p-5 space-y-1">
            <span className="text-xs font-mono text-[#64748b]">FAILED</span>
            <div className="text-2xl font-bold font-mono text-white">{testSummary.failed}</div>
          </div>
        </div>
      )}

      {/* Test Results Table */}
      <div className="rounded-xl border border-[#1a273b] bg-[#0c121e] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#162335]">
          <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
            Test Execution Ledger
          </h3>
          <span className="text-xs font-mono text-[#64748b]">
            {testSummary ? `${testSummary.passed} of ${testSummary.total} PASSED` : 'CLICK EXECUTE TO RUN'}
          </span>
        </div>

        {!testSummary ? (
          <div className="text-center py-12 text-xs font-mono text-[#64748b] space-y-3">
            <Terminal className="h-8 w-8 text-[#334155] mx-auto" />
            <div>Click &quot;Execute Security Tests&quot; above to run the 22 automated assertions.</div>
          </div>
        ) : (
          <div className="space-y-2">
            {testSummary.results.map((r, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg border border-[#141e2e] bg-[#080d16] text-xs font-mono"
              >
                <div className="flex items-center space-x-3">
                  {r.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-[#00f0a8] shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-[#ff4757] shrink-0" />
                  )}
                  <div>
                    <span className="text-[#64748b] mr-2">[{r.suite}]</span>
                    <span className="text-white font-medium">{r.name}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.passed ? 'bg-[#00f0a8]/15 text-[#00f0a8]' : 'bg-[#ff4757]/15 text-[#ff4757]'
                    }`}
                  >
                    {r.passed ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
