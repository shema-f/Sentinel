/**
 * SentinelKey - Grounded Security Data & Baseline Evidence
 * Clearly labeled demo & baseline threat telemetry for defensive posture analysis.
 */

import {
  SecurityPosture,
  RiskFinding,
  BrowserAuditProfile,
  DeviceRecord,
  IncidentStep,
  SecurityEvent,
  IdentityNode,
  IdentityEdge,
  FamilyMember,
  OrganizationPolicy,
  AuditLogEntry,
  PlanFeature,
  User,
  BrowserProfile,
  BrowserExtension,
  MonitoredIdentity,
  SecurityPolicy,
  SecurityNode,
  SecurityEdge,
} from '../types';

export const INITIAL_USER: User = {
  id: 'usr_sentinel_0981a',
  email: 'alex.vance@sentinelkey-demo.com',
  displayName: 'Alex Vance',
  role: 'security_admin',
  plan: 'pro',
  organizationName: 'Vance Cyber Defense Lab',
  isMfaEnabled: true,
  mfaType: 'webauthn_passkey',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  createdAt: '2025-11-14T08:30:00Z',
};

export const INITIAL_POSTURE: SecurityPosture = {
  overallScore: 74,
  grade: 'B',
  identityRisk: 'MODERATE',
  browserSecurity: 'STRONG',
  deviceSecurity: 'HARDENED',
  accountExposure: 'ELEVATED',
  breachExposure: 'POSSIBLE',
  authStrength: 'STRONG',
  mfaPasskeyAdoption: 82,
  lastAuditTimestamp: '2026-09-21T05:10:00Z',
  scoreEvidence: [
    {
      factor: 'Hardware FIDO2 Passkey on Workstation',
      impact: '+20 pts',
      status: 'PASS',
      description: 'YubiKey 5C NFC and Apple Touch ID configured for primary identity provider login.',
    },
    {
      factor: 'DNS-over-HTTPS (DoH) Enabled',
      impact: '+10 pts',
      status: 'PASS',
      description: 'Encrypted DNS queries using Cloudflare 1.1.1.1 preventing ISP/local eavesdropping.',
    },
    {
      factor: 'Recent Third-Party Aggregator Breach Indicator',
      impact: '-18 pts',
      status: 'FAIL',
      description: 'Secondary email found in Naz.API data dump (hashes and email pair exposed).',
    },
    {
      factor: 'Unpinned Browser Extension Permissions',
      impact: '-12 pts',
      status: 'WARN',
      description: '1 installed browser extension holds broad <all_urls> permission without domain pinning.',
    },
    {
      factor: 'Disk Encryption & Hardware TPM Active',
      impact: '+14 pts',
      status: 'PASS',
      description: 'BitLocker / FileVault with TPM 2.0 active on primary laptop endpoint.',
    },
  ],
};

