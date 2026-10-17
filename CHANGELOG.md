# Changelog

All notable changes to **SentinelKey** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-10-17

### Added
- **Regional Threat Heatmap (Recharts)**: Multi-theatre attack vector density matrix and 12-month exfiltration trajectory charts mapping 6 global cyber theatres.
- **Centralized Keyboard Shortcut Manager & Command Palette (`⌘K` / `?`)**:
  - Full keyboard-driven navigation across all views (e.g. `G` then `D` for Dashboard, `G` then `G` for 3D Threat Globe).
  - Instant security scan execution hotkeys:
    - `S` then `C`: Client-Side k-Anonymity Credential Breach Probe
    - `S` then `S`: Local In-Memory Secret & Shannon Entropy Scanner
    - `S` then `B`: Browser Extension Risk Audit
    - `S` then `V`: 22-Test Security Verification Suite
    - `S` then `R`: Emergency Session Token Invalidation
- **Apache-2.0 `NOTICE` and `CITATION.cff`**: Formal open-source attribution and academic citation metadata.
- **Ferrivox Open-Source & GitHub Excellence Standard**: Complete GitHub community health suite, issue templates, PR workflow, and automated CI pipeline.

### Changed
- Modernized user interface with zero-pill discipline, unboxed metadata tags, and obsidian dark glass styling.
- Standardized package metadata under `@ferrivox/sentinelkey` / `sentinelkey` v1.2.0.
- Synchronized brand attributions across `Navbar`, `Footer`, `LandingPage`, `OpenSourceHubView`, and documentation to credit **Ferrivox Ltd** (*"Iron will, infinite dreams."*).

---

## [1.1.0] - 2026-09-20

### Added
- **Interactive 3D WebGL Threat Sphere (Three.js)**:
  - Procedural cybernetic Earth globe with zero external asset dependencies.
  - Radial shockwave pins reflecting breach severity (`CRITICAL`, `HIGH`, `MEDIUM`).
  - Dynamic quadratic Bézier arcs tracing exfiltration trajectories from infected endpoint clusters to C2 collector nodes.
  - Tactical raycasting HUD and theme switcher (Obsidian, Matrix, Heatmap).
- **Deterministic 10-Step Containment Protocol**: Interactive playbooks for OAuth session revocation, passkey migration, and DNS over HTTPS hardening.
- **Automated Security Verification Suite (`tests/security.test.ts`)**: 22 automated assertions covering cryptographic boundaries, k-anonymity ranges, secret scanners, XSS sanitizers, and RBAC hierarchy.

---

## [1.0.0] - 2026-08-15

### Added
- Initial public open-source release of **SentinelKey** by **Ferrivox Ltd**.
- Client-authoritative k-anonymity password hash verification using Web Cryptography API (`SHA-1` / `SHA-256`) with 20-bit prefix truncation.
- Differential privacy geospatial jitter algorithm ($\pm 25\text{--}40\text{ km}$).
- Client-side secret scanner for AWS, Stripe, GitHub, and private keys.
- NIST SP 800-63B identity posture scoring engine.
- Full-stack Express API gateway and mock threat telemetry index.
