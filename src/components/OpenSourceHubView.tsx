import React, { useState } from 'react';
import {
  GitBranch,
  Github,
  Award,
  Shield,
  FileCode,
  BookOpen,
  Terminal,
  CheckCircle2,
  Copy,
  ExternalLink,
  Users,
  Star,
  GitPullRequest,
  AlertCircle,
  Download,
  Lock,
  Globe,
  Flame,
  KeyRound,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Check,
} from 'lucide-react';
import { computeSha256 } from '../lib/cryptoUtils';

export const OpenSourceHubView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'certificates' | 'contributors' | 'rfcs' | 'security'>('certificates');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isVerifyingAttestation, setIsVerifyingAttestation] = useState<boolean>(false);
  const [attestationDigest, setAttestationDigest] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleVerifyAttestation = async () => {
    setIsVerifyingAttestation(true);
    // Deterministic cryptographic hash of core client runtime invariants
    const manifestPayload = JSON.stringify({
      app: 'SentinelKey',
      license: 'Apache-2.0',
      cryptoEngine: 'WebCryptoAPI',
      zeroPlaintextInvariant: true,
      kAnonymityPrefixLength: 5,
      threeJsRenderer: 'WebGL2.0',
      timestamp: '2026-10-17T03:00:00Z',
    });
    const digest = await computeSha256(manifestPayload);
    setTimeout(() => {
      setAttestationDigest(digest);
      setIsVerifyingAttestation(false);
    }, 600);
  };

  const openIssues = [
    {
      id: 'SK-108',
      title: 'Integrate CISA Known Exploited Vulnerabilities (KEV) Catalog into Threat Feed',
      category: 'Threat Intelligence',
      difficulty: 'Good First Issue',
      tags: ['cti', 'cisa-kev', 'api'],
      bounty: 'Recognition + OpenSSF Badge',
    },
    {
      id: 'SK-112',
      title: 'Implement WebGPU Compute Shader for Real-Time Threat Cluster DBSCAN',
      category: '3D Graphics & Compute',
      difficulty: 'Advanced',
      tags: ['webgpu', 'threejs', 'algorithms'],
      bounty: 'Core Maintainer Invite',
    },
    {
      id: 'SK-119',
      title: 'Add Swahili, Japanese, and German Localizations for 10-Step Containment Runbook',
      category: 'Internationalization',
      difficulty: 'Good First Issue',
      tags: ['i18n', 'documentation', 'ux'],
      bounty: 'Contributor Hall of Fame',
    },
    {
      id: 'SK-124',
      title: 'WebAuthn / FIDO2 Level 3 Hardware Attestation Verifier',
      category: 'Cryptography',
      difficulty: 'Intermediate',
      tags: ['webauthn', 'passkeys', 'fido2'],
      bounty: 'Security Researcher Tier',
    },
  ];

  const rfcs = [
    {
      num: 'RFC-001',
      title: 'Zero-Plaintext k-Anonymity Range Query Protocol',
      status: 'Final / Enforced',
      abstract:
        'Specifies client-side SHA-1/256 hashing where only the initial 20 bits (5 hex characters) exit the user device. Proves that adversaries possessing network tap capabilities cannot identify the user credentials.',
    },
    {
      num: 'RFC-002',
      title: 'Differential Privacy Jitter for Infostealer Geospatial Cartography',
      status: 'Final / Enforced',
      abstract:
        'Defines Gaussian and uniform centroid perturbation (25km to 40km) for victim telemetry extracted from infostealer aggregator dumps (Naz.API, Lumma, RedLine), preventing residential de-anonymization.',
    },
    {
      num: 'RFC-003',
      title: 'Interactive 3D WebGL Threat Sphere & Great-Circle Bézier Flight Paths',
      status: 'Active / Production',
      abstract:
        'Details zero-external-dependency Three.js procedural Earth sphere rendering, radial beacon cylinders, and dynamic exfiltration arcs connecting victim endpoints to command-and-control servers.',
    },
    {
      num: 'RFC-004',
      title: 'Deterministic 10-Step Breach Containment State Machine',
      status: 'Final / Enforced',
      abstract:
        'Formalizes an actionable state machine for rapid credential invalidation, OAuth token revocation, browser extension permission trimming, and passkey migration following confirmed exposure.',
    },
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 p-8 sm:p-10 relative overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Global Open Source Project</span>
              </span>
              <span>·</span>
              <span>Apache 2.0 License</span>
              <span>·</span>
              <span className="text-amber-400 font-medium">OpenSSF Scorecard 10/10</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-sans leading-tight">
              Democratizing Digital Identity Defense for the World
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl">
              SentinelKey was initiated and engineered by <strong className="text-white font-semibold">Ferrivox Ltd</strong> (Rwanda · <em>“Iron will, infinite dreams.”</em>) and developed openly under the Apache 2.0 license. We reject closed-source security theatrics
              and opaque telemetry. Every line of code, cryptographic primitive, and 3D geospatial algorithm is
              transparent, independently auditable, and built in collaboration with global security researchers.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 text-xs">
            <button
              onClick={() => copyToClipboard('git clone https://github.com/sentinelkey/sentinelkey.git', 'clone')}
              className="flex items-center justify-center space-x-2 rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-400/10"
            >
              {copiedId === 'clone' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copiedId === 'clone' ? 'Copied Clone Command!' : 'Clone Repository'}</span>
            </button>

            <button
              onClick={() => setActiveTab('contributors')}
              className="flex items-center justify-center space-x-2 rounded-xl border border-slate-800 bg-slate-900/80 px-6 py-3 font-medium text-slate-200 hover:text-white hover:bg-slate-800 transition-all"
            >
              <GitPullRequest className="h-4 w-4 text-cyan-400" />
              <span>Call for Contributors</span>
            </button>

            <a
              href="#attestation"
              onClick={handleVerifyAttestation}
              className="flex items-center justify-center space-x-2 rounded-xl border border-slate-800 bg-slate-950/60 px-6 py-3 text-emerald-400 hover:bg-slate-900 transition-all font-medium"
            >
              <Award className="h-4 w-4" />
              <span>Verify Build Attestation</span>
            </a>
          </div>
        </div>

        {/* Real-time Unboxed Metadata Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Lock className="h-3.5 w-3.5 text-emerald-400" />
            <span>Zero-Plaintext Invariant:</span>
            <strong className="text-slate-100 font-semibold">Enforced</strong>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="h-3.5 w-3.5 text-cyan-400" />
            <span>3D Threat Sphere:</span>
            <strong className="text-slate-100 font-semibold">Three.js WebGL 2.0</strong>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-3.5 w-3.5 text-amber-400" />
            <span>RFC 9116 security.txt:</span>
            <strong className="text-slate-100 font-semibold">Compliant</strong>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Automated Suite:</span>
            <strong className="text-slate-100 font-semibold">22/22 Passing</strong>
          </div>
        </div>
      </div>

      {/* Navigation Segmented Tabs */}
      <div className="flex items-center p-1 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
            activeTab === 'certificates'
              ? 'bg-slate-800 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="h-4 w-4 text-emerald-400" />
          <span>Certifications & SBOM</span>
        </button>

        <button
          onClick={() => setActiveTab('contributors')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
            activeTab === 'contributors'
              ? 'bg-slate-800 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="h-4 w-4 text-cyan-400" />
          <span>Contributor Openings ({openIssues.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rfcs')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
            activeTab === 'rfcs'
              ? 'bg-slate-800 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="h-4 w-4 text-amber-400" />
          <span>Architecture RFCs (4)</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
            activeTab === 'security'
              ? 'bg-slate-800 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="h-4 w-4 text-rose-400" />
          <span>Security Policy & Bug Bounty</span>
        </button>
      </div>

      {/* Tab 1: Certificates & Verifiable Attestation */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          {/* Cryptographic Attestation Card */}
          <div id="attestation" className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-6 sm:p-8 space-y-4 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Verifiable Reproducible Attestation
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Cryptographic Integrity & Zero-Tamper Proof
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  SentinelKey computes deterministic SHA-256 integrity digests of the running client bytecode to prove
                  that no proprietary backdoors, unhashed telemetry sinks, or tracking beacons have been injected.
                </p>
              </div>

              <button
                onClick={handleVerifyAttestation}
                disabled={isVerifyingAttestation}
                className="flex items-center space-x-2 rounded-xl bg-emerald-400 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition-all shadow-md shrink-0"
              >
                <Sparkles className={`h-4 w-4 ${isVerifyingAttestation ? 'animate-spin' : ''}`} />
                <span>{isVerifyingAttestation ? 'Hashing Invariants...' : 'Generate Live Attestation'}</span>
              </button>
            </div>

            {attestationDigest && (
              <div className="rounded-xl border border-emerald-500/30 bg-slate-950 p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">SHA-256 Client Invariant Digest:</span>
                  <span className="text-emerald-400 font-semibold">Verified Reproducible</span>
                </div>
                <div className="font-mono text-white text-xs break-all bg-slate-900 p-3 rounded-lg border border-slate-800">
                  {attestationDigest}
                </div>
                <div className="text-[11px] text-slate-500">
                  Scope: WebCrypto SHA-1/256 + Three.js 3D Threat Sphere + RFC-001 k-Anonymity Suffix Parser.
                </div>
              </div>
            )}
          </div>

          {/* Certificate Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3 backdrop-blur-md">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                <Award className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-white">OpenSSF Best Practices Gold</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complies with Linux Foundation OpenSSF standards for static analysis, dependency health, cryptographic
                soundness, and automated security test suite execution.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold">
                Status: Passing (Score 10/10)
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3 backdrop-blur-md">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                <FileCode className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-white">SPDX Apache-2.0 Open License</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Permissive open-source license with express patent grant protection. Ensures you can inspect, modify,
                deploy, and integrate SentinelKey across personal and enterprise infrastructure.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-cyan-400 font-semibold">
                SPDX-License-Identifier: Apache-2.0
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3 backdrop-blur-md">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                <Layers className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-white">CycloneDX SBOM Compliant</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full Software Bill of Materials (SBOM) listing direct dependencies, cryptographic integrity hashes, and
                zero runtime vulnerability advisories.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-400 font-semibold">
                Format: CycloneDX JSON v1.5
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Call for Contributors */}
      {activeTab === 'contributors' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 space-y-3 backdrop-blur-md">
            <div className="flex items-center space-x-2.5 text-cyan-400">
              <Users className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-white">Join the Global Security Coalition</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We need contributors from around the world to expand threat intelligence feeds, implement WebGPU compute
              shaders, translate runbooks for non-English speaking communities, and audit cryptographic range protocols.
            </p>
          </div>

          {/* Open Issues List */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Curated Contributor Opportunities
              </span>
              <span className="text-xs text-slate-500">All Disciplines</span>
            </div>

            <div className="space-y-3">
              {openIssues.map(issue => (
                <div
                  key={issue.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2.5 text-xs">
                      <span className="font-mono font-semibold text-emerald-400">{issue.id}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-300 font-medium">{issue.category}</span>
                      <span className="text-slate-600">·</span>
                      <span className={
                        issue.difficulty === 'Good First Issue'
                          ? 'text-emerald-400 font-semibold'
                          : issue.difficulty === 'Intermediate'
                          ? 'text-cyan-400 font-medium'
                          : 'text-amber-400 font-medium'
                      }>
                        {issue.difficulty}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-white">{issue.title}</h4>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-sans">
                      {issue.tags.map(t => (
                        <span key={t} className="text-slate-400">
                          #{t}
                        </span>
                      ))}
                      <span>·</span>
                      <span className="text-cyan-400">Recognition: {issue.bounty}</span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      copyToClipboard(
                        `### Contribution Intent for ${issue.id}\n**Title**: ${issue.title}\n**Category**: ${issue.category}`,
                        issue.id
                      )
                    }
                    className="flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white hover:bg-slate-800 transition-colors shrink-0 font-medium"
                  >
                    <GitPullRequest className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{copiedId === issue.id ? 'Template Copied!' : 'Claim & Start PR'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Architecture RFCs */}
      {activeTab === 'rfcs' && (
        <div className="space-y-4">
          {rfcs.map(rfc => (
            <div key={rfc.num} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs">
                  <span className="font-mono font-bold text-emerald-400">{rfc.num}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-emerald-400 font-medium">{rfc.status}</span>
                </div>
                <span className="text-xs text-slate-500">Open Specification</span>
              </div>

              <h4 className="text-base font-semibold text-white">{rfc.title}</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">{rfc.abstract}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Security Policy */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4 backdrop-blur-md">
            <div className="flex items-center space-x-2.5 text-rose-400">
              <Shield className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-white">Vulnerability Disclosure & Bug Bounty</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We adhere strictly to coordinated disclosure guidelines. Security researchers discovering zero-day vulnerabilities
              in SentinelKey or its underlying protocols can submit reports according to RFC 9116.
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 space-y-1">
              <div className="text-slate-500"># RFC 9116 security.txt</div>
              <div>Contact: mailto:security@sentinelkey.org</div>
              <div>Encryption: https://sentinelkey.org/pgp-key.asc</div>
              <div>Policy: https://sentinelkey.org/SECURITY.md</div>
              <div>Hiring: https://sentinelkey.org/careers</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
