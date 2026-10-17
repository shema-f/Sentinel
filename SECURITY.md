# Security Policy & Coordinated Vulnerability Disclosure

SentinelKey is committed to the highest standards of security, transparency, and data protection. We take all vulnerability reports seriously and collaborate constructively with independent security researchers.

---

## 🔒 Reporting a Vulnerability

If you discover a potential security vulnerability within SentinelKey, **please do NOT report it in public GitHub issues, discussions, or social media**.

### Preferred Contact
* **Primary Contact**: `security@ferrivox.com` / `security@sentinelkey.org`
* **Security Advisories**: [GitHub Private Vulnerability Reporting](https://github.com/shema-f/Sentinel/security/advisories)
* **Encryption**: Please encrypt sensitive proof-of-concept material using our PGP public key (see below).

### Expected Details in Report
To help us triage and validate your report swiftly, please include:
1. Type of issue (e.g. Broken k-Anonymity entropy, XSS, SSRF, Broken Access Control in RBAC, Memory leak in 3D WebGL context).
2. Exact steps to reproduce (or a minimal reproduction script).
3. Potential impact and severity assessment (CVSS v3.1 score).
4. Proposed remediation or patch if available.

---

## ⏱️ Response Timelines & SLA

* **Initial Acknowledgment**: Within **24 hours**.
* **Preliminary Assessment & Triage**: Within **72 hours**.
* **Status Updates**: At least every **7 calendar days** during investigation.
* **Coordinated Public Disclosure**: Within **30 to 90 days** from initial receipt, aligned with the reporter.

---

## 🛡️ Scope

### In-Scope:
* The core cryptographic primitives (`src/lib/cryptoUtils.ts`).
* Zero-Plaintext k-Anonymity protocol implementation.
* Differential privacy coordinate jittering algorithms.
* Client-side secret scanner pattern detection.
* Role-based access control (RBAC) matrix and session validation.
* Server-side reverse proxy routes and security headers (`server.ts`).

### Out-of-Scope:
* Attacks requiring physical access to an unlocked victim device.
* Social engineering or phishing attempts against SentinelKey project maintainers.
* Automated volumetric Denial of Service (DoS/DDoS) against staging endpoints.

---

## 🔑 PGP Public Key

```text
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.10
Comment: SentinelKey Security Team <security@sentinelkey.org>

mQENBF/P0uEBCADF7OaHk1n6rK8n8V8d8A8q2X4J8m9A3c4D7e8F9g0H1i2J3k4L
5m6N7o8P9q0R1s2T3u4V5w6X7y8Z9a0B1c2D3e4F5g6H7i8J9k0L1m2N3o4P5q6R
7s8T9u0V1w2X3y4Z5a6B7c8D9e0F1g2H3i4J5k6L7m8N9o0P1q2R3s4T5u6V7w8X
9y0Z1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8R9s0T1u2V3w4X5y6Z7a8B9c0D
=SENT
-----END PGP PUBLIC KEY BLOCK-----
```