export const INITIAL_RISK_FINDINGS: RiskFinding[] = [
  {
    id: 'rf_stealer_01',
    title: 'Credential Exposure in Aggregator Dump (Naz.API / StealerLogs)',
    severity: 'HIGH',
    affectedAsset: 'Personal Account (alex.vance@gmail.com)',
    evidence: {
      source: 'Naz.API Aggregated Breach Index',
      exposedDate: '2024-01-16',
      dataClasses: ['email', 'password_hash', 'ip_address'],
      hashPrefix: '7C4A8',
      matchType: 'k-Anonymity Verified Match',
    },
    explanation: 'Your email address and a corresponding password hash were identified in an aggregated stealer intelligence dataset compiled from malware logs. If you reused this password on any current service, attackers could automate credential stuffing.',
    recommendedAction: 'Rotate passwords on services sharing this email. Ensure 2FA or passkeys are enabled on your Google account.',
    remediationStatus: 'open',
    timestamp: '2026-09-18T14:22:00Z',
  },
  {
    id: 'rf_ext_broad_perms',
    title: 'Over-Privileged Browser Extension Detected',
    severity: 'MEDIUM',
    affectedAsset: 'Chromium Browser (Chrome v128.0)',
    evidence: {
      extensionName: 'Quick PDF Highlighter & Converter',
      extensionId: 'kbmflbckdnpocmbeoohkockgjjndnbdp',
      permissions: ['<all_urls>', 'webRequest', 'storage'],
      storeUrl: 'chrome.google.com/webstore',
    },
    explanation: 'The extension has authorization to read and modify data on all websites you visit (<all_urls>). If the extension developer is compromised or sells the extension to an untrusted entity, malicious code could capture sensitive form inputs.',
    recommendedAction: 'Limit extension site access to "On Click" only via chrome://extensions, or uninstall if no longer required.',
    remediationStatus: 'open',
    timestamp: '2026-09-19T09:15:00Z',
  },
  {
    id: 'rf_stale_session_github',
    title: 'Dormant Active Session on Unknown Subnet',
    severity: 'LOW',
    affectedAsset: 'GitHub Identity (alexvance-dev)',
    evidence: {
      lastActive: '38 days ago',
      ipLocation: 'Frankfurt, DE (AS24940)',
      clientType: 'CLI / Git Credential Manager',
      tokenType: 'OAuth App Grant',
    },
    explanation: 'An authorized GitHub OAuth credential has remained dormant for over 30 days on a cloud hosting provider IP range. Stale tokens expand your attack surface if left unrevoked.',
    recommendedAction: 'Review and revoke unused Personal Access Tokens and OAuth authorisations in GitHub Account Settings.',
    remediationStatus: 'in_progress',
    timestamp: '2026-09-20T11:40:00Z',
  },
  {
    id: 'rf_local_env_unencrypted',
    title: 'Unrestricted Developer Environment File on Disk',
    severity: 'MEDIUM',
    affectedAsset: 'Local Machine (~/projects/api-gateway/.env)',
    evidence: {
      fileMode: '0644 (World-Readable)',
      variablesCount: 14,
      sensitiveKeysFound: ['DATABASE_URL', 'STRIPE_WEBHOOK_SECRET'],
    },
    explanation: 'A local configuration file containing database connection strings has world-readable permissions, permitting other local user accounts or unprivileged processes to read secrets.',
    recommendedAction: 'Execute "chmod 600 ~/projects/api-gateway/.env" to restrict read permissions strictly to your OS user account.',
    remediationStatus: 'resolved',
    timestamp: '2026-09-15T18:00:00Z',
    resolvedAt: '2026-09-16T10:12:00Z',
  },
];

export const INITIAL_BROWSER_PROFILE: BrowserAuditProfile = {
  browserName: 'Chrome',
  version: '128.0.6613.120',
  engine: 'Blink / V8',
  dohEnabled: true,
  hstsPreload: true,
  cookiePartitioning: true,
  sandboxLevel: 'strict',
  score: 88,
  localLimitationNote: 'Due to browser OS-level sandboxing, SentinelKey cannot and will not inspect internal encrypted password vaults (Login Data SQLite). This is by design to preserve your browser integrity. We audit public configuration headers, flags, and extension privileges.',
  extensions: [
    {
      id: 'ext_1',
      name: 'SentinelKey Defensive Shield (Local Extension)',
      version: '1.4.2',
      permissions: ['storage', 'alarms'],
      riskLevel: 'LOW',
      warningNote: 'Safe: Operates strictly locally with zero external network exfiltration permissions.',
    },
    {
      id: 'ext_2',
      name: 'Quick PDF Highlighter & Converter',
      version: '3.1.0',
      permissions: ['<all_urls>', 'webRequest', 'storage'],
      riskLevel: 'HIGH',
      warningNote: 'Warning: Broad permissions allow inspecting DOM on banking and cloud consoles.',
    },
    {
      id: 'ext_3',
      name: 'uBlock Origin Defensive Filter',
      version: '1.58.0',
      permissions: ['webRequestBlocking', 'storage', 'tabs'],
      riskLevel: 'LOW',
      warningNote: 'Audited open-source content blocker maintaining tracker isolation.',
    },
    {
      id: 'ext_4',
      name: 'ColorPicker Developer Tool',
      version: '2.0.4',
      permissions: ['activeTab'],
      riskLevel: 'LOW',
      warningNote: 'Strictly limited to active tab on direct click.',
    },
  ],
};

