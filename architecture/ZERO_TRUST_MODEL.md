# SentinelKey — Zero-Trust Architecture Specification
**Standard:** NIST SP 800-207 Zero Trust Architecture

---

## 1. Zero-Trust Pillars

1. **Explicit Verification Always:**  
   Every request—whether from a browser client, native desktop agent, or automated integration—is authenticated, authorized within context, and cryptographically verified.
2. **Least Privilege Enforcement:**  
   Role-Based Access Control (RBAC) grants minimal required operational rights. Security Auditors have read-only visibility into posture and logs; Members manage only their personal endpoints; Admins manage organizational devices.
3. **Assume Breach:**  
   The platform operates under the active assumption that client endpoints, browser extensions, or peripheral networks may be untrusted or compromised. Defensive containment workflows are accessible in 1 click.
4. **Data Isolation & Encryption:**  
   - In Transit: TLS 1.3 with strict PFS (Perfect Forward Secrecy) cipher suites.
   - At Rest: AES-256-GCM for relational metadata and tenant data.
   - Zero-Knowledge Client Boundaries: Plaintext credentials never touch SentinelKey network boundaries.
5. **Short-Lived Ephemeral Credentials:**  
   Session tokens carry a maximum 15-minute TTL with automated rotating refresh tokens stored in secure, `HttpOnly`, `SameSite=Strict` cookies.

---

## 2. Cryptographic Protocols & Standards

| Component | Standard / Algorithm | Rationale |
|---|---|---|
| User Password Hashing | Argon2id (m=64MB, t=3, p=4) | High resistance to GPU/ASIC cracking and side-channel timing attacks |
| Symmetric Data Encryption | AES-256-GCM / ChaCha20-Poly1305 | Authenticated Encryption with Associated Data (AEAD) |
| Asymmetric Identity Keys | Ed25519 (Signatures) & X25519 (Key Exchange) | High performance, constant-time, free from invalid curve attacks |
| Hardware Security Keys | FIDO2 / WebAuthn (CTAP2) | Phishing-resistant biometric / hardware cryptographic tokens |
| Hash Functions | SHA-256 / SHA-512 / BLAKE3 | Cryptographic message integrity and k-anonymity prefixes |
