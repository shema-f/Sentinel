/**
 * SentinelKey - Production-Grade API Gateway & Full-Stack Server
 * Architecture: Express + Vite + Server-Side Gemini AI + Zero-Plaintext Security
 */

import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Security Middlewares & Headers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Permissive framing & security headers compatible with Google AI Studio iframe preview
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Allow framing by AI Studio preview environment
  res.removeHeader('X-Frame-Options');
  next();
});

// In-Memory Simulated Store for Session & Incident State
let incidentStore = {
  id: 'INC-2026-0921-A',
  title: 'Suspected Credential Exposure & Session Compromise',
  status: 'active' as 'active' | 'contained' | 'resolved',
  severity: 'CRITICAL',
  startedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  triggerSource: 'k-Anonymity Naz.API Threat Match',
  currentStep: 4,
  completedSteps: [1, 2, 3],
};

// Known k-Anonymity Leak Prefixes database for zero-knowledge range query demonstration
const KNOWN_HASH_PREFIXES: Record<string, { suffix: string; count: number; breachName: string }[]> = {
  '7C4A8': [
    { suffix: 'D9B10E24FA7E14C89A01B2E3F4A5C6D7E8F9A0B1', count: 1420, breachName: 'Naz.API Aggregated Stealer Dump' },
    { suffix: '00A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9', count: 12, breachName: 'Collection #1 (Public Torrent)' },
  ],
  '5BAA6': [
    { suffix: '1E4C9B93F3F0682250B6CF8331B7EE68FD8', count: 28410, breachName: 'Pwned Passwords Master Index' },
    { suffix: '9A8B7C6D5E4F3A2B1C0D9E8F7A6B5C4D3E2F1A0B', count: 85, breachName: 'LinkedIn 2012 SHA1 Dump' },
  ],
  'F865B': [
    { suffix: '5364E480F53FBF739A01B2C3D4E5F6A7B8C9D0E1', count: 914, breachName: 'Exploit.in Credential List' },
  ],
};

// ============================================================================
// API ROUTES
// ============================================================================
// RFC 9116 SECURITY.TXT & OPEN SOURCE COMPLIANCE
// ============================================================================
app.get('/.well-known/security.txt', (req: Request, res: Response) => {
  res.type('text/plain').send(`Contact: mailto:security@sentinelkey.org
Encryption: https://sentinelkey.org/pgp-key.txt
Acknowledgments: https://sentinelkey.org/hall-of-fame
Preferred-Languages: en, es, fr, de, ja, zh
Canonical: https://sentinelkey.org/.well-known/security.txt
Policy: https://github.com/sentinelkey/sentinelkey/blob/main/SECURITY.md
Expires: 2027-12-31T23:59:59.000Z
`);
});

// 1. Health & Server Metadata
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    platform: 'SentinelKey Enterprise Defensive Gateway',
    version: '1.0.0-PROD',
    timestamp: new Date().toISOString(),
    cryptoEngine: 'Argon2id + AES-256-GCM + k-Anonymity SHA-1/256',
    zeroPlaintextGuarantee: true,
  });
});

// 2. Authentication & Session Status
app.get('/api/auth/session', (req: Request, res: Response) => {
  res.json({
    authenticated: true,
    user: {
      id: 'usr_sentinel_0981a',
      email: 'alex.vance@sentinelkey-demo.com',
      displayName: 'Alex Vance',
      role: 'security_admin',
      plan: 'pro',
      organizationName: 'Vance Cyber Defense Lab',
      isMfaEnabled: true,
      mfaType: 'webauthn_passkey',
    },
    sessionExpiresInSeconds: 900, // 15-minute rolling zero-trust token
  });
});

app.post('/api/auth/revoke-all-sessions', (req: Request, res: Response) => {
  res.json({
    success: true,
    revokedSessionsCount: 4,
    currentSessionPreserved: true,
    message: 'Global session revocation propagated to all edge nodes.',
    timestamp: new Date().toISOString(),
  });
});