export const INITIAL_DEVICES: DeviceRecord[] = [
  {
    id: 'dev_primary_mbp',
    name: 'MacBook Pro 16" (M3 Max)',
    type: 'laptop',
    os: 'macOS Sonoma',
    osVersion: '14.6.1',
    tpmStatus: 'verified_hardware',
    diskEncryption: true,
    firewallActive: true,
    agentVersion: 'v0.9.4-rust',
    lastCheckIn: '2 minutes ago',
    isCurrentDevice: true,
    isTrusted: true,
  },
  {
    id: 'dev_workstation_win',
    name: 'Lab Workstation (Precision 5820)',
    type: 'desktop',
    os: 'Windows 11 Enterprise',
    osVersion: '23H2 (Build 22631)',
    tpmStatus: 'verified_hardware',
    diskEncryption: true,
    firewallActive: true,
    agentVersion: 'v0.9.4-rust',
    lastCheckIn: '4 hours ago',
    isCurrentDevice: false,
    isTrusted: true,
  },
  {
    id: 'dev_mobile_iphone',
    name: 'iPhone 15 Pro',
    type: 'mobile',
    os: 'iOS',
    osVersion: '17.6.1',
    tpmStatus: 'verified_hardware',
    diskEncryption: true,
    firewallActive: true,
    agentVersion: 'v0.9.1-mobile',
    lastCheckIn: '25 minutes ago',
    isCurrentDevice: false,
    isTrusted: true,
  },
];

export const INITIAL_INCIDENT_STEPS: IncidentStep[] = [
  {
    stepNumber: 1,
    title: 'Disconnect & Contain the Affected Device',
    summary: 'Immediately sever network access on the suspect machine.',
    instruction: 'Disconnect Wi-Fi, unplug Ethernet cables, or toggle Airplane Mode on the suspect computer. This prevents active command-and-control (C2) exfiltration of newly typed credentials or tokens.',
    technicalDetails: [
      'Disables reverse shells and beaconing infostealers.',
      'Do not turn off the machine if you intend to preserve RAM memory forensics for a corporate investigation, but isolate the network adapter immediately.',
    ],
    actionLinkText: 'View Network Isolation Guide',
    isCompleted: true,
    completedAt: '2026-09-21T04:45:00Z',
    notes: 'Wi-Fi disabled on suspect workstation; switched to verified MacBook Pro.',
  },
  {
    stepNumber: 2,
    title: 'Transition to a Verified Trusted Device',
    summary: 'Perform all remediation actions from an uncontaminated endpoint.',
    instruction: 'Switch to a known-clean computer, tablet, or smartphone (such as an up-to-date iPhone, Android, or secondary laptop) that was not exposed to the suspect download or suspicious link.',
    technicalDetails: [
      'Keyloggers and browser memory hooks on the compromised device will capture any new passwords you type if you attempt recovery on the same device.',
    ],
    isCompleted: true,
    completedAt: '2026-09-21T04:48:00Z',
    notes: 'Operating from MacBook Pro with hardware Secure Enclave.',
  },
  {
    stepNumber: 3,
    title: 'Secure Your Primary Email Account',
    summary: 'Protect your digital identity ground zero.',
    instruction: 'Log into your primary email provider (e.g., Google Workspace, Outlook, Proton) from your clean device. Change the master password and verify there are no unauthorized forwarding rules or POP/IMAP delegates.',
    technicalDetails: [
      'Adversaries use compromised inboxes to trigger password reset links across your entire digital footprint.',
      'Check Gmail Settings -> "Forwarding and POP/IMAP" -> ensure "Forward a copy of incoming mail" is disabled.',
    ],
    actionLinkText: 'Open Google Account Security',
    actionUrl: 'https://myaccount.google.com/security',
    isCompleted: true,
    completedAt: '2026-09-21T04:52:00Z',
    notes: 'Primary Gmail password rotated; 0 forwarding filters detected.',
  },
  {
    stepNumber: 4,
    title: 'Terminate All Active Web & App Sessions',
    summary: 'Invalidate stolen session cookies and refresh tokens.',
    instruction: 'Navigate to security settings for Google, Microsoft, Apple, GitHub, and social platforms, and click "Sign out of all other sessions" or "Revoke all web sessions".',
    technicalDetails: [
      'Modern infostealers steal decrypted cookies rather than passwords. Terminating active sessions invalidates session IDs stored in stolen cookie jars.',
    ],
    isCompleted: false,
  },
  {
    stepNumber: 5,
    title: 'Rotate High-Value Passwords',
    summary: 'Prioritize financial, cloud infrastructure, and password managers.',
    instruction: 'Update passwords for: 1) Banking & Financial accounts, 2) Cloud providers (AWS, GCP, Azure), 3) Identity providers & Password managers. Use generated 20+ character passphrases.',
    technicalDetails: [
      'Ensure zero password reuse across services.',
      'Never store new passwords in unencrypted browser auto-fill on the suspect machine.',
    ],
    isCompleted: false,
  },
  {
    stepNumber: 6,
    title: 'Revoke Exposed API Keys & Personal Access Tokens',
    summary: 'Neutralize developer credentials and machine tokens.',
    instruction: 'If you are a developer or administrator, rotate GitHub PATs, AWS Access Keys, Stripe Secret Keys, and SSH authorized keys.',
    technicalDetails: [
      'Infostealers scan ~/.aws/credentials, ~/.ssh/id_rsa, and git repos for tokens.',
      'Check AWS CloudTrail and GitHub audit logs for anomalous clones.',
    ],
    isCompleted: false,
  },
  {
    stepNumber: 7,
    title: 'Enforce FIDO2 Hardware Passkeys or Strong 2FA',
    summary: 'Upgrade authentication to phishing-resistant standards.',
    instruction: 'Replace SMS 2FA with hardware security keys (FIDO2 / WebAuthn, Touch ID, YubiKey) or time-based OTP authenticator apps.',
    technicalDetails: [
      'SMS verification is vulnerable to SIM-swapping and AiTM phishing proxies (Evilginx). Hardware passkeys cannot be phished or intercepted.',
    ],
    isCompleted: false,
  },
  {
    stepNumber: 8,
    title: 'Review Account Recovery Methods',
    summary: 'Verify fallback phone numbers and backup email addresses.',
    instruction: 'Inspect each high-value account to ensure the recovery email and phone number belong to you and have not been modified by an adversary.',
    technicalDetails: [
      'Attacker persistence frequently relies on adding secondary backup emails (e.g., attacker-owned burner domains).',
    ],
    isCompleted: false,
  },
  {
    stepNumber: 9,
    title: 'Audit Suspicious Account Activity & Grants',
    summary: 'Inspect OAuth third-party app permissions.',
    instruction: 'Review connected third-party applications authorized via "Sign in with Google" or "Sign in with Apple". Remove any unfamiliar apps.',
    technicalDetails: [
      'Malicious OAuth apps can maintain mailbox access via API even after password rotation unless specifically revoked.',
    ],
    isCompleted: false,
  },
  {
    stepNumber: 10,
    title: 'Generate Cryptographic Incident Report',
    summary: 'Produce a timestamped audit trail for insurance, work, or records.',
    instruction: 'Export a signed forensic incident report detailing containment timeline, affected assets, rotated credentials, and residual risk assessment.',
    technicalDetails: [
      'Formatted with SHA-256 integrity hash for insurance claims, corporate compliance, or legal disclosure requirements.',
    ],
    isCompleted: false,
  },
];

