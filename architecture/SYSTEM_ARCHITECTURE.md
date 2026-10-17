# SentinelKey — System Architecture Document
**Version:** 1.0.0-PROD  
**Classification:** Defensive Security Architecture  
**Core Promise:** "Protect your digital identity when your browser, device, or credentials are at risk."

---

## 1. Architectural Principles

1. **Zero-Plaintext Credential Transmission**  
   Plaintext user passwords, master keys, session cookies, auth tokens, and private API keys NEVER leave the user's client device. The cloud platform stores zero secret credentials.
2. **Local-First Defensive Auditing**  
   Security posture calculations, browser configuration checks, credential exposure hashes, and secret scanning are evaluated client-side or within a local sandboxed agent.
3. **Privacy-Preserving Breach Intelligence (k-Anonymity)**  
   Credential breach checks utilize k-anonymity models (e.g., SHA-1/SHA-256 5-character prefix matching). The cloud service never learns the identifier or password being audited.
4. **Event Sourcing & Auditability**  
   Every posture modification, device registration, and remediation step is logged as an immutable, timestamped event with cryptographic hashing.
5. **Role-Based Access Control (RBAC)**  
   Strict authorization barriers delineate Owner, Security Admin, Admin, Member, and Auditor roles for organizations, and partitioned vaults for family units.
6. **Honest Security Posture**  
   No platform is "100% unhackable." SentinelKey measures empirical risk factors, provides evidence-backed explanations, and equips users for rapid containment.

---

## 2. High-Level System Architecture Diagram

```
+-------------------------------------------------------------------------------+
|                             CLIENT PERIMETER                                  |
|                                                                               |
|  +------------------------+  +------------------------+  +-----------------+  |
|  | Web Application (Vite) |  | Native Agent (Rust)    |  | Browser Center  |  |
|  | - Identity Dashboard   |  | - OS TPM/Enclave Hooks |  | - Extension API |  |
|  | - "Secure My Accounts" |  | - Local Secret Scanner |  | - Chromium Meta |  |
|  | - Interactive Graph    |  | - Encrypted Local DB   |  | - Firefox Meta  |  |
|  +-----------+------------+  +-----------+------------+  +--------+--------+  |
|              |                           |                        |           |
|              | [TLS 1.3 + Signed JWT]    | [Mutual TLS]           |           |
+--------------|---------------------------|------------------------|-----------+
               |                           |                        |
               v                           v                        v
+-------------------------------------------------------------------------------+
|                       SENTINELKEY CLUSTER / BACKEND                           |
|                                                                               |
|  +-------------------------------------------------------------------------+  |
|  | Reverse Proxy / WAF (Cloud Run / Nginx / Cloudflare)                    |  |
|  | - Rate Limiting, DDoS Mitigation, Strict CSP, HSTS, Secure Headers      |  |
|  +------------------------------------+------------------------------------+  |
|                                       |                                       |
|  +------------------------------------v------------------------------------+  |
|  | Express REST & Event Sourcing API Gateway                               |  |
|  | - Auth & Session Token Validator (HttpOnly, SameSite=Strict)           |  |
|  | - RBAC Policy Enforcer (Owner / SecAdmin / Admin / Member / Auditor)   |  |
|  | - k-Anonymity Breach Range Query Proxy (Zero Plaintext)                 |  |
|  | - Remediation Workflow & Incident Report Engine                         |  |
|  +--------------------+-------------------------------+--------------------+  |
|                       |                               |                       |
|       +---------------v---------------+       +-------v---------------+       |
|       | AI Security Analyst (Gemini)  |       | PostgreSQL Database   |       |
|       | - Server-Side @google/genai   |       | - 14 Normalized Tables|       |
|       | - Strict Grounded Event Context|      | - AES-256-GCM Metadata|       |
|       | - Zero Plaintext Secrets Feed |       | - Immutable Audit Log |       |
|       +-------------------------------+       +-----------------------+       |
+-------------------------------------------------------------------------------+
```

---

## 3. Subsystem Breakdown

### 3.1 Local Security Engine & Browser Abstraction
- Implemented as a cross-browser adapter (`ChromiumAdapter`, `FirefoxAdapter`, `SafariAdapter`).
- Transparently inspects public security indicators: DoH (DNS-over-HTTPS), HSTS cache status, sandbox flags, extension manifest permission scopes, cookie partition attributes (`CHIPS`), WebAuthn/FIDO2 passkey hardware presence.
- Where browser sandboxing restricts direct disk reading (e.g. Chrome's Protected OS DPAPI `Login Data`), SentinelKey explicitly communicates API limitations rather than executing unsafe memory injection or malware techniques.

### 3.2 k-Anonymity Breach Intelligence Service
- Client hashes target identifier/password locally:
  $$\text{Hash} = \text{SHA-1}(\text{credential})$$
  $$\text{Prefix} = \text{Hash}[0..4] \quad (\text{transmitted to server})$$
  $$\text{Suffix} = \text{Hash}[5..39] \quad (\text{evaluated locally})$$
- The SentinelKey API returns candidate suffix hashes. Client checks for matches locally in constant time.

### 3.3 "Secure My Accounts" Incident Response Workflow
A 10-step deterministic containment pipeline:
1. Containment (Network isolation, kill browser processes)
2. Trusted Device Handoff
3. Primary Email Protection (Password rotation + App Password audit)
4. Active Session Invalidation
5. Tier-1 Password Rotation (Banking, Work, Cloud)
6. API Key & Personal Access Token Revocation
7. Hardware Key / Passkey Onboarding (FIDO2)
8. Recovery Email & Phone Sanity Verification
9. Audit Log & Forwarding Rule Inspection
10. Cryptographically Signed Incident Report Generation

---

## 4. Native Desktop Agent (Rust Target Architecture)
- **Target OS:** Windows 11 / macOS 13+ / Ubuntu 22.04 LTS.
- **Security Primitives:**
  - Windows: Windows DPAPI, Virtualization-Based Security (VBS), Windows Defender ATP hooks.
  - macOS: Keychain Services, Secure Enclave (Apple Silicon), Endpoint Security Framework (`EndpointSecurity.framework`).
  - Linux: Secret Service API, Kernel Keyrings, AppArmor / SELinux profiles.
- **Anti-Malware Stance:** Transparent service with non-stealth system tray status icon, visible audit log, uninstaller, and open source inspection manifest. Zero kernel rootkits or obfuscated persistence.
