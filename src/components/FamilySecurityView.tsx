import React, { useState } from 'react';
import {
  Users,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lock,
  UserPlus,
  HeartHandshake,
  Info,
} from 'lucide-react';
import { FamilyMember } from '../types';

interface FamilySecurityViewProps {
  members: FamilyMember[];
}

export const FamilySecurityView: React.FC<FamilySecurityViewProps> = ({ members }) => {
  const [memberList, setMemberList] = useState<FamilyMember[]>(members);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [inviteEmail, setInviteEmail] = useState<string>('');

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember: FamilyMember = {
      id: `fam_${Date.now()}`,
      name: inviteEmail.split('@')[0] || 'User',
      displayName: inviteEmail.split('@')[0] || 'User',
      emailMasked: `${inviteEmail[0] || 'u'}***@${inviteEmail.split('@')[1] || 'domain.com'}`,
      email: inviteEmail,
      relation: 'Family Member',
      postureScore: 82,
      postureGrade: 'B+',
      grade: 'B+',
      devicesCount: 1,
      activeAlertsCount: 0,
      passkeyAdopted: true,
      lastUpdated: new Date().toISOString(),
      lastSync: new Date().toISOString(),
    };

    setMemberList(prev => [...prev, newMember]);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#162335]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-[#00f0a8]" />
            <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
              Family Shield Defense
            </h1>
          </div>
          <p className="text-xs text-[#94a3b8]">
            Zero-knowledge collective defense for up to 6 family members. Monitor risk posture without infringing on personal privacy.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center space-x-1.5 rounded-lg bg-[#00f0a8] px-4 py-2 font-mono text-xs font-bold text-[#05080e] hover:bg-[#00f0a8]/90 transition-colors shadow-md"
        >
          <UserPlus className="h-4 w-4" />
          <span>Invite Family Member</span>
        </button>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="rounded-xl border border-[#00f0a8]/30 bg-[#00f0a8]/5 p-4 flex items-start space-x-3 text-xs">
        <Info className="h-5 w-5 text-[#00f0a8] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-mono font-bold text-[#e2e8f0]">Family Privacy Invariant:</span>
          <p className="text-[#94a3b8] leading-relaxed">
            Family Shield shares only aggregate posture grades and active compromise status. Parents and family administrators can NEVER view browsing histories, saved account names, or passwords of family members.
          </p>
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memberList.map(m => (
          <div
            key={m.id}
            className="rounded-xl border border-[#1b283d] bg-[#0c121e] p-5 space-y-4 transition-all hover:border-[#2a3e5c]"
          >
            <div className="flex items-start justify-between pb-3 border-b border-[#162233]">
              <div>
                <h3 className="font-mono font-bold text-white text-sm">{m.displayName || m.name}</h3>
                <p className="text-xs text-[#64748b]">{m.relation} • {m.email || m.emailMasked}</p>
              </div>

              <div className="text-right font-mono">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  (m.grade || m.postureGrade || 'B').startsWith('A')
                    ? 'bg-[#00f0a8]/20 text-[#00f0a8]'
                    : (m.grade || m.postureGrade || 'B').startsWith('B')
                    ? 'bg-[#38bdf8]/20 text-[#38bdf8]'
                    : 'bg-[#ffa502]/20 text-[#ffa502]'
                }`}>
                  GRADE {m.grade || m.postureGrade || 'B'}
                </span>
                <div className="text-[10px] text-[#64748b] mt-0.5">{m.postureScore}/100</div>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[#94a3b8]">
                <span>Active Risk Alerts:</span>
                <span className={`font-bold ${m.activeAlertsCount > 0 ? 'text-[#ff4757]' : 'text-[#00f0a8]'}`}>
                  {m.activeAlertsCount} Alerts
                </span>
              </div>
              <div className="flex justify-between text-[#94a3b8]">
                <span>Hardware Passkeys:</span>
                <span className="text-[#00f0a8] font-bold">
                  {m.passkeyAdopted ? 'Active (FaceID / Enclave)' : 'Password Only'}
                </span>
              </div>
              <div className="flex justify-between text-[#94a3b8]">
                <span>Last Posture Audit:</span>
                <span className="text-[#64748b]">{m.lastSync || m.lastUpdated || 'Recently'}</span>
              </div>
            </div>

            <div className="pt-2">
              {m.activeAlertsCount > 0 ? (
                <button className="w-full flex items-center justify-center space-x-1.5 rounded-lg bg-[#ff4757]/15 border border-[#ff4757]/40 py-2 font-mono text-xs font-bold text-[#ff4757] hover:bg-[#ff4757]/25">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Assist In Containment</span>
                </button>
              ) : (
                <div className="flex items-center justify-center space-x-1 text-xs text-[#00f0a8] font-mono py-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Perimeter Secure</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-[#22354c] bg-[#0c121e] p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#162233]">
              <h3 className="font-mono font-bold text-white text-base">Invite Family Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-[#64748b] hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4 text-xs font-mono">
              <p className="text-[#94a3b8]">
                An invitation link with end-to-end posture telemetry initialization will be sent.
              </p>
              <div>
                <label className="block text-[#cbd5e1] mb-1">Family Member Email:</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="e.g. spouse@domain.com or child@domain.com"
                  className="w-full rounded-lg border border-[#1e2a3c] bg-[#070b13] p-2.5 text-white placeholder-[#64748b] focus:border-[#00f0a8] focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-lg border border-[#1b283d] px-3 py-2 text-[#94a3b8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#00f0a8] px-4 py-2 font-bold text-[#05080e] hover:bg-[#00f0a8]/90"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