export const INITIAL_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: 'evt_001',
    timestamp: '2026-09-21T04:45:00Z',
    eventType: 'recovery_action',
    severity: 'CRITICAL',
    title: 'Emergency Lockdown Workflow Initiated',
    description: 'User initiated "SECURE MY ACCOUNTS" protocol following suspected credential exposure.',
    asset: 'Account Perimeter',
    actor: 'alex.vance@sentinelkey-demo.com',
    eventHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    id: 'evt_002',
    timestamp: '2026-09-20T19:30:00Z',
    eventType: 'login',
    severity: 'INFO',
    title: 'Successful Hardware Passkey Login',
    description: 'WebAuthn FIDO2 authentication verified via Apple Touch ID on MacBook Pro 16".',
    asset: 'SentinelKey Console',
    actor: 'alex.vance@sentinelkey-demo.com',
    eventHash: '4a6b2c8f1e9d3a7c5b8e0f2a4c6e8d1b3f5a7c9e0d2b4f6a8c1e3d5b7a9c0e2f',
  },
  {
    id: 'evt_003',
    timestamp: '2026-09-20T11:40:00Z',
    eventType: 'security_alert',
    severity: 'MEDIUM',
    title: 'Dormant Session Flagged',
    description: 'GitHub OAuth session inactive for >30 days identified during automated posture check.',
    asset: 'GitHub Identity',
    actor: 'SentinelKey Posture Daemon',
    eventHash: '9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b',
  },
  {
    id: 'evt_004',
    timestamp: '2026-09-18T14:22:00Z',
    eventType: 'breach_detection',
    severity: 'HIGH',
    title: 'k-Anonymity Breach Indicator Match',
    description: 'Hash prefix 7C4A8 matched 14 leak records in Naz.API aggregator database.',
    asset: 'alex.vance@gmail.com',
    actor: 'Breach Intelligence Engine',
    eventHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
  },
  {
    id: 'evt_005',
    timestamp: '2026-09-16T10:12:00Z',
    eventType: 'recovery_action',
    severity: 'INFO',
    title: 'File Permissions Hardened',
    description: 'Local .env file permissions restricted to 0600 (owner read-write only).',
    asset: '~/projects/api-gateway/.env',
    actor: 'Alex Vance',
    eventHash: 'f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1',
  },
  {
    id: 'evt_006',
    timestamp: '2026-09-14T08:00:00Z',
    eventType: 'new_device',
    severity: 'INFO',
    title: 'New Endpoint Registered',
    description: 'MacBook Pro 16" enrolled with verified hardware Apple T2 / Secure Enclave.',
    asset: 'Device dev_primary_mbp',
    actor: 'SentinelKey Desktop Agent',
    eventHash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  },
];

