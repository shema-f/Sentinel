## Description
<!-- Please include a concise summary of the change and which issue it fixes. -->

Fixes #(issue)

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Security hardening (cryptographic bound enforcement, CSP headers)
- [ ] Performance optimization (Three.js WebGL / Recharts data handling)
- [ ] Documentation update

## Ferrivox Architectural Invariants Checklist
Every pull request must uphold the Five Ferrivox Invariants:
- [ ] **Zero-Plaintext Invariant**: No plaintext credentials, passwords, or raw tokens are sent over the network or logged.
- [ ] **k-Anonymity Invariant**: Query range truncation of at least 20 bits of entropy (5-hex char prefix).
- [ ] **Differential Privacy**: Coordinates perturbed with Gaussian centroid jitter ($\pm 25\text{--}40\text{ km}$).
- [ ] **Zero-Asset Dependency**: 3D geometries and shaders are procedural; no external unhosted CDN assets.
- [ ] **Client-Authoritative State**: Remediation actions recorded in tamper-evident chains.

## Quality & Verification
- [ ] Code compiles cleanly with zero TypeScript warnings (`npm run lint`).
- [ ] Automated security verification test suite passes (`npm run test`).
- [ ] Full production build succeeds (`npm run build`).
- [ ] I have signed off my commits using `git commit -s` (Developer Certificate of Origin 1.1).
- [ ] No secrets, keys, or private environment files are committed.
