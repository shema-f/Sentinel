/**
 * SentinelKey - Core Domain TypeScript Definitions
 * Standard: Zero-Plaintext Security Architecture
 */

export type Role = 'owner' | 'security_admin' | 'admin' | 'member' | 'auditor';

export type PlanTier = 'free' | 'pro' | 'family' | 'business';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  plan: PlanTier;
  organizationId?: string;
  organizationName?: string;
  isMfaEnabled: boolean;
  mfaType?: 'webauthn_passkey' | 'totp' | 'hardware_token';
  avatarUrl?: string;
  createdAt: string;
}

export interface ScoreEvidence {
  factor: string;
  impact: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  description: string;
}

export interface SecurityPosture {
  overallScore: number; // 0 - 100
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  identityRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  browserSecurity: 'STRONG' | 'ADEQUATE' | 'AT_RISK';
  deviceSecurity: 'HARDENED' | 'STANDARD' | 'VULNERABLE';
  accountExposure: 'LOW' | 'ELEVATED' | 'CRITICAL';
  breachExposure: 'NONE' | 'POSSIBLE' | 'CONFIRMED';
  authStrength: 'STRONG' | 'MODERATE' | 'WEAK';
  mfaPasskeyAdoption: number; // percentage e.g. 85
  lastAuditTimestamp: string;
  scoreEvidence: ScoreEvidence[];
}

export interface RiskFinding {
  id: string;
  title: string;
  severity: Severity;
  affectedAsset: string;
  evidence: Record<string, string | number | boolean | null | string[]>;
  explanation: string;
  recommendedAction: string;
  remediationStatus: 'open' | 'in_progress' | 'resolved' | 'ignored';
  timestamp: string;
  resolvedAt?: string;
}

export interface BrowserExtensionAudit {
  id: string;
  name: string;
  version: string;
  permissions: string[];
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  warningNote?: string;
}

export interface BrowserAuditProfile {
  browserName: 'Chrome' | 'Edge' | 'Brave' | 'Firefox' | 'Safari';
  version: string;
  engine: string;
  dohEnabled: boolean; // DNS-over-HTTPS
  hstsPreload: boolean;
  cookiePartitioning: boolean; // CHIPS
  sandboxLevel: 'strict' | 'standard' | 'partial';
  extensions: BrowserExtensionAudit[];
  localLimitationNote: string;
  score: number;
}

export interface DeviceRecord {
  id: string;
  name: string;
  type: 'desktop' | 'laptop' | 'mobile' | 'server';
  os: string;
  osVersion: string;
  tpmStatus: 'verified_hardware' | 'software_only' | 'absent';
  diskEncryption: boolean;
  firewallActive: boolean;
  agentVersion: string;
  lastCheckIn: string;
  isCurrentDevice: boolean;
  isTrusted: boolean;
}

export interface IncidentStep {
  stepNumber: number;
  title: string;
  summary: string;
  instruction: string;
  technicalDetails: string[];
  actionLinkText?: string;
  actionUrl?: string;
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
}

export interface SecurityIncident {
  id: string;
  title: string;
  status: 'active' | 'contained' | 'resolved';
  severity: Severity;
  startedAt: string;
  triggerSource: string;
  currentStep: number;
  totalSteps: number;
  steps: IncidentStep[];
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType:
    | 'new_device'
    | 'login'
    | 'security_alert'
    | 'breach_detection'
    | 'password_rotation'
    | '2fa_enabled'
    | 'session_revoked'
    | 'api_key_rotated'
    | 'malware_detection_indicator'
    | 'recovery_action';
  severity: Severity;
  title: string;
  description: string;
  asset: string;
  actor: string;
  eventHash: string;
  prevHash?: string;
  metadata?: Record<string, any>;
}

export interface IdentityNode {
  id: string;
  label: string;
  type: 'user' | 'device' | 'browser' | 'email' | 'developer' | 'cloud' | 'financial' | 'auth';
  status: 'secure' | 'warning' | 'critical' | 'neutral';
  details?: string;
  x?: number;
  y?: number;
}

export interface IdentityEdge {
  source: string;
  target: string;
  label?: string;
  isCompromised?: boolean;
}

export interface BreachSearchResult {
  queryIdentifier: string; // e.g. masked email
  hashPrefix: string;
  exposureType: 'confirmed_exposure' | 'possible_exposure' | 'informational' | 'user_reported' | 'clean';
  breachCount: number;
  breaches: {
    source: string;
    date: string;
    dataClasses: string[];
    isVerified: boolean;
    description: string;
  }[];
  id?: string;
  identifier?: string;
  type?: string;
  status?: string;
  exposureCount?: number;
  breachSources?: string[];
  lastChecked?: string;
}

export interface AnonymizedBreachLocation {
  id: string;
  identityMasked: string;
  identityHashPrefix: string;
  country: string;
  countryCode: string;
  city: string;
  coordinates: [number, number]; // [longitude, latitude]
  fuzzedCoordinates: [number, number]; // Coarse blurred coordinates for privacy protection
  fuzzRadiusKm: number;
  breachName: string;
  sourceType: 'infostealer' | 'credential_dump' | 'c2_server' | 'edge_gateway' | 'pastebin' | 'darknet_forum';
  malwareFamily?: string;
  threatActor?: string;
  severity: Severity;
  recordsExposed: number;
  dataClasses: string[];
  discoveredAt: string;
  isContained: boolean;
  recommendedAction: string;
  mitreTechnique?: string;
}

export interface DeveloperSecretScanResult {
  secretType: string;
  description: string;
  severity: Severity;
  line: number;
  maskedSnippet: string;
  recommendedRemediation: string;
  remediation?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  emailMasked: string;
  postureScore: number;
  postureGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  devicesCount: number;
  activeAlertsCount: number;
  lastUpdated: string;
  displayName?: string;
  email?: string;
  grade?: string;
  passkeyAdopted?: boolean;
  lastSync?: string;
}

export interface OrganizationPolicy {
  requireMfaForAll: boolean;
  minPasswordEntropy: number;
  sessionTimeoutMinutes: number;
  enforcePasskeysOnly: boolean;
  blockHighRiskExtensions: boolean;
  allowedIpRanges: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: Role;
  action: string;
  targetResource: string;
  details: string;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
}

export interface PlanFeature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
  family: boolean | string;
  business: boolean | string;
}

// Convenience Aliases for Flexible Modular Components
export type MonitoredIdentity = BreachSearchResult;
export type BrowserProfile = BrowserAuditProfile & { id?: string; dohActive?: boolean; dohProvider?: string; sandboxSecurityStatus?: string };
export type BrowserExtension = BrowserExtensionAudit & { manifestVersion?: number };
export type Device = DeviceRecord & { deviceName?: string; hardwareEnclaveType?: string; complianceStatus?: string; lastSync?: string };
export interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
}
export type SecurityNode = IdentityNode & { metadata?: Record<string, any> };
export type SecurityEdge = IdentityEdge;
export type SecretFinding = DeveloperSecretScanResult;