export const INITIAL_IDENTITY_NODES: IdentityNode[] = [
  { id: 'usr_main', label: 'Alex Vance (Identity Root)', type: 'user', status: 'warning', details: 'Overall Posture: 74/100 (B)' },
  { id: 'node_mbp', label: 'MacBook Pro (M3 Max)', type: 'device', status: 'secure', details: 'TPM Hardware Enclave Active' },
  { id: 'node_win', label: 'Lab Workstation', type: 'device', status: 'secure', details: 'BitLocker Active' },
  { id: 'node_chrome', label: 'Google Chrome v128', type: 'browser', status: 'warning', details: '1 Over-privileged Extension' },
  { id: 'node_email_primary', label: 'alex.vance@gmail.com', type: 'email', status: 'critical', details: 'Breach Hash Match Detected' },
  { id: 'node_email_work', label: 'alex@sentinelkey-demo.com', type: 'email', status: 'secure', details: 'FIDO2 Enforced' },
  { id: 'node_github', label: 'GitHub (alexvance-dev)', type: 'developer', status: 'warning', details: 'Stale Token Active' },
  { id: 'node_aws', label: 'AWS Production IAM', type: 'cloud', status: 'secure', details: 'Hardware MFA Key Bound' },
  { id: 'node_chase', label: 'Chase Online Banking', type: 'financial', status: 'secure', details: 'Dedicated App Passkey' },
  { id: 'node_yubikey', label: 'YubiKey 5C NFC', type: 'auth', status: 'secure', details: 'FIDO2 / WebAuthn' },
];

export const INITIAL_IDENTITY_EDGES: IdentityEdge[] = [
  { source: 'usr_main', target: 'node_mbp', label: 'Primary Laptop' },
  { source: 'usr_main', target: 'node_win', label: 'Secondary Workstation' },
  { source: 'node_mbp', target: 'node_chrome', label: 'Hosts Browser' },
  { source: 'usr_main', target: 'node_email_primary', label: 'Personal Identity', isCompromised: true },
  { source: 'usr_main', target: 'node_email_work', label: 'Enterprise Identity' },
  { source: 'node_email_primary', target: 'node_github', label: 'Recovery Email' },
  { source: 'usr_main', target: 'node_github', label: 'Code Repository' },
  { source: 'usr_main', target: 'node_aws', label: 'Infrastructure Admin' },
  { source: 'usr_main', target: 'node_chase', label: 'Banking' },
  { source: 'usr_main', target: 'node_yubikey', label: 'Hardware Key' },
  { source: 'node_yubikey', target: 'node_aws', label: 'MFA Protection' },
  { source: 'node_yubikey', target: 'node_email_work', label: 'WebAuthn Token' },
];

