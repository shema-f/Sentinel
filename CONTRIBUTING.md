# Contributing to SentinelKey

Thank you for your interest in contributing to **SentinelKey**!

SentinelKey is an open-source public good engineered and maintained by **Ferrivox Ltd**, a technology company based in Kigali, Rwanda. Guided by our company ethos **“Iron will, infinite dreams.”**, we are dedicated to building privacy-respecting, mathematically grounded security tools for developers, organizations, and citizens worldwide.

We welcome contributors from all backgrounds—software engineers, cryptographers, penetration testers, visual designers, technical writers, and translators.

---

## 🧭 The Five Ferrivox Invariants

Every pull request must strictly uphold these **unbreakable invariants**:

1. **Zero-Plaintext Invariant**: Plaintext passwords, raw API keys, or unhashed email addresses must NEVER be transmitted across the network, stored in remote databases, or logged in client telemetry.
2. **k-Anonymity Invariant**: Querying external breach databases must always use range queries of at least 20 bits of entropy truncation (e.g. 5-hex character SHA-1/256 prefix). In-memory reconciliation takes place on the client CPU.
3. **Differential Privacy Invariant**: All geospatial telemetry visualized on the 2D/3D map must apply randomized Gaussian centroid jitter ($\pm 25\text{--}40\text{ km}$) to protect residential/workplace identity.
4. **Zero-Asset Dependency in 3D WebGL**: Three.js components must generate textures procedurally or use vector geometry; never reference unhosted external assets or CDNs that could fail or leak user traffic.
5. **Honest Security Claims**: Never use marketing hyperbole such as "100% unhackable", "bulletproof", or "impossible to breach". Security is a defense-in-depth posture, not an absolute guarantee.

---

## 📜 Code of Conduct

All contributors and maintainers are expected to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any violations to `conduct@ferrivox.com`.

---

## 🛠️ Development Setup & Local Verification

1. **Fork and clone**:
   ```bash
   git clone https://github.com/<your-username>/sentinelkey.git
   cd sentinelkey
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run local dev server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to interact with the application.

4. **Run automated security verification suite & typechecks**:
   ```bash
   # Executes the 22 automated security and integrity assertions
   npm run test

   # Runs strict TypeScript typechecks with zero tolerance for warnings
   npm run lint

   # Verifies production build bundle
   npm run build
   ```

---

## 🏷️ Commit Message Conventions & DCO Sign-off

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. Every commit must also include a Developer Certificate of Origin sign-off (`-s` flag):

```bash
git commit -s -m "feat(heatmaps): add Recharts regional incident density matrix"
```

Common commit prefixes:
* `feat:` A new user-facing feature or enhancement
* `fix:` A bug fix
* `security:` A security patch or cryptographic hardening change
* `perf:` A performance optimization (e.g. Three.js geometry or Recharts render pass)
* `docs:` Documentation improvements
* `test:` Adding or refining automated tests
* `refactor:` Code refactoring without changing observable behavior

---

## 🧪 Pull Request Checklist

Before opening a pull request, ensure:
- [ ] Code compiles without warnings (`npm run lint`).
- [ ] Automated security tests pass (`npm run test`).
- [ ] Production build succeeds (`npm run build`).
- [ ] No secrets, keys, or private environment files are included in commit history.
- [ ] New features include relevant unit or integration tests in `tests/`.
- [ ] The Five Ferrivox Invariants are preserved.
- [ ] Commits are signed off (`-s` flag for DCO 1.1).
- [ ] Pull request description links to the related issue (e.g. `Fixes #42`).

---

## 🎖️ Contributor Recognition

All contributors are prominently recognized in:
* The in-app **Open Source Community Hub**.
* The repository release notes and GitHub contributor graph.
* Coordinated security vulnerability reporters are inducted into the **SentinelKey Hall of Fame**.
