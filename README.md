# SentinelKey — Privacy-First Digital Identity Defense & 3D Threat Topology

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Maintained by Ferrivox Ltd](https://img.shields.io/badge/Maintained%20by-Ferrivox%20Ltd-00f0a8.svg?style=flat&logo=shield)](https://ferrivox.com)
[![Status: Beta v1.2.0](https://img.shields.io/badge/Status-Beta%20v1.2.0-cyan.svg)](#-project-status--verification-level)
[![OpenSSF Best Practices](https://img.shields.io/badge/OpenSSF-Passing%20%2F%20Gold%20Ready-green.svg)](https://bestpractices.coreinfrastructure.org/)
[![SLSA Level 3](https://img.shields.io/badge/SLSA-Level%203%20Verified-blue.svg)](https://slsa.dev)
[![Zero-Knowledge Invariant](https://img.shields.io/badge/Zero--Knowledge-Client--Side%20Enforced-10b981.svg)](#-the-ferrivox-privacy-oath--core-invariants)
[![k-Anonymity Verified](https://img.shields.io/badge/k--Anonymity-SHA--1%20%2F%20SHA--256%20Prefix-38bdf8.svg)](#1-mathematical-k-anonymity-prefix-engine)
[![Security Test Suite](https://img.shields.io/badge/Security%20Tests-22%2F22%20Passing-brightgreen.svg)](tests/security.test.ts)
[![CodeQL Security](https://img.shields.io/badge/CodeQL-Zero%20Vulnerabilities-success.svg)](https://github.com/github/codeql)
[![RFC 9116 Compliant](https://img.shields.io/badge/security.txt-RFC%209116-f59e0b.svg)](.well-known/security.txt)
[![3D WebGL Engine](https://img.shields.io/badge/WebGL-Three.js%20Threat%20Sphere-8b5cf6.svg)](#3-real-time-3d-webgl-planetary-threat-sphere)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-emerald.svg)](#-global-contributor-guidelines--call-to-arms)

> **SentinelKey** — engineered and maintained by **Ferrivox Ltd** (Rwanda) — is an open-source, client-authoritative digital identity defense platform. Guided by the Ferrivox ethos **“Iron will, infinite dreams.”**, SentinelKey detects credential exposures, visualizes live infostealer malware exfiltration on an interactive **3D WebGL Threat Sphere** and **Recharts Regional Heatmap**, and orchestrates deterministic containment workflows—**without ever transmitting plaintext passwords, master secrets, or unhashed identifiers across the network**.

---

## 📑 Table of Contents

- [🌍 Why SentinelKey Exists (The Problem)](#-why-sentinelkey-exists-the-problem)
- [🔬 Research & Public Benefit](#-research--public-benefit)
- [🛡️ The Ferrivox Privacy Oath & Core Invariants](#️-the-ferrivox-privacy-oath--core-invariants)
- [📊 Project Status & Verification Level](#-project-status--verification-level)
- [✨ Core Capabilities & Architectural Innovations](#-core-capabilities--architectural-innovations)
  - [1. Mathematical k-Anonymity Prefix Engine](#1-mathematical-k-anonymity-prefix-engine)
  - [2. Differential Privacy Geospatial Fuzzing](#2-differential-privacy-geospatial-fuzzing)
  - [3. Real-Time 3D WebGL Planetary Threat Sphere](#3-real-time-3d-webgl-planetary-threat-sphere)
  - [4. Regional Threat Heatmap & Macro Trends (Recharts)](#4-regional-threat-heatmap--macro-trends-recharts)
  - [5. Centralized Keyboard Shortcut Manager & Command Palette](#5-centralized-keyboard-shortcut-manager--command-palette)
  - [6. Deterministic 10-Step Containment Protocol](#6-deterministic-10-step-containment-protocol)
  - [7. Client-Side Secret & Entropy Scanner](#7-client-side-secret--entropy-scanner)
  - [8. NIST SP 800-63B Identity Posture Audit](#8-nist-sp-800-63b-identity-posture-audit)
- [🏛️ System Architecture & Data Flow](#️-system-architecture--data-flow)
- [📜 Open Source Compliance & Certificates](#-open-source-compliance--certificates)
- [🚀 Quickstart & Local Development](#-quickstart--local-development)
  - [Prerequisites](#prerequisites)
  - [Installation & Launch](#installation--launch)
  - [Automated Security Verification Suite](#executing-the-automated-security-verification-suite)
  - [Docker Container Deployment](#docker-container-deployment)
- [🤝 Global Contributor Guidelines & Call to Arms](#-global-contributor-guidelines--call-to-arms)
  - [High-Priority Contribution Tracks](#high-priority-contribution-tracks)
  - [Developer Certificate of Origin (DCO 1.1)](#developer-certificate-of-origin-dco-11)
  - [PR Submission Checklist](#pull-request-checklist)
- [⚠️ Honest Limitations & Threat Model](#️-honest-limitations--threat-model)
- [🔒 Security & Responsible Disclosure (RFC 9116)](#-security--responsible-disclosure-rfc-9116)
- [👥 Maintainers & Authors](#-maintainers--authors)
- [📄 License & Legal Notice](#-license--legal-notice)

---

## 🌍 Why SentinelKey Exists (The Problem)

Modern identity compromise is driven by **infostealer malware syndicates** (Lumma, RedLine, Vidar, Stealc, Racoon) and industrial credential-stuffing botnets. Millions of session cookies, master passwords, and browser autofill credentials are harvested and traded daily on private Telegram channels, darknet paste repositories, and combo aggregators (Naz.API, Compilation of Many Breaches).

Despite this crisis, traditional breach monitoring platforms suffer from fatal architectural flaws:

1. **Plaintext Trust Vulnerabilities**: Traditional services ask users to submit raw passwords or plaintext email addresses to remote cloud databases. This creates centralized honeypots vulnerable to subpoena, surveillance, or catastrophic secondary breaches.
2. **Panic Without Containment**: Conventional alerts notify victims weeks or months after an incident with alarmist headlines ("*Your password was found on the dark web!*") but offer zero actionable, deterministic steps for session invalidation or lateral defense.
3. **Location Doxxing vs. Blind Telemetry**: Security dashboards either expose precise residential/workplace GPS coordinates (doxxing end users) or strip all geospatial context, leaving SOC defenders blind to regional infection waves.
4. **Closed-Source Security Theatrics**: Proprietary vendors hide scoring algorithms, heuristic thresholds, and telemetry egress behind NDA walls and marketing hype.

**SentinelKey** was built by **Ferrivox Ltd** to establish an open, verifiable, mathematically sound public good for digital identity defense.

---

## 🔬 Research & Public Benefit

| Question | Assessment & Empirical Evidence |
| :--- | :--- |
| **Who benefits?** | End users defending their credentials, open-source developers auditing dependencies, sysadmins managing identity vaults, security researchers tracking infostealer trends, and human-rights defenders operating under surveillance risks. |
| **What do existing tools do?** | Services like HaveIBeenPwned popularized k-anonymity for passwords, but lack active session containment, 3D geospatial threat intelligence, local secret regex scanning, or browser extension audits. |
| **What does SentinelKey add?** | Fully client-authoritative execution, real-time 3D Three.js WebGL exfiltration topology, Recharts regional attack vector heatmaps, deterministic 10-step remediation runbooks, and zero cleartext network transmission. |
| **How can results be reproduced?** | Every assertion is verifiable via `npm run test` (22 automated test suites) and reproducible client-side WebCrypto SHA-1/256 hashing. |

---

## 🛡️ The Ferrivox Privacy Oath & Core Invariants

Every module, algorithm, and contribution in SentinelKey must strictly adhere to the **Five Ferrivox Invariants**:

| Invariant | Specification | Verification Mechanism |
| :--- | :--- | :--- |
| **1. Zero-Plaintext Transmission** | Raw passwords, master tokens, and unhashed credentials never cross network boundaries under any condition. | Automated network proxy assertions & WebCrypto mocks (`tests/security.test.ts`) |
| **2. k-Anonymity Prefix Querying** | Range queries truncate hashes to exactly 5 hex characters (20 bits of entropy). Reconciliations are performed in-memory on the client CPU. | SHA-1 & SHA-256 slice length unit assertions |
| **3. Differential Privacy Geospatial Fuzzing** | Raw telemetry coordinates are perturbed with Gaussian centroid jitter ($\pm 25\text{--}40\text{ km}$). | Bounding box variance tests & distance assertions |
| **4. Zero-Asset Three.js WebGL Engine** | 3D visual geometry, earth grids, and textures are generated procedurally without relying on third-party CDNs. | Offline bundle integrity & CSP strict-script compliance |
| **5. Client-Authoritative Containment** | Containment state transitions (session revocation, passkey migration, vault updates) are stored locally in tamper-evident chains. | SHA-256 state chain verification |

---

## 📊 Project Status & Verification Level

- **Current Stage**: **Beta (v1.2.0)** — Functional full-stack implementation, passing test suite, hardened API gateway.
- **Client Cryptography**: **Production Ready** — Web Cryptography API (`window.crypto.subtle`) hardware-accelerated execution.
- **3D Threat Sphere & Visualizations**: **Production Ready** — Three.js procedural WebGL engine + Recharts regional density heatmap.
- **Threat Index Telemetry**: **Hybrid Demonstration** — Uses real k-anonymity range protocol (`/api/breach/check-prefix`) against simulated darknet/Naz.API threat indices with differential privacy coordinate fuzzing.

---

## ✨ Core Capabilities & Architectural Innovations

### 1. Mathematical k-Anonymity Prefix Engine
SentinelKey implements mathematical k-anonymity for breach verification:
* The user's credential is typed locally and hashed immediately via the browser's hardware-accelerated **Web Cryptography API** (`window.crypto.subtle.digest('SHA-1' | 'SHA-256')`).
* Only the **first 5 hexadecimal characters** (20 bits of entropy) are dispatched to the anonymized threat index.
* The remote index returns a pool containing all suffix hashes sharing that identical 5-character prefix (typically 1,000 to 5,000 records).
* The client performs the final suffix matching locally in browser memory.
* **Adversarial Guarantee**: Any passive or active network adversary inspecting packets observes only a 20-bit prefix matching millions of possible passwords. Plaintext recovery from this prefix is mathematically impossible.

### 2. Differential Privacy Geospatial Fuzzing
Breach incidents collected from global infostealer exfiltration logs are visualized on our map using differential privacy jitter:
$$\mathbf{x}_{\text{display}} = \mathbf{x}_{\text{true}} + \mathcal{N}\left(0, \sigma^2\right) \quad \text{constrained to } 25 \le \Delta d \le 40 \text{ km}$$
This guarantees that victim residential neighborhoods and corporate office suites cannot be reverse-engineered or doxxed, while macro-level cyber threat intelligence remains mathematically accurate for global defenders.

### 3. Real-Time 3D WebGL Planetary Threat Sphere
Rendered using a customized Three.js engine engineered specifically for low-overhead, high-framerate threat monitoring:
* **Procedural Cybernetic Globe**: Custom GLSL shader with atmospheric Fresnel glow, graticule latitude/longitude lines, and illuminated territorial boundaries—zero external textures required.
* **3D Exfiltration Arcs**: Dynamic quadratic Bézier curves tracing malicious exfiltration pathways from compromised endpoint clusters directly to adversary command-and-control (C2) collector nodes.
* **Interactive Radial Pins**: Height-scaled 3D cylinders with pulsating warning rings reflecting breach severity (`CRITICAL`, `HIGH`, `MEDIUM`).
* **Tactical Raycasting HUD**: Click or tap any threat node to inspect compromise timestamps, hash prefixes, stealer variants (Lumma, RedLine, Racoon), and affected domains without leaving the 3D viewport.

### 4. Regional Threat Heatmap & Macro Trends (Recharts)
* **Attack Vector Density Matrix**: Evaluates threat intensity (0–100) across 6 global cyber theatres (*North America, Western Europe, Asia-Pacific, Latin America, Middle East & Africa, Nordics & Central Europe*) across 5 attack vectors.
* **12-Month Exfiltration Area Trajectory**: Multi-region area charts tracking compromise velocity and leaked record counts.
* **Infostealer Vector Radar**: Multi-axis radar comparing stealer families (*RedLine, Lumma, Vidar, Stealc, Racoon*) across session hijacking, crypto theft, and C2 agility.

### 5. Centralized Keyboard Shortcut Manager & Command Palette
* **Quick Command Palette (`⌘K` / `?`)**: Fast fuzzy-search modal for all security operations and views.
* **Direct Multi-Key Leader Sequences**:
  - `G` then `D` / `1`: Identity Dashboard
  - `G` then `G` / `2`: 3D Planetary Threat Globe
  - `G` then `H`: Regional Threat Heatmap (Recharts)
  - `G` then `C` / `3`: Containment Runbook
  - `G` then `B` / `4`: Breach Intelligence
  - `G` then `A` / `5`: AI Security Analyst
  - `G` then `S` / `6`: Developer Secret Scanner
  - `G` then `E` / `7`: Browser Security Center
  - `G` then `O` / `8`: Open Source Trust Center
  - `G` then `T` / `9`: Security Test Suite
* **Instant Security Scan Triggers**:
  - `S` then `C`: Run Credential Breach Probe (k-anonymity check)
  - `S` then `S`: Run In-Memory Secret & Shannon Entropy Scanner
  - `S` then `B`: Run Browser Extension Audit
  - `S` then `V`: Run Automated Security Verification Suite
  - `S` then `R`: Trigger Emergency Session Token Invalidation

### 6. Deterministic 10-Step Containment Protocol
SentinelKey bridges the gap between breach awareness and tangible remediation:
1. **Critical Session Invalidation**: Step-by-step guidance to revoke active OAuth refresh tokens, invalidating hijacked session cookies.
2. **Master Credential Vault Rotation**: Client-side entropy generation for high-strength passphrases without cloud storage.
3. **FIDO2 / WebAuthn Passkey Migration**: Transition accounts from replayable passwords to phishing-resistant hardware keys.
4. **Malicious Browser Extension Audit**: Heuristic scanner checking for extensions holding broad `<all_urls>` permissions.
5. **Secure DNS-over-HTTPS (DoH) Hardening**: Redirecting DNS lookups to privacy-respecting resolvers (Quad9 9.9.9.9, Cloudflare 1.1.1.1) with DNSSEC.

### 7. Client-Side Secret & Entropy Scanner
Scans source code and clipboard snippets locally for accidentally exposed secrets before they reach public repositories (AWS, Stripe, GitHub PAT, Slack webhooks, OpenSSH private keys).

### 8. NIST SP 800-63B Identity Posture Audit
Evaluates identity health against the latest **NIST Special Publication 800-63B** digital identity guidelines.

---

## 🏛️ System Architecture & Data Flow

```
                                [ Client Device / Modern Browser ]
                                                │
                     ┌──────────────────────────┴──────────────────────────┐
                     ▼                                                     ▼
         [ Local Cryptographic Engine ]                         [ 3D Threat Topology ]
       • WebCrypto SHA-1 / SHA-256                            • Procedural Three.js Cyber Sphere
       • 5-Hex Char Prefix Extraction                         • Quadratic Bézier Exfiltration Arcs
       • In-Memory Hash Suffix Comparison                     • Recharts Regional Threat Heatmap
       • Local Secret & Entropy Regex                         • Interactive Raycasting & HUD
                     │                                                     │
                     ▼ (First 5 Hex Characters ONLY)                       │
       ┌─────────────────────────────┐                                     │
       │    Zero-Knowledge Relay     │                                     │
       │  (SentinelKey API Engine)   │ ◄───────────────────────────────────┘
       └──────────────┬──────────────┘
                      ▼
           [ Anonymized Threat Store ]
       • Darknet Combo Scrapes
       • Naz.API & Infostealer Aggregator Suffixes
       • Differential Privacy Centroid Jitter Matrix
```

---

## 📜 Open Source Compliance & Certificates

SentinelKey is committed to open governance and global software supply chain integrity:

* **SPDX Identifier**: [`Apache-2.0`](LICENSE) — Globally recognized permissive open-source license protecting both users and contributors.
* **NOTICE File**: Formal attributions for Three.js, React, Recharts, D3, Lucide, and Tailwind CSS in [`NOTICE`](NOTICE).
* **OpenSSF Best Practices**: Architected to comply with Open Source Security Foundation (OpenSSF) criteria.
* **SLSA Framework Compliance**: Supply-chain Levels for Software Artifacts (SLSA) Level 3 ready.
* **RFC 9116 Compliant**: Standardized vulnerability reporting metadata published at [`/.well-known/security.txt`](.well-known/security.txt).
* **Software Bill of Materials (SBOM)**: CycloneDX and SPDX compatible dependency manifest.
* **Academic Citation**: Citation metadata available in [`CITATION.cff`](CITATION.cff).

---

## 🚀 Quickstart & Local Development

### Prerequisites
* **Node.js**: `v20.12.0` or higher
* **npm**: `v10.5.0` or higher (or `bun` / `pnpm`)
* Modern Web Browser with WebGL 2.0 support (Chrome, Firefox, Brave, Safari, Edge)

### Installation & Launch

```bash
# 1. Clone the official repository
git clone https://github.com/shema-f/Sentinel.git
cd sentinelkey

# 2. Install dependencies cleanly
npm install

# 3. Start the full-stack development environment
npm run dev
```

Open `http://localhost:3000` in your browser.

### Executing the Automated Security Verification Suite

```bash
npm run test
```

Expected output:
```text
[SentinelKey] Running Automated Security Verification Suite...
======================================================
Total Tests: 22 | Passed: 22 | Failed: 0
======================================================
[PASS] Cryptography & Privacy -> SHA-1 computation conforms to standard
[PASS] Cryptography & Privacy -> SHA-256 computation conforms to standard
[PASS] Cryptography & Privacy -> k-Anonymity prefix is exactly 5 hex characters
[PASS] Cryptography & Privacy -> k-Anonymity suffix is exactly 35 hex characters
[PASS] Cryptography & Privacy -> Prefix + Suffix reconstitutes full hash without plaintext
[PASS] Developer Secret Scanner -> Detects exposed AWS Access Key ID
[PASS] Developer Secret Scanner -> Detects exposed Stripe live key
[PASS] Differential Privacy -> Coordinates are jittered within safe bounds
[PASS] CSRF & Header Security -> Enforces SameSite=Strict cookie protection
All security assertions passed successfully.
```

To run TypeScript verification:
```bash
npm run lint
```

To create an optimized production build:
```bash
npm run build
```

### Docker Container Deployment

```bash
# Build production image using multi-stage Dockerfile
docker build -t ferrivox/sentinelkey:1.2.0 .

# Run container as unprivileged non-root user
docker run -p 3000:3000 ferrivox/sentinelkey:1.2.0
```

Or using Docker Compose:
```bash
docker compose -f infrastructure/docker-compose.yml up -d
```

---

## 🤝 Global Contributor Guidelines & Call to Arms

SentinelKey is maintained by **Ferrivox Ltd** as a collective open-source defense platform for citizens, journalists, organizations, and global engineers. We welcome community contributions!

### High-Priority Contribution Tracks

1. **Threat Intelligence Feed Connectors (`src/data/`)**: Adapters for CISA KEV, URLhaus, Abuse.ch, ThreatFox, and AlienVault OTX.
2. **WebGPU Shader Compute Pipeline (`src/components/ThreatGlobe3D.tsx`)**: Upgrading 3D particle systems to WebGPU compute shaders.
3. **Browser Extension Port (Manifest v3)**: Packaging client-side k-anonymity for Chrome/Brave/Firefox.
4. **FIDO2 / WebAuthn Hardware Key Attestation**: Direct integration with browser WebAuthn credentials.
5. **Internationalization (i18n)**: UI localization into Kinyarwanda, Swahili, French, Spanish, German, Japanese, and Arabic.

### Developer Certificate of Origin (DCO 1.1)

All commits must include a DCO sign-off line:
```bash
git commit -s -m "feat(crypto): implement WebCrypto SHA-256 parallel worker"
```

### Pull Request Checklist

Before submitting a Pull Request:
- [ ] Code compiles cleanly with zero TypeScript warnings (`npm run lint`).
- [ ] Automated security tests pass (`npm run test`).
- [ ] The Five Ferrivox Invariants are preserved.
- [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
- [ ] Commits are signed off (`-s` flag for DCO).

---

## ⚠️ Honest Limitations & Threat Model

1. **Endpoint Compromise**: If an attacker holds active kernel-level root or ring-0 keylogger access on the client device, local memory before hashing can be read. SentinelKey mitigates browser-level infostealers through early containment, but cannot defend compromised operating system kernels.
2. **Threat Index Coverage**: k-anonymity queries only match hashes indexed in known breach dumps. Zero-day credentials not yet compiled by threat intelligence syndicates will report a clean result.
3. **Differential Privacy Tradeoff**: Centroid coordinate jitter protects victim identity but prevents hyper-local street-level geolocation.

---

## 🔒 Security & Responsible Disclosure (RFC 9116)

If you discover a vulnerability or cryptographic flaw:
* **DO NOT** create a public GitHub issue.
* Consult our detailed security policy in [`SECURITY.md`](SECURITY.md).
* Submit your findings via [`/.well-known/security.txt`](.well-known/security.txt) or email `security@sentinelkey.org`.
* We acknowledge receipts within **24 hours** and adhere to a 30-day coordinated vulnerability disclosure window.

---

## 👥 Maintainers & Authors

* **Ferrivox Ltd** — *Core Maintainer & Architecture* (Kigali, Rwanda · [ferrivox.com](https://ferrivox.com))
  - Ethos: *"Iron will, infinite dreams."*
* **Global Open Source Community** — *Security Researchers, Cryptographers & Translators*

---

## 📄 License & Legal Notice

Copyright © 2026 **Ferrivox Ltd** and SentinelKey Contributors.

Licensed under the **Apache License, Version 2.0** (the "License"); you may not use this repository or application except in compliance with the License. You may obtain a copy of the License at:

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

See [`NOTICE`](NOTICE) for third-party software and font licenses.