export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'fam_1',
    name: 'Sarah Vance',
    relation: 'Spouse',
    emailMasked: 's***h@vancefamily.net',
    postureScore: 89,
    postureGrade: 'A',
    devicesCount: 2,
    activeAlertsCount: 0,
    lastUpdated: '1 hour ago',
  },
  {
    id: 'fam_2',
    name: 'Leo Vance',
    relation: 'Teen / Son',
    emailMasked: 'l***o@vancefamily.net',
    postureScore: 62,
    postureGrade: 'C',
    devicesCount: 2,
    activeAlertsCount: 2,
    lastUpdated: '15 minutes ago',
  },
  {
    id: 'fam_3',
    name: 'Martha Vance',
    relation: 'Parent',
    emailMasked: 'm***a@gmail.com',
    postureScore: 78,
    postureGrade: 'B',
    devicesCount: 1,
    activeAlertsCount: 1,
    lastUpdated: 'Yesterday',
  },
];

export const INITIAL_ORG_POLICY: OrganizationPolicy = {
  requireMfaForAll: true,
  minPasswordEntropy: 65,
  sessionTimeoutMinutes: 30,
  enforcePasskeysOnly: false,
  blockHighRiskExtensions: true,
  allowedIpRanges: ['198.51.100.0/24', '203.0.113.0/24'],
};

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log_01',
    timestamp: '2026-09-21T04:55:00Z',
    actorEmail: 'alex.vance@sentinelkey-demo.com',
    actorRole: 'security_admin',
    action: 'incident.step_completed',
    targetResource: 'Incident #INC-2026-0921',
    details: 'Completed Step 3: Secure Primary Email Account',
    status: 'SUCCESS',
  },
  {
    id: 'log_02',
    timestamp: '2026-09-20T16:20:00Z',
    actorEmail: 'system.daemon@sentinelkey-demo.com',
    actorRole: 'auditor',
    action: 'breach_intelligence.prefix_scan',
    targetResource: 'Identity Vault (k-Anonymity Range)',
    details: 'Queried 5-character prefix 7C4A8; 0 plaintext credentials processed.',
    status: 'SUCCESS',
  },
  {
    id: 'log_03',
    timestamp: '2026-09-19T11:05:00Z',
    actorEmail: 'auditor.compliance@vancecyber.com',
    actorRole: 'auditor',
    action: 'compliance.soc2_export',
    targetResource: 'Zero-Knowledge Security Telemetry',
    details: 'Exported cryptographic proof of passkey adoption and encryption-at-rest.',
    status: 'SUCCESS',
  },
];

export const PLAN_PRICING: {
  id: string;
  name: string;
  badge?: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  targetAudience: string;
  features: string[];
}[] = [
  {
    id: 'free',
    name: 'Free (Personal Defense)',
    priceMonthly: 0,
    priceAnnual: 0,
    description: 'Essential local identity protection and breach monitoring for individuals.',
    targetAudience: 'Single individuals wanting transparent security without telemetry spying.',
    features: [
      'Zero-Plaintext local credential auditing',
      'k-Anonymity breach alerts for 1 email',
      'Basic Browser Security Center checks',
      'Interactive "SECURE MY ACCOUNTS" checklist',
      'AI Security Analyst (10 queries/mo)',
      'Community security documentation',
    ],
  },
  {
    id: 'pro',
    name: 'Pro (Power User & Dev)',
    badge: 'MOST POPULAR',
    priceMonthly: 12,
    priceAnnual: 9,
    description: 'Advanced identity defense, secret scanning, and automated incident containment.',
    targetAudience: 'Engineers, privacy advocates, consultants, and security professionals.',
    features: [
      'Everything in Free plan',
      'Unlimited email & identifier breach monitoring',
      'Developer Security Mode (Local secret scanner)',
      'Real-time Browser Extension privilege auditing',
      'Unlimited AI Security Analyst "Sentinel"',
      'Interactive Identity Graph topology',
      'Exportable Forensic Incident Reports',
      'Multi-device posture synchronization (Encrypted)',
    ],
  },
  {
    id: 'family',
    name: 'Family Shield',
    badge: 'FAMILY SAFETY',
    priceMonthly: 19,
    priceAnnual: 15,
    description: 'Protect up to 6 family members while strictly respecting private credentials.',
    targetAudience: 'Families seeking coordinated defense without reading each other’s private data.',
    features: [
      'Everything in Pro plan for up to 6 members',
      'Separate, zero-knowledge encrypted vaults',
      'Privacy-preserving posture status sharing',
      'Elderly & teen recovery assistance portal',
      'Cross-device parental security alerts',
      'Priority family response triage',
    ],
  },
  {
    id: 'business',
    name: 'Business & Team',
    badge: 'ENTERPRISE READY',
    priceMonthly: 39,
    priceAnnual: 32,
    description: 'Workforce credential exposure defense, RBAC, compliance logs, and policy enforcement.',
    targetAudience: 'Startups, engineering teams, SMBs, and security-regulated organizations.',
    features: [
      'Everything in Pro with centralized billing',
      'Role-Based Access Control (5 distinct roles)',
      'Enterprise Device Inventory & TPM verification',
      'Immutable cryptographic audit logging',
      'Custom security policy enforcement (e.g., FIDO2-only)',
      'SOC 2 & ISO 27001 compliance exportable reports',
      'Dedicated security engineer support SLA',
    ],
  },
];

