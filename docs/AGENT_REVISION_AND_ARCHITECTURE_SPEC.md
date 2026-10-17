# SentinelKey — Full Architecture Specification & Agent Revision Blueprint
**Document Version:** 2.0.0-LTS  
**Classification:** Defensive Cybersecurity System Architecture & Engineering Standard  
**Maintainer:** Ferrivox Ltd (*"Iron will, infinite dreams"*)  
**Target Audience:** Autonomous Coding Agents, Systems Architects, Application Security Engineers, Frontend Developers

---

## Executive Summary

SentinelKey is an open-source, privacy-first digital identity defense platform, real-time 3D threat topology viewer, and automated compromise response center. The core philosophy is **Zero-Plaintext Credential Transmission**: no user passwords, master secrets, or session cookies are ever sent in plaintext across the wire. 

This document provides a comprehensive architectural breakdown and an actionable revision blueprint for future agents and engineers to modify, enhance, and scale the application—including granular recommendations for the user interface (UI), backend services, cryptographic primitives, and testing infrastructure.

---

## 1. System Architecture & Topology

```
+---------------------------------------------------------------------------------------------------+
|                                        CLIENT TIER (React 19 + Vite)                              |
|                                                                                                   |
|  +--------------------+  +----------------------+  +---------------------+  +------------------+  |
|  | Identity Dashboard |  | Incident Response    |  | Threat Globe (3D)   |  | AI Sec Analyst   |  |
|  | - Posture Scoring  |  | - 10-Step Pipeline   |  | - Three.js WebGL    |  | - Gemini Flash   |  |
|  | - Risk Findings    |  | - Forensic Reports   |  | - Regional Heatmap  |  | - Grounded Prompt|  |
|  +---------+----------+  +----------+-----------+  +----------+----------+  +--------+---------+  |
|            |                        |                         |                      |            |
|            +------------------------+------------+------------+----------------------+            |
|                                                  |                                                |
|                                +-----------------v------------------+                             |
|                                | Centralized Keyboard Shortcut Mgr  |                             |
|                                | (Leader keys: G->D, S->S, Command) |                             |
|                                +-----------------+------------------+                             |
|                                                  |                                                |
|                                +-----------------v------------------+                             |
|                                | Local Crypto Engine (WebCrypto)    |                             |
|                                | - k-Anonymity SHA-1/256 Slicing    |                             |
|                                | - Local Secret Scanning (RegEx)    |                             |
|                                | - Posture Assessment Calculator    |                             |
|                                +-----------------+------------------+                             |
+--------------------------------------------------|------------------------------------------------+
                                                   | [TLS 1.3 / HTTPS]
                                                   | [k-Anonymity Prefixes Only (5 Hex Chars)]
                                                   v
+---------------------------------------------------------------------------------------------------+
|                                     SERVER GATEWAY (server.ts / Express)                          |
|                                                                                                   |
|  +---------------------------------------------------------------------------------------------+  |
|  | Security Middlewares: Strict Headers, CSP, RFC 9116 (.well-known/security.txt), Framing Perm |  |
|  +----------------------------------------------+----------------------------------------------+  |
|                                                 |                                                 |
|  +----------------------------------------------v----------------------------------------------+  |
|  | REST API Endpoints:                                                                         |  |
|  | - /api/health (Service status & cryptographic engine metadata)                               |  |
|  | - /api/auth/session & /api/auth/revoke-all-sessions (Zero-Trust 15-min rolling session)       |  |
|  | - /api/security/posture & /api/security/findings (RBAC-filtered security findings)          |  |
|  | - /api/breach/check-prefix (Zero-Plaintext Range Query: returns candidate hash suffixes)     |  |
|  | - /api/incident/status & /api/incident/step (Deterministic incident synchronization)        |  |
|  | - /api/analyst/chat (Server-side Gemini 3.8 Flash via @google/genai SDK)                    |  |
|  +----------------------------------------------+----------------------------------------------+  |
|                                                 |                                                 |
|          +--------------------------------------+--------------------------------------+          |
|          |                                                                             |          |
|  +-------v---------------------+                                       +---------------v-------+  |
|  | Google GenAI (@google/genai)|                                       | Storage & State Store |  |
|  | Model: gemini-3.8-flash     |                                       | In-memory incident    |  |
|  | Strict Grounding & Defense  |                                       | store & hash tables   |  |
|  +-----------------------------+                                       +-----------------------+  |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Frontend UI/UX Architecture

### 2.1 Component Tree & Navigation Hierarchy

The application follows a modular, state-driven view routing system centered in `src/App.tsx`:

- **Global Navigation (`src/components/Navbar.tsx`)**:
  - Displays identity brand: **SentinelKey** + Ferrivox badge.
  - Live Security Posture Pill with dynamic grade indicator (A, B+, C, Critical) and animated heartbeat.
  - Active incident counter with pulsing alert indicator.
  - View switcher (Dashboard, Response Center, Threat Map, Browser, AI Analyst, etc.).
  - Role switcher dropdown (`owner`, `security_admin`, `admin`, `member`, `auditor`) enforcing UI RBAC.
  - Tactical Shortcuts launcher button (`⌘K` badge).
  - Mobile responsive slide-over drawer.

- **Primary Views (`src/components/`)**:
  1. `LandingPage.tsx`: High-impact landing page explaining the zero-plaintext mission, k-anonymity protocol, and feature matrix.
  2. `IdentityDashboard.tsx`: Primary command center containing overall score gauge, category breakdowns, prioritized risk findings, and quick scan triggers.
  3. `CompromiseResponseCenter.tsx`: Step-by-step incident containment wizard ("Secure My Accounts") with forensic checklist and audit log export.
  4. `GlobalBreachMapView.tsx`: Interactive multi-view threat topology switching between 3D WebGL Globe and Regional Threat Heatmap.
  5. `ThreatGlobe3D.tsx`: Three.js WebGL interactive sphere displaying real-time geographic incident pings, arc connections, and breach coordinates.
  6. `RegionalThreatHeatmap.tsx`: Recharts-powered data visualization mapping global incidents by geographic theater, attack vectors, and timeline trends.
  7. `BrowserSecurityCenter.tsx`: Deep-dive audit into Chromium/Firefox/Brave settings, extension permissions, and third-party cookie partitioning.
  8. `BreachIntelligenceView.tsx`: Client-side k-anonymity hash checker with live breach database simulations.
  9. `AiSecurityAnalyst.tsx`: Server-backed AI analyst console powered by Gemini 3.8 Flash with structured response parsing.
  10. `SecurityGraphView.tsx`: Interactive SVG node-link graph mapping user identity assets, credentials, devices, and attack vectors.
  11. `SecurityTimelineView.tsx`: Chronological immutable event-sourcing ledger of identity audits and security actions.
  12. `DeveloperSecurityView.tsx`: Local secret scanner testing code snippets for exposed AWS, Stripe, GitHub, and private keys.
  13. `FamilySecurityView.tsx`: Compartmentalized family account overview preserving privacy between individual members.
  14. `BusinessSecurityView.tsx`: Enterprise fleet posture, device compliance enforcement, and security policies.
  15. `TestRunnerView.tsx`: In-browser test runner executing unit and security tests with pass/fail visualization.
  16. `OpenSourceHubView.tsx`: Community governance, architecture specs, open RFCs, and GitHub contribution guidelines.
  17. `KeyboardShortcutManager.tsx`: Centralized hotkey listener supporting multi-key leader chords (`g d`, `s s`, `⌘k`) and interactive command palette.

---

## 3. Cryptographic & Security Architecture

### 3.1 Zero-Plaintext k-Anonymity Model
1. **Hash Generation:** When a user checks a credential, the client browser computes:
   $$\text{Hash} = \text{SHA-1}(\text{credential})$$
2. **Prefix Transmission:** Only the first 5 hexadecimal characters ($\text{Prefix} = \text{Hash}[0..4]$) are transmitted to `/api/breach/check-prefix`.
3. **Candidate Range Delivery:** The server returns all known breached hash suffixes matching that 5-character prefix (typically 50–500 suffixes).
4. **Client-Side Constant-Time Match:** The client verifies locally whether $\text{Hash}[5..39]$ matches any candidate suffix. The server never discovers what credential was queried.

### 3.2 Local Secret Entropy Engine
- Located in `src/lib/cryptoUtils.ts`.
- Executes regex patterns locally on client memory without network transmission:
  - AWS Access Keys (`AKIA[0-9A-Z]{16}`)
  - Stripe Secret Keys (`sk_(live|test)_[0-9a-zA-Z]{24,}`)
  - GitHub Personal Access Tokens (`gh[pousr]_[A-Za-z0-9_]{36,}`)
  - Generic Private Keys (`-----BEGIN (RSA|EC|OPENSSH) PRIVATE KEY-----`)
  - Slack Tokens, JWT tokens, and high-entropy database connection strings.

---

## 4. Comprehensive Recommendations for the Agent / Next Engineer

To systematically revise and elevate SentinelKey, execute improvements across the following prioritized domains:

### Priority 1: UI & Visual Polish (Immediate High-Impact)

1. **Dashboard Posture Gauge Modernization (`IdentityDashboard.tsx`)**:
   - *Current state:* Linear progress bar and static badge.
   - *Recommendation:* Replace with an animated circular SVG or Canvas gauge showing the 0–100 score with smooth CSS needle animations and color transitions (Green for 85+, Amber for 65–84, Red for <65).
   - *Add:* "What changed since yesterday" micro-diff indicator (+4 pts from resolved MFA).

2. **Unified Action Breadcrumbs & View Navigation (`App.tsx` & `Navbar.tsx`)**:
   - *Current state:* Navigation switches root views directly.
   - *Recommendation:* Add an interactive breadcrumb trail (e.g., `Home > Threat Topology > 3D Globe`) and back button navigation for nested views (e.g., jumping from a risk finding to the AI Analyst and back).

3. **Risk Finding Batch Actions & Filter Bar (`IdentityDashboard.tsx`)**:
   - *Current state:* Findings can only be resolved one by one.
   - *Recommendation:* Add multi-select checkboxes allowing users to `[Resolve All Selected]` or `[Export Filtered Findings]`. Add instant category pill filters: `All (6)`, `Credentials (2)`, `Browser (2)`, `Network (2)`.

4. **Forensic Report Generator Export (`CompromiseResponseCenter.tsx`)**:
   - *Current state:* Shows steps and an export button that triggers an in-browser JSON/text modal.
   - *Recommendation:* Implement an export that generates a formatted printable HTML/PDF executive incident summary with cryptographic timestamp and SHA-256 signature block.

5. **Threat Globe Camera Bookmarks (`ThreatGlobe3D.tsx`)**:
   - *Current state:* Free rotation with mouse/touch drag.
   - *Recommendation:* Add one-click region focus buttons: `[North America]`, `[Europe/Africa]`, `[Asia-Pacific]` that interpolate the Three.js camera position smoothly using spherical coordinates ($r, \theta, \phi$).

6. **Syntax Highlighting in Secret Scanner (`DeveloperSecurityView.tsx`)**:
   - *Current state:* Standard monospace `<textarea>` with text feedback.
   - *Recommendation:* Add a side-by-side or overlay gutter with red error underlines highlighting the exact offset where secrets were detected, with an instant `[Redact & Clean]` copy button.

7. **Keyboard Shortcut Visual Cheat Sheet Modal (`KeyboardShortcutManager.tsx`)**:
   - *Current state:* Command palette with search input.
   - *Recommendation:* Add a quick tab toggle `[Commands]` vs `[Keyboard Cheatsheet]` showing grouped keys (`Navigation`, `Scans`, `Incident Response`) in a grid for high accessibility.

---

### Priority 2: State Persistence & Data Hydration

1. **Persistent LocalStorage State Synchronization**:
   - *Current state:* Findings and incident steps reset when the browser tab is refreshed unless synced.
   - *Recommendation:* Add a resilient `useSecurityState` hook that synchronizes `findings`, `incidentSteps`, and `userPreferences` to `localStorage` with a versioned schema (`sentinelkey_v1_state`).

2. **Real-Time Event Stream (Server-Sent Events)**:
   - *Current state:* Event log is initialized from static initial data.
   - *Recommendation:* Mount an `/api/events/stream` SSE endpoint in `server.ts` that broadcasts periodic simulated threat telemetry (e.g., new credential breach alerts, DoH status changes) to keep the dashboard live.

---

### Priority 3: Accessibility (a11y) & Performance

1. **WCAG 2.1 AA Compliance & Keyboard Focus Rings**:
   - Ensure all interactive buttons, tabs, and hotkey items have visible `focus-visible:ring-2 focus-visible:ring-emerald-500` outlines.
   - Provide `aria-expanded` and `aria-controls` on mobile menus and role dropdowns.
   - Provide accessible text alternatives (`aria-label`) for Three.js canvas and SVG graph visualizations.

2. **Three.js WebGL Fallback**:
   - In low-power environments or virtual machines without WebGL hardware acceleration, detect `WebGLRenderingContext` failure and gracefully fallback to the `RegionalThreatHeatmap` Recharts view.

---

### Priority 4: Security Verification & Testing

1. **Expand Security Unit Test Suite (`tests/security.test.ts`)**:
   - Add automated test cases for:
     - Constant-time hash suffix comparison.
     - Role-Based Access Control permission matrix (verifying Auditors cannot invoke session revocation).
     - k-Anonymity prefix edge cases (boundary length, uppercase normalization).
     - Strict Content Security Policy header verification.

---

## 5. Agent Verification Checklist

When making any changes to this codebase, the agent must execute and pass:
1. `npm run lint` (or `tsc --noEmit`) — Zero type errors.
2. `compile_applet` (or `npm run build`) — Clean Vite production bundle.
3. `npm run test` (or `npx tsx tests/security.test.ts`) — All cryptographic and security assertions pass.
4. Verify HTTP 200 on `http://localhost:3000` via dev server check.
