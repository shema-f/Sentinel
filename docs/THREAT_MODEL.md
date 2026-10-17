# SentinelKey — Security Threat Model
**Classification:** STRIDE & PASTA Methodology  
**Status:** Approved for Production MVP

---

## Threat Matrix Overview

This document analyzes attack surfaces, adversary assumptions, system impact, defensive mitigations, and residual risks for SentinelKey and its client ecosystems.

---

### Threat 1: Malware on Endpoint (Infostealer / RedLine / Lumma)
- **Attack Surface:** User workstation OS memory, local browser SQLite credential stores (`Login Data`), session cookie storage.
- **Assumptions:** Hostile binary executed with user-level privileges on Windows/macOS/Linux.
- **Impact:** Local extraction of active browser cookies, plaintext form autofill cache, and cached credentials.
- **Mitigation:**
  - SentinelKey never synchronizes or holds stored passwords in the cloud.
  - "Secure My Accounts" 10-step emergency lockdown isolates network connectivity immediately.
  - Recommended deployment of hardware FIDO2 passkeys which are immune to software memory extraction.
  - Native agent memory encryption using OS DPAPI / Keychain secure enclaves.
- **Residual Risk:** Zero-day kernel rootkits can intercept keystrokes prior to encryption; hardware security keys and multi-device authentication mitigates complete identity takeover.

---

### Threat 2: Stolen Central Database (Exfiltration / Backup Leak)
- **Attack Surface:** Cloud SQL PostgreSQL instance, automated WAL snapshots, disk volume backups.
- **Assumptions:** Adversary obtains read access to raw database tables via cloud misconfiguration.
- **Impact:** Potential leakage of user account metadata, organization rosters, and device telemetry.
- **Mitigation:**
  - Zero-Plaintext Architecture: Passwords, tokens, cookies, and private keys are never stored in the database.
  - User authentication secrets hashed with high-cost Argon2id.
  - Sensitive metadata fields encrypted with AES-256-GCM using keys stored in an isolated Hardware Security Module (KMS).
- **Residual Risk:** Leakage of account email lists and activity volume metrics; mitigated by pseudonymous identifier mapping.

---

### Threat 3: Stolen Session / Session Hijacking
- **Attack Surface:** Browser storage, TLS interception, man-in-the-browser attacks.
- **Assumptions:** Attacker extracts `sentinel_session` cookie via compromised extension or local malware.
- **Impact:** Unauthorized temporary access to SentinelKey dashboard and security telemetry.
- **Mitigation:**
  - `__Host-` cookie prefixes with `HttpOnly`, `Secure`, and `SameSite=Strict` attributes (inaccessible to JavaScript).
  - Short token lifetimes (15 minutes access token).
  - Cryptographic Device Binding & IP/TLS Fingerprint verification on sensitive operations (e.g. revoking keys, changing settings).
  - One-click global session revocation across all devices.
- **Residual Risk:** Immediate 15-minute window if stolen directly via compromised network device; mitigated by automated step-up WebAuthn authentication for privileged actions.

---

### Threat 4: Phishing & Adversary-in-the-Middle (AiTM)
- **Attack Surface:** User login flow, spoofed domains, reverse proxy kits (Evilginx).
- **Assumptions:** User is tricked into entering credentials into a spoofed landing page.
- **Impact:** Interception of static passwords and traditional SMS/TOTP 6-digit codes.
- **Mitigation:**
  - Primary recommendation and native support for FIDO2/WebAuthn passkeys (domain-bound public key cryptography prevents AiTM relay).
  - Passwordless magic link verification with cryptographic nonce bound to initial browser tab.
  - Plaintext breach monitoring warns users if their credentials appear in public breach feeds.
- **Residual Risk:** Fallback password logins remain susceptible if user ignores phishing indicators; passkeys are enforced as default tier.

---

### Threat 5: Credential Reuse & Stuffing
- **Attack Surface:** Third-party breach data dumps, automated credential stuffing bots.
- **Assumptions:** User utilizes identical passwords across third-party websites and their critical email/banking accounts.
- **Impact:** Compromise of external accounts when an unrelated consumer service is breached.
- **Mitigation:**
  - k-Anonymity breach intelligence alerting: users can audit their email addresses without leaking queries.
  - Risk engine calculates "Identity Risk Score" with specific demerit for unrotated or breached credentials.
  - Automated password hygiene audit guide and rotation playbook.