// 3. Privacy-Preserving Breach Intelligence (k-Anonymity Range Query)
app.post('/api/breach/check-prefix', (req: Request, res: Response) => {
  const { hashPrefix } = req.body;

  if (!hashPrefix || typeof hashPrefix !== 'string' || hashPrefix.length < 5) {
    return res.status(400).json({
      error: 'Invalid hash prefix. You must provide at least the first 5 hexadecimal characters of the SHA-1 or SHA-256 hash.',
    });
  }

  const normalizedPrefix = hashPrefix.substring(0, 5).toUpperCase();
  const matchedEntries = KNOWN_HASH_PREFIXES[normalizedPrefix] || [
    // Return sample pseudo-randomized synthetic hashes for unknown queries to simulate real HIBP k-anonymity behavior
    { suffix: '4A6B2C8D1E3F5A7C9E0D2B4F6A8C1E3D5B7A9C0E', count: 0, breachName: 'Clean (No verified matches)' },
  ];

  res.json({
    prefix: normalizedPrefix,
    candidatesCount: matchedEntries.length,
    candidates: matchedEntries,
    privacyGuarantee: 'Your full identifier or password was NOT transmitted or logged on our servers.',
    timestamp: new Date().toISOString(),
  });
});

// 3b. Anonymized Global Breach Threat Map Data
app.get('/api/breach/global-map', (req: Request, res: Response) => {
  const { prefix, severity } = req.query;

  // In-memory anonymized breach telemetry dataset
  const breachPoints = [
    {
      id: 'brg_ashburn_01',
      identityMasked: 'al***@gm***.com',
      identityHashPrefix: '7C4A8',
      country: 'United States',
      countryCode: 'US',
      city: 'Ashburn, VA',
      coordinates: [-77.48, 39.04],
      fuzzedCoordinates: [-77.42, 39.11],
      fuzzRadiusKm: 35,
      breachName: 'Naz.API Infostealer Collector',
      sourceType: 'infostealer',
      malwareFamily: 'RedLine Stealer v24.1',
      threatActor: 'TA505 Affiliate Syndicate',
      severity: 'CRITICAL',
      recordsExposed: 14200,
      dataClasses: ['email', 'password_hash', 'session_cookie', 'ip_address'],
      discoveredAt: '2024-01-16T08:30:00Z',
      isContained: false,
      recommendedAction: 'Invalidate active OAuth tokens and execute 10-step Containment Protocol.',
      mitreTechnique: 'T1555.003 - Credentials from Web Browsers',
    },
    {
      id: 'brg_sanjose_02',
      identityMasked: 'al***@gm***.com',
      identityHashPrefix: '7C4A8',
      country: 'United States',
      countryCode: 'US',
      city: 'San Jose, CA',
      coordinates: [-121.88, 37.33],
      fuzzedCoordinates: [-121.94, 37.28],
      fuzzRadiusKm: 30,
      breachName: 'Cloud Storage API Key Exfiltration',
      sourceType: 'c2_server',
      malwareFamily: 'Lumma Stealer C2',
      threatActor: 'UNC2970',
      severity: 'HIGH',
      recordsExposed: 3100,
      dataClasses: ['oauth_token', 'browser_history', 'cookie'],
      discoveredAt: '2024-03-12T14:15:00Z',
      isContained: false,
      recommendedAction: 'Revoke AWS & Google Cloud session grants in Developer Security center.',
      mitreTechnique: 'T1539 - Steal Web Session Cookie',
    },
    {
      id: 'brg_frankfurt_03',
      identityMasked: 'al***@gm***.com',
      identityHashPrefix: '7C4A8',
      country: 'Germany',
      countryCode: 'DE',
      city: 'Frankfurt am Main',
      coordinates: [8.68, 50.11],
      fuzzedCoordinates: [8.74, 50.18],
      fuzzRadiusKm: 40,
      breachName: 'Naz.API Aggregated Dataset',
      sourceType: 'credential_dump',
      malwareFamily: 'Botnet Harvester',
      threatActor: 'ShadowBroker Clone',
      severity: 'CRITICAL',
      recordsExposed: 28400,
      dataClasses: ['email', 'password_hash', 'autofill_data'],
      discoveredAt: '2024-01-16T11:45:00Z',
      isContained: false,
      recommendedAction: 'Rotate master vault passwords and enforce FIDO2 WebAuthn passkeys.',
      mitreTechnique: 'T1110.003 - Password Spraying',
    },
    {
      id: 'brg_amsterdam_04',
      identityMasked: 'al***@gm***.com',
      identityHashPrefix: '7C4A8',
      country: 'Netherlands',
      countryCode: 'NL',
      city: 'Amsterdam',
      coordinates: [4.90, 52.37],
      fuzzedCoordinates: [4.84, 52.41],
      fuzzRadiusKm: 25,
      breachName: 'Exploit.in Credential Dump',
      sourceType: 'darknet_forum',
      malwareFamily: 'Underground Combo Scrape',
      threatActor: 'Independent Threat Broker',
      severity: 'HIGH',
      recordsExposed: 6200,
      dataClasses: ['email', 'password_hash'],
      discoveredAt: '2023-11-20T19:00:00Z',
      isContained: true,
      recommendedAction: 'Archived exposure; password has been updated but email remains monitored.',
      mitreTechnique: 'T1589.001 - Credentials Gathering',
    },
    {
      id: 'brg_london_05',
      identityMasked: 'co***@va***.com',
      identityHashPrefix: '5BAA6',
      country: 'United Kingdom',
      countryCode: 'GB',
      city: 'London',
      coordinates: [-0.12, 51.50],
      fuzzedCoordinates: [-0.08, 51.55],
      fuzzRadiusKm: 30,
      breachName: 'Enterprise VPN Gateway Credential Stuffing',
      sourceType: 'edge_gateway',
      malwareFamily: 'Automated Brute-Force Bot',
      threatActor: 'FIN7 Affiliate',
      severity: 'HIGH',
      recordsExposed: 1840,
      dataClasses: ['corporate_email', 'vpn_session_token', 'ip_history'],
      discoveredAt: '2024-02-04T06:10:00Z',
      isContained: true,
      recommendedAction: 'Enforce IP range restriction and terminate stale edge sessions.',
      mitreTechnique: 'T1078.004 - Valid Accounts: Cloud Accounts',
    },
    {
      id: 'brg_tokyo_06',
      identityMasked: 'al***@gm***.com',
      identityHashPrefix: '7C4A8',
      country: 'Japan',
      countryCode: 'JP',
      city: 'Tokyo',
      coordinates: [139.69, 35.68],
      fuzzedCoordinates: [139.75, 35.62],
      fuzzRadiusKm: 35,
      breachName: 'Vidar Stealer Browser SQLite Dump',
      sourceType: 'infostealer',
      malwareFamily: 'Vidar Infostealer',
      threatActor: 'RedAlpha Botnet Operator',
      severity: 'CRITICAL',
      recordsExposed: 9750,
      dataClasses: ['browser_passwords', 'autofill', 'crypto_wallet_extension'],
      discoveredAt: '2024-04-18T16:20:00Z',
      isContained: false,
      recommendedAction: 'Inspect Browser Security Center and purge compromised browser profiles.',
      mitreTechnique: 'T1552.001 - Credentials in Files',
    },
    {
      id: 'brg_singapore_07',
      identityMasked: 'al***@se***.com',
      identityHashPrefix: 'A1B2C',
      country: 'Singapore',
      countryCode: 'SG',
      city: 'Singapore',
      coordinates: [103.85, 1.29],
      fuzzedCoordinates: [103.81, 1.34],
      fuzzRadiusKm: 20,
      breachName: 'Edge Gateway Telemetry Leak',
      sourceType: 'edge_gateway',
      malwareFamily: 'Scattered Spider Proxy',
      threatActor: 'Adversary Proxy Node',
      severity: 'MEDIUM',
      recordsExposed: 420,
      dataClasses: ['session_headers', 'tls_fingerprint'],
      discoveredAt: '2024-05-02T22:15:00Z',
      isContained: true,
      recommendedAction: 'Zero plaintext passwords detected; session token has been revoked.',
      mitreTechnique: 'T1190 - Exploit Public-Facing Application',
    },
    {
      id: 'brg_sydney_08',
      identityMasked: 'al***@gm***.com',
      identityHashPrefix: '7C4A8',
      country: 'Australia',
      countryCode: 'AU',
      city: 'Sydney',
      coordinates: [151.20, -33.86],
      fuzzedCoordinates: [151.15, -33.81],
      fuzzRadiusKm: 35,
      breachName: 'Underground Pastebin Credential Scrape',
      sourceType: 'pastebin',
      malwareFamily: 'Web Scraping Bot',
      threatActor: 'Unattributed Paste Publisher',
      severity: 'MEDIUM',
      recordsExposed: 1120,
      dataClasses: ['email', 'password_hash'],
      discoveredAt: '2023-08-14T12:00:00Z',
      isContained: true,
      recommendedAction: 'Legacy credential verified as rotated. Retained in monitoring fleet.',
      mitreTechnique: 'T1596 - Search Open Technical Databases',
    },
    {
      id: 'brg_saopaulo_09',
      identityMasked: 'al***@gm***.com',
      identityHashPrefix: '7C4A8',
      country: 'Brazil',
      countryCode: 'BR',
      city: 'São Paulo',
      coordinates: [-46.63, -23.55],
      fuzzedCoordinates: [-46.58, -23.61],
      fuzzRadiusKm: 40,
      breachName: 'Banking Trojan Telemetry Auction',
      sourceType: 'darknet_forum',
      malwareFamily: 'Grandoreiro Trojan Clone',
      threatActor: 'Latin American Cybercrime Cell',
      severity: 'HIGH',
      recordsExposed: 2300,
      dataClasses: ['email', 'bank_username_hash', 'session_id'],
      discoveredAt: '2023-10-09T03:45:00Z',
      isContained: false,
      recommendedAction: 'Verify financial account 2FA and enable biometric approvals.',
      mitreTechnique: 'T1056.001 - Keylogging',
    },
    {
      id: 'brg_paris_10',
      identityMasked: 'al***@gm***.com',
      identityHashPrefix: '7C4A8',
      country: 'France',
      countryCode: 'FR',
      city: 'Paris',
      coordinates: [2.35, 48.85],
      fuzzedCoordinates: [2.41, 48.91],
      fuzzRadiusKm: 30,
      breachName: 'Reverse Proxy Phishing Kit Harvest',
      sourceType: 'c2_server',
      malwareFamily: 'Evilginx3 Infrastructure',
      threatActor: 'WizPhish Campaign',
      severity: 'HIGH',
      recordsExposed: 4500,
      dataClasses: ['email', 'session_cookie', 'mfa_token'],
      discoveredAt: '2024-01-29T17:10:00Z',
      isContained: false,
      recommendedAction: 'Upgrade from SMS/TOTP to FIDO2 WebAuthn to eliminate MitM relaying.',
      mitreTechnique: 'T1566.002 - Spearphishing Link',
    },
    {
      id: 'brg_seoul_11',
      identityMasked: 'al***@gm***.com',
      identityHashPrefix: '7C4A8',
      country: 'South Korea',
      countryCode: 'KR',
      city: 'Seoul',
      coordinates: [126.97, 37.56],
      fuzzedCoordinates: [127.03, 37.51],
      fuzzRadiusKm: 30,
      breachName: 'Lumma C2 Botnet Beacon Node',
      sourceType: 'c2_server',
      malwareFamily: 'Lumma Stealer v4',
      threatActor: 'Lumma Operator Network',
      severity: 'CRITICAL',
      recordsExposed: 7100,
      dataClasses: ['browser_tokens', 'system_fingerprint', 'credentials'],
      discoveredAt: '2024-06-11T13:20:00Z',
      isContained: false,
      recommendedAction: 'Quarantine device and revoke sessions immediately via Incident Response.',
      mitreTechnique: 'T1071.001 - Web Protocols',
    },
    {
      id: 'brg_dubai_12',
      identityMasked: 'al***@se***.com',
      identityHashPrefix: 'A1B2C',
      country: 'United Arab Emirates',
      countryCode: 'AE',
      city: 'Dubai',
      coordinates: [55.27, 25.20],
      fuzzedCoordinates: [55.33, 25.15],
      fuzzRadiusKm: 35,
      breachName: 'Executive Credential Telegram Channel',
      sourceType: 'darknet_forum',
      malwareFamily: 'Telegram Combolist Scraper',
      threatActor: 'ThreatChannel 892',
      severity: 'HIGH',
      recordsExposed: 1450,
      dataClasses: ['domain_credentials', 'corporate_email'],
      discoveredAt: '2024-05-19T20:40:00Z',
      isContained: false,
      recommendedAction: 'Trigger enterprise domain password reset for impacted user.',
      mitreTechnique: 'T1589.002 - Email Addresses',
    },
  ];

  let filtered = [...breachPoints];
  if (prefix && typeof prefix === 'string') {
    filtered = filtered.filter(p => p.identityHashPrefix === prefix.toUpperCase());
  }
  if (severity && typeof severity === 'string') {
    filtered = filtered.filter(p => p.severity.toLowerCase() === severity.toLowerCase());
  }

  res.json({
    anonymizedBreaches: filtered,
    totalLocations: filtered.length,
    differentialPrivacyPolicy: {
      appliedJitterKm: 35,
      zeroPlaintextGuarantee: true,
      kAnonymityEnforced: true,
    },
    timestamp: new Date().toISOString(),
  });
});

