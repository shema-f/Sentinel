/**
 * SentinelKey - Client-Side Cryptographic and Security Utilities
 * Strictly local processing: Never transmits raw passwords or secrets.
 */

import { DeveloperSecretScanResult } from '../types';

/**
 * Computes SHA-1 hash for k-anonymity range queries (Pwned Passwords standard)
 */
export async function computeSha1(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

/**
 * Computes SHA-256 for cryptographic identity identifiers
 */
export async function computeSha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toLowerCase();
}

/**
 * Splits SHA-1 hash into 5-character prefix and 35-character suffix for k-anonymity
 */
export async function prepareKAnonymityQuery(secret: string): Promise<{ prefix: string; suffix: string; fullHash: string }> {
  const fullHash = await computeSha1(secret);
  return {
    prefix: fullHash.substring(0, 5),
    suffix: fullHash.substring(5),
    fullHash,
  };
}

/**
 * High-Entropy and Regex-Based Client-Side Secret Scanner
 * Scans code, env files, or snippets completely in-memory without network transmission.
 */
const SECRET_RULES = [
  {
    type: 'AWS Access Key ID',
    regex: /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g,
    severity: 'CRITICAL' as const,
    remediation: 'Immediately deactivate this key in AWS IAM Console. Generate a new key and update AWS Secrets Manager.',
  },
  {
    type: 'GitHub Personal Access Token',
    regex: /gh[pousr]_[A-Za-z0-9_]{36,255}/g,
    severity: 'CRITICAL' as const,
    remediation: 'Revoke token at github.com/settings/tokens. Check GitHub audit log for unauthorized repository cloning.',
  },
  {
    type: 'Stripe API Secret Key',
    regex: /sk_live_[0-9a-zA-Z]{24,}/g,
    severity: 'CRITICAL' as const,
    remediation: 'Roll the secret key immediately in Stripe Dashboard -> Developers -> API Keys. Review Stripe event logs for fraudulent charges.',
  },
  {
    type: 'OpenAI / Anthropic API Key',
    regex: /sk-(?:live-)?[a-zA-Z0-9]{32,}/g,
    severity: 'HIGH' as const,
    remediation: 'Revoke in provider console to prevent API quota drain and unauthorized LLM inference requests.',
  },
  {
    type: 'Google Cloud / Gemini API Key',
    regex: /AIza[0-9A-Za-z\\-_]{35}/g,
    severity: 'HIGH' as const,
    remediation: 'Restrict key by HTTP referrer or API scope in Google Cloud Console Credentials. Rotate key if exposed publicly.',
  },
  {
    type: 'Private RSA/SSH Key Block',
    regex: /-----BEGIN (?:RSA|OPENSSH|EC|DSA) PRIVATE KEY-----/g,
    severity: 'CRITICAL' as const,
    remediation: 'Remove public key from ~/.ssh/authorized_keys on all target hosts immediately. Generate a new ed25519 keypair.',
  },
  {
    type: 'Slack Bot / User Token',
    regex: /xox[baprs]-[0-9a-zA-Z]{10,48}/g,
    severity: 'HIGH' as const,
    remediation: 'Revoke at api.slack.com/apps. Invalidate associated team channel webhooks.',
  },
  {
    type: 'Generic High-Entropy Bearer Token',
    regex: /(?:bearer|api_key|secret|password|token)\s*[:=]\s*['"]([a-zA-Z0-9_\-\.]{24,})['"]/gi,
    severity: 'MEDIUM' as const,
    remediation: 'Move secret into environment variable injected via secure vault (e.g. HashiCorp Vault, Doppler, GCP Secret Manager).',
  }
];

export function scanTextForSecretsLocally(content: string): DeveloperSecretScanResult[] {
  const findings: DeveloperSecretScanResult[] = [];
  const lines = content.split('\n');

  lines.forEach((line, lineIndex) => {
    for (const rule of SECRET_RULES) {
      const matches = line.match(rule.regex);
      if (matches) {
        for (const match of matches) {
          // Mask the secret: keep first 3 and last 3 characters
          const masked = match.length > 8 
            ? `${match.substring(0, 3)}••••••••${match.substring(match.length - 3)}`
            : '••••••••';
          
          findings.push({
            secretType: rule.type,
            description: `Exposed ${rule.type} detected on line ${lineIndex + 1}`,
            severity: rule.severity,
            line: lineIndex + 1,
            maskedSnippet: line.replace(match, masked).trim(),
            recommendedRemediation: rule.remediation,
            remediation: rule.remediation,
          });
        }
      }
    }
  });

  return findings;
}

/**
 * Calculates evidence-backed security posture score
 */
export function calculatePostureGrade(score: number): 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 75) return 'B+';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  if (score >= 35) return 'D';
  return 'F';
}
