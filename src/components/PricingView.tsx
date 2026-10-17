import React, { useState } from 'react';
import { CheckCircle2, Shield, Lock, ArrowRight, Zap, HelpCircle } from 'lucide-react';
import { PLAN_PRICING } from '../lib/mockSecurityData';

export const PricingView: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const comparisonFeatures = [
    { name: 'Zero-Plaintext Invariant (Never upload passwords)', free: true, pro: true, fam: true, ent: true },
    { name: 'Local Cryptographic Hashing (SHA-1/256)', free: true, pro: true, fam: true, ent: true },
    { name: 'k-Anonymity Breach Range Checks', free: '1 ID', pro: 'Unlimited', fam: 'Up to 6 Users', ent: 'Unlimited Domain' },
    { name: '"SECURE MY ACCOUNTS" 10-Step Containment', free: true, pro: true, fam: true, ent: true },
    { name: 'AI Security Analyst "Sentinel" (Gemini Grounded)', free: 'Basic', pro: 'Continuous', fam: 'Continuous', ent: 'Priority Dedicated' },
    { name: 'Browser Extension Risk & Sandbox Auditor', free: true, pro: true, fam: true, ent: true },
    { name: 'Developer Secret Scanner (In-Memory Regex)', free: false, pro: true, fam: false, ent: true },
    { name: 'Zero-Knowledge Family Status Sharing', free: false, pro: false, fam: true, ent: false },
    { name: '5-Role RBAC & Device Posture Fleet', free: false, pro: false, fam: false, ent: true },
    { name: 'Immutable SOC 2 / ISO Compliance Audit Export', free: false, pro: false, fam: false, ent: true },
  ];

  return (
    <div className="space-y-12 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full border border-[#00f0a8]/30 bg-[#00f0a8]/10 px-3 py-1 font-mono text-xs text-[#00f0a8]">
          <Shield className="h-3.5 w-3.5" />
          <span>TRANSPARENT DEFENSIVE TIERS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
          Cryptographic Protection For Everyone
        </h1>
        <p className="text-sm text-[#94a3b8]">
          No hidden locks on core privacy. Mathematical zero-plaintext security is included across all plans.
        </p>

        {/* Toggle */}
        <div className="inline-flex items-center rounded-lg border border-[#1b283d] bg-[#0c1422] p-1 text-xs font-mono">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`rounded px-3 py-1 transition-colors ${
              billingCycle === 'monthly' ? 'bg-[#1e2d42] text-white font-bold' : 'text-[#94a3b8]'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`rounded px-3 py-1 transition-colors ${
              billingCycle === 'annual' ? 'bg-[#00f0a8] text-[#05080e] font-bold' : 'text-[#94a3b8]'
            }`}
          >
            Annual Billing (Save 20%)
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLAN_PRICING.map(plan => {
          const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              className={`rounded-xl border p-6 flex flex-col justify-between space-y-6 ${
                plan.badge
                  ? 'border-[#00f0a8]/50 bg-[#0c1626] shadow-xl shadow-[#00f0a8]/5'
                  : 'border-[#182538] bg-[#0a101b]'
              }`}
            >
              <div className="space-y-4">
                {plan.badge && (
                  <span className="inline-block rounded bg-[#00f0a8]/15 px-2 py-0.5 text-[10px] font-mono font-bold text-[#00f0a8] border border-[#00f0a8]/30">
                    {plan.badge}
                  </span>
                )}
                <h3 className="text-lg font-bold text-white font-mono">{plan.name}</h3>
                <p className="text-xs text-[#94a3b8] min-h-[36px]">{plan.description}</p>
                <div className="pt-2">
                  <span className="font-mono text-3xl font-extrabold text-white">${price}</span>
                  <span className="text-xs text-[#64748b]"> / user / mo</span>
                </div>

                <ul className="space-y-2 pt-4 border-t border-[#162335] text-xs text-[#cbd5e1]">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#00f0a8] mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => alert(`Selected plan: ${plan.name}. Ready for zero-plaintext deployment.`)}
                className={`w-full py-2.5 rounded-lg font-mono text-xs font-bold transition-all ${
                  plan.badge
                    ? 'bg-[#00f0a8] text-[#06090f] hover:bg-[#00f0a8]/90'
                    : 'bg-[#152236] text-[#e2e8f0] hover:bg-[#1e304b] border border-[#233550]'
                }`}
              >
                Choose {plan.name.split(' ')[0]}
              </button>
            </div>
          );
        })}
      </div>

      {/* Detailed Capability Comparison Table */}
      <div className="rounded-xl border border-[#1a273b] bg-[#0c121e] p-6 space-y-6">
        <h3 className="font-mono text-base font-bold text-white uppercase tracking-wider">
          Full Capability & Defense Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#162335] text-[#64748b]">
                <th className="pb-3 font-normal">CAPABILITY</th>
                <th className="pb-3 font-normal text-center">FREE</th>
                <th className="pb-3 font-normal text-center">PRO</th>
                <th className="pb-3 font-normal text-center">FAMILY</th>
                <th className="pb-3 font-normal text-center">BUSINESS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#131d2c]">
              {comparisonFeatures.map((row, idx) => (
                <tr key={idx} className="text-[#cbd5e1] hover:bg-[#0e1522]">
                  <td className="py-3 font-sans font-medium text-white">{row.name}</td>
                  <td className="py-3 text-center">
                    {typeof row.free === 'boolean' ? (
                      row.free ? <CheckCircle2 className="h-4 w-4 text-[#00f0a8] mx-auto" /> : <span className="text-[#64748b]">—</span>
                    ) : (
                      <span className="text-white">{row.free}</span>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {typeof row.pro === 'boolean' ? (
                      row.pro ? <CheckCircle2 className="h-4 w-4 text-[#00f0a8] mx-auto" /> : <span className="text-[#64748b]">—</span>
                    ) : (
                      <span className="text-white">{row.pro}</span>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {typeof row.fam === 'boolean' ? (
                      row.fam ? <CheckCircle2 className="h-4 w-4 text-[#00f0a8] mx-auto" /> : <span className="text-[#64748b]">—</span>
                    ) : (
                      <span className="text-white">{row.fam}</span>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {typeof row.ent === 'boolean' ? (
                      row.ent ? <CheckCircle2 className="h-4 w-4 text-[#00f0a8] mx-auto" /> : <span className="text-[#64748b]">—</span>
                    ) : (
                      <span className="text-white">{row.ent}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