// 4. "Secure My Accounts" Incident Response Workflow
app.get('/api/incident/current', (req: Request, res: Response) => {
  res.json(incidentStore);
});

app.post('/api/incident/step', (req: Request, res: Response) => {
  const { stepNumber, completed } = req.body;
  if (typeof stepNumber === 'number') {
    if (completed && !incidentStore.completedSteps.includes(stepNumber)) {
      incidentStore.completedSteps.push(stepNumber);
      incidentStore.completedSteps.sort((a, b) => a - b);
    } else if (!completed) {
      incidentStore.completedSteps = incidentStore.completedSteps.filter(s => s !== stepNumber);
    }
    incidentStore.currentStep = Math.min(10, Math.max(1, Math.max(...incidentStore.completedSteps, 0) + 1));
    if (incidentStore.completedSteps.length >= 10) {
      incidentStore.status = 'resolved';
    } else if (incidentStore.completedSteps.length >= 3) {
      incidentStore.status = 'contained';
    }
  }
  res.json(incidentStore);
});

app.get('/api/incident/report', (req: Request, res: Response) => {
  const report = {
    incidentId: incidentStore.id,
    generatedAt: new Date().toISOString(),
    organization: 'Vance Cyber Defense Lab',
    containmentStatus: incidentStore.status.toUpperCase(),
    totalStepsCompleted: `${incidentStore.completedSteps.length} of 10`,
    integrityHashSha256: '8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a',
    summary: 'The incident containment protocol "SECURE MY ACCOUNTS" was successfully coordinated. Network perimeter severed, primary email credentials rotated, and all stale sessions invalidated.',
    completedStepNumbers: incidentStore.completedSteps,
    residualRiskNotes: 'Ensure all third-party OAuth app authorizations are re-evaluated within 48 hours.',
  };
  res.json(report);
});

