# SentinelKey — REST API Specification
**Protocol:** HTTPS / TLS 1.3  
**Base URL:** `/api`  
**Authentication:** Bearer Token / HttpOnly Session Cookie  
**Data Format:** `application/json`

---

## 1. Authentication & Session

### `POST /api/auth/login`
- **Body:** `{ email: string, password_argon_hash?: string, webauthn_assertion?: object }`
- **Security:** Argon2id client salt or WebAuthn FIDO2 assertion. Zero plaintext password transmission.
- **Returns:** `{ user: UserProfile, token: string }`

### `GET /api/auth/session`
- **Headers:** Cookie / Authorization
- **Returns:** `{ user: UserProfile, organization?: OrgSummary }`

### `POST /api/auth/revoke-all-sessions`
- **Description:** Global emergency session invalidation across all registered devices.

---

## 2. Posture & Findings

### `GET /api/security/posture`
- **Returns:**
  ```json
  {
    "overallScore": 78,
    "grade": "B+",
    "identityRisk": "MODERATE",
    "browserSecurity": "STRONG",
    "deviceSecurity": "HARDENED",
    "accountExposure": "LOW",
    "breachExposure": "ELEVATED",
    "authStrength": "STRONG",
    "mfaPasskeyAdoption": 85,
    "lastAuditTimestamp": "2026-09-21T05:10:00Z",
    "scoreEvidence": [
      { "factor": "2FA on Primary Email", "impact": "+15", "status": "PASS" },
      { "factor": "Compromised Credentials in DarkWeb Dump", "impact": "-25", "status": "FAIL" }
    ]
  }
  ```

### `GET /api/security/findings`
- **Returns:** List of evidence-backed findings with severity, asset, explanation, and action.

### `POST /api/security/findings/:id/status`
- **Body:** `{ status: "in_progress" | "resolved" | "ignored" }`

---

## 3. Privacy-Preserving Breach Intelligence (k-Anonymity)

### `POST /api/breach/check-prefix`
- **Description:** Privacy-preserving hash range check. Client sends 5-character SHA-1 or SHA-256 prefix. Plaintext password is NEVER sent.
- **Body:** `{ hashPrefix: "5BAA6" }` (First 5 characters of SHA-1)
- **Returns:**
  ```json
  {
    "prefix": "5BAA6",
    "candidates": [
      { "suffix": "1E4C9B93F3F0682250B6CF8331B7EE68FD8", "count": 28410 },
      { "suffix": "820D328C9130D0DE21FC0025D7E37F92881", "count": 14 }
    ]
  }
  ```

---

## 4. "Secure My Accounts" Incident Response Workflow

### `POST /api/incident/start`
- **Body:** `{ trigger: "suspected_device_compromise" | "infostealer_alert" | "routine_lockdown" }`
- **Returns:** `{ incidentId: string, currentStep: 1, totalSteps: 10, checklist: StepItem[] }`

### `POST /api/incident/step`
- **Body:** `{ incidentId: string, stepNumber: number, completed: boolean, notes?: string }`
- **Returns:** Updated step progress and containment state.

### `GET /api/incident/:id/report`
- **Returns:** Cryptographically verifiable incident containment report in JSON / Markdown format with forensic timeline.

---

## 5. AI Security Analyst "Sentinel"

### `POST /api/ai/analyst`
- **Description:** Server-side Gemini (`gemini-3.8-flash`) grounding model.
- **Body:**
  ```json
  {
    "message": "Why am I at high risk and what should I secure first?",
    "includeContext": true
  }
  ```
- **Context Grounding:** Backend injects structured, non-secret security findings and timeline events to ensure zero hallucinations.
- **Returns:** `{ response: string, sources: string[], suggestedActions: string[] }`

---

## 6. Developer Mode Secret Engine & Browser Center

### `POST /api/developer/audit-manifest`
- Evaluates repository and environment posture using metadata and regex patterns (run in-memory).

### `GET /api/browser/audit-profile`
- Retrieves supported security metrics for Chromium, Edge, Brave, and Firefox.