export const CURRENT_USER = INITIAL_USER;
export const INITIAL_FINDINGS = INITIAL_RISK_FINDINGS;

export const INITIAL_BROWSERS: BrowserProfile[] = [
  {
    ...INITIAL_BROWSER_PROFILE,
    id: 'brw_chrome_default',
    dohActive: true,
    dohProvider: 'Cloudflare 1.1.1.1 (Encrypted)',
    sandboxSecurityStatus: 'ACTIVE_HARDENED',
  },
];

export const INITIAL_EXTENSIONS: BrowserExtension[] = INITIAL_BROWSER_PROFILE.extensions.map(e => ({
  ...e,
  manifestVersion: e.id === 'ext_1' ? 2 : 3,
}));

export const INITIAL_MONITORED_IDENTITIES: MonitoredIdentity[] = [
  {
    queryIdentifier: 'alex.vance@gmail.com',
    hashPrefix: '7C4A8',
    exposureType: 'confirmed_exposure',
    breachCount: 14,
    breaches: [
      {
        source: 'Naz.API Aggregated Credential Dataset',
        date: '2024-01-16',
        dataClasses: ['email', 'password_hash', 'ip_address'],
        isVerified: true,
        description: 'Large-scale credential harvesting collection compiling infostealer logs and combo lists.',
      },
      {
        source: 'Exploit.in Credential Dump',
        date: '2022-09-04',
        dataClasses: ['email', 'password_hash'],
        isVerified: true,
        description: 'Historic plain/hashed combo list curated on underground forums.',
      },
    ],
  },
  {
    queryIdentifier: 'alex@sentinelkey-demo.com',
    hashPrefix: 'A1B2C',
    exposureType: 'clean',
    breachCount: 0,
    breaches: [],
  },
  {
    queryIdentifier: '+1 (555) 019-2834',
    hashPrefix: '3D4E5',
    exposureType: 'clean',
    breachCount: 0,
    breaches: [],
  },
];

export const INITIAL_SECURITY_POLICIES: SecurityPolicy[] = [
  {
    id: 'pol_passkey',
    name: 'Mandatory FIDO2 WebAuthn Passkeys',
    description: 'Require hardware biometric or physical security keys for all enterprise account logins.',
    enabled: true,
    category: 'AUTHENTICATION',
  },
  {
    id: 'pol_ext_block',
    name: 'Block Wildcard <all_urls> Extensions',
    description: 'Enforce enterprise policy restricting browser extensions requesting unpinned site inspection.',
    enabled: true,
    category: 'BROWSER',
  },
  {
    id: 'pol_doh',
    name: 'Enforce DNS-over-HTTPS (DoH)',
    description: 'Prohibit plaintext DNS queries to prevent local ISP wiretapping and rogue AP spoofing.',
    enabled: true,
    category: 'NETWORK',
  },
  {
    id: 'pol_session_timeout',
    name: 'Auto-Revoke Stale Sessions (>30 Days)',
    description: 'Automatically invalidate OAuth refresh tokens and sessions dormant for more than 30 days.',
    enabled: true,
    category: 'IDENTITY',
  },
];

export const INITIAL_GRAPH_NODES: SecurityNode[] = INITIAL_IDENTITY_NODES.map(n => ({
  ...n,
  metadata: { type: n.type, status: n.status, details: n.details || 'Normal parameters' },
}));

export const INITIAL_GRAPH_EDGES: SecurityEdge[] = INITIAL_IDENTITY_EDGES;