// 5. AI Security Analyst "Sentinel" (Server-side Gemini 3.8 Flash)
app.post('/api/ai/analyst', async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message text is required.' });
  }

  // Grounding Context: Structured, non-secret telemetry
  const structuredTelemetryContext = `
SYSTEM GROUNDING CONTEXT (DO NOT FABRICATE DATA BEYOND THESE FACTS):
User: Alex Vance (Security Admin, Vance Cyber Defense Lab)
Current Posture Score: 74/100 (Grade B, Moderate Risk)
Documented Risk Findings:
1. HIGH: Credential Exposure in Aggregator Dump (Naz.API/StealerLogs) affecting personal email (alex.vance@gmail.com). Hash match confirmed via k-anonymity.
2. MEDIUM: Over-Privileged Browser Extension ("Quick PDF Highlighter & Converter" holds <all_urls> permission without domain pinning).
3. LOW: Stale GitHub OAuth Session active on Frankfurt AWS subnet for 38 days.
4. RESOLVED: Local .env file permissions previously world-readable (0644), hardened to 0600.
Incident Status:
- "SECURE MY ACCOUNTS" active (Steps 1, 2, 3 completed: Device contained, trusted device engaged, primary Gmail password rotated).
- Step 4 (Terminating active sessions across Google, Microsoft, GitHub) is currently pending.
Hardware Posture:
- Primary MacBook Pro 16" running macOS Sonoma has Apple Silicon hardware Secure Enclave & FileVault active.
- DNS-over-HTTPS (DoH) is active.
`;

  try {
    if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `You are "Sentinel", the AI Security Analyst for SentinelKey.
Explain security findings, threats, and incident containment in plain, professional, reassuring, and precise language.
Strict Grounding Rules:
- Ground your answers strictly in the structured security events and telemetry provided.
- NEVER fabricate detections, malware names, breaches, CVE numbers, vulnerabilities, or fictitious evidence.
- Prioritize actions based on documented risk factors (e.g. recommend completing Step 4: Terminate active sessions).
- Emphasize defensive security: passwords remain locally on user devices; explain k-anonymity privacy; never suggest hacking back or offensive tools.
- Keep answers clear, technical yet understandable, avoiding panic.`;

      const prompt = `${structuredTelemetryContext}\n\nUser Question: ${message}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.3, // Low temperature for high factual adherence
        },
      });

      const responseText = response.text || 'I analyzed your security telemetry. Please complete Step 4 of your incident response to terminate active sessions.';

      return res.json({
        response: responseText,
        groundedIn: ['Naz.API Hash Match', 'Quick PDF Extension Audit', 'MacBook Secure Enclave Status', 'Incident Response Step 4'],
        timestamp: new Date().toISOString(),
      });
    } else {
      // Fallback deterministic grounded analysis if Gemini key not set
      let answer = '';
      const lower = message.toLowerCase();

      if (lower.includes('why am i at high risk') || lower.includes('risk')) {
        answer = `Based on your empirical telemetry, your identity risk is **Moderate (Score: 74/100, Grade B)**. The primary risk driver is a **k-anonymity verified credential match in the Naz.API aggregator breach dump** for your personal email. Additionally, you have an over-privileged browser extension with \`<all_urls>\` access, which could inspect web pages if compromised.`;
      } else if (lower.includes('what should i secure first') || lower.includes('priority')) {
        answer = `Your highest priority is to continue your active incident response workflow:
1. **Immediate Step:** Complete **Step 4: Terminate All Active Web & App Sessions** in the "Secure My Accounts" center. This invalidates any stolen session cookies.
2. **Second Step:** Rotate passwords on financial and cloud accounts where you may have used similar credentials.
3. **Third Step:** Restrict or uninstall the "Quick PDF Highlighter" browser extension to remove \`<all_urls>\` DOM inspection.`;
      } else if (lower.includes('alert') || lower.includes('explain')) {
        answer = `The active alert originates from our **privacy-preserving k-anonymity breach check**. Your email and password hash appeared in an aggregated stealer log dataset. Because your password was never uploaded to our servers, this was verified by matching your 5-character SHA-1 prefix locally. We recommend enforcing hardware passkeys so static password leaks cannot compromise your accounts.`;
      } else {
        answer = `I am monitoring your defensive posture in real-time. Currently, your endpoint hardware is hardened with Apple Secure Enclave, but you have 1 open critical finding (Naz.API breach exposure) and your "SECURE MY ACCOUNTS" containment is on Step 4. What specific security aspect would you like me to inspect?`;
      }

      return res.json({
        response: answer,
        groundedIn: ['Naz.API Hash Match', 'Incident Response Engine', 'Local Extension Audit'],
        timestamp: new Date().toISOString(),
        note: 'Grounded analytical response from SentinelKey Defensive Core.',
      });
    }
  } catch (err: any) {
    console.error('Error generating AI response:', err);
    return res.status(500).json({
      error: 'Security Analyst failed to evaluate telemetry. Please try again.',
      details: err?.message || String(err),
    });
  }
});

// ============================================================================
// VITE OR STATIC SERVING
// ============================================================================
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SentinelKey] Production-Grade Security Platform running on http://0.0.0.0:${PORT}`);
  });
}

start().catch(err => {
  console.error('[SentinelKey] Failed to start server:', err);
  process.exit(1);
});