- **Residual Risk:** Zero-day breaches not yet aggregated into threat intelligence feeds; addressed by heuristic exposure detection.

---

### Threat 6: API Key & Secret Exposure
- **Attack Surface:** Public GitHub repositories, `.env` files, client-side web bundles, CI/CD logs.
- **Assumptions:** Developer accidentally commits AWS keys, GitHub PATs, or Gemini API keys to version control.
- **Impact:** Unauthorized cloud resource consumption, lateral privilege escalation.
- **Mitigation:**
  - SentinelKey Developer Mode: Local, client-side regex scanning engine detecting 40+ high-entropy secret patterns (AWS, Stripe, GitHub, Google Cloud, OpenAI).
  - Strictly client-side execution—raw secret values never hit SentinelKey servers.
  - Guided rotation playbooks for instant invalidation via official provider APIs.
- **Residual Risk:** Custom-formatted proprietary tokens not matching standard regex signatures; configurable custom regex filters provided.

---

### Threat 7: Compromised Primary Email Account
- **Attack Surface:** Email provider webmail, IMAP/SMTP endpoints, password reset flows.
- **Assumptions:** Attacker gains access to user's inbox (e.g., Gmail, Outlook).
- **Impact:** Attacker triggers "Forgot Password" on all secondary services (banking, cloud, social).
- **Mitigation:**
  - Step 3 of "Secure My Accounts" specifically isolates and secures the primary email.
  - Inspection guidance for email forwarding rules, POP/IMAP filters, and OAuth app grants.
  - SentinelKey requires hardware WebAuthn step-up for email address changes.
- **Residual Risk:** If the attacker has established persistent forwarding before detection, manual audit of mail filter rules is strictly guided by the checklist.

---

### Threat 8: Malicious Browser Extension
- **Attack Surface:** Chrome Web Store / Firefox Add-ons, arbitrary extension DOM inspection permissions (`<all_urls>`).
- **Assumptions:** A previously benign extension is acquired by a malicious actor and updated with credential scraping payload.
- **Impact:** DOM injection, capturing form inputs and session tokens as typed.
- **Mitigation:**
  - SentinelKey Browser Security Center audits extension permission footprints.
  - Highlighting over-privileged extensions (`debugger`, `webRequestBlocking`, `<all_urls>`).
  - Strict Content Security Policy (CSP) blocking external unauthorized scripts on SentinelKey pages.
- **Residual Risk:** Chrome manifest v3 permissions cannot be revoked programmatically by third-party web apps; SentinelKey provides direct deep links to `chrome://extensions` for user removal.

---

### Threat 9: Insider Threat (Cloud Infrastructure Admin)
- **Attack Surface:** Production cloud console, SSH bastion, database replica instances.
- **Assumptions:** Malicious or compromised SentinelKey site reliability engineer.
- **Impact:** Access to server logs and database storage.
- **Mitigation:**
  - Zero-Knowledge design ensures that even a rogue DBA cannot read user passwords, credentials, or private keys.
  - Ephemeral production access requiring multi-party approval.
  - Immutable append-only audit logging streamed to external SIEM.
- **Residual Risk:** Metadata regarding user account volume and aggregate threat trends; minimized through cryptographic tokenization.

---

### Threat 10: Supply-Chain Compromise (NPM / Crate / Dependency Poisoning)
- **Attack Surface:** Third-party JavaScript packages, build pipelines, CDN dependencies.
- **Assumptions:** Upstream dependency in `node_modules` is compromised with malicious code.
- **Impact:** Remote code execution during build or runtime in user browser.
- **Mitigation:**
  - Minimal dependency footprint (only verified core packages: React, Vite, Tailwind, Motion, Lucide).
  - Exact package lockfile version pinning (`package-lock.json`).
  - Automated CI vulnerability scanning (`npm audit`).
  - Strict CSP preventing unauthorized network exfiltration (`connect-src 'self'`).
- **Residual Risk:** Sophisticated obfuscated payloads bypassing static analysis; mitigated by CSP egress lockdown.
