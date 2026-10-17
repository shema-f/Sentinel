# SentinelKey — Visual Identity & Design System

## Design Philosophy: Technical Cybersecurity Command Center
Inspired by the precision, clarity, and authority of CrowdStrike, Cloudflare, Tailscale, 1Password, and Linear.
- **Atmosphere:** Dark-first, deep gunmetal `#090d16` and obsidian `#04070d` canvases. High contrast, technical, disciplined.
- **Anti-Slop Directives:**
  - NO purple-to-blue gradients, NO arbitrary neon glows, NO generic SaaS marketing verbs.
  - Cards have crisp `#1a2333` borders with 10px-12px radii.
  - Crisp typography: `Plus Jakarta Sans` for clean, readable UI hierarchy, and `JetBrains Mono` for hashes, keys, metrics, and security evidence.
- **Color Palette:**
  - Background: `#070a10` (Primary Deep Canvas), `#0c121e` (Card / Surface)
  - Borders: `#1a2638` (Default), `#2a3b55` (Active / Focus)
  - Primary Accent: `#00f0a8` (Sentinel Emerald / Safe Green)
  - Critical Alert: `#ff4757` (Critical Risk / Malicious indicator)
  - Warning / Elevated: `#ffa502` (High / Medium Attention)
  - Info / Shield: `#38bdf8` (Verified / Hardware / Cryptographic)
  - Text: `#f1f5f9` (Headings / Emphasized), `#94a3b8` (Secondary / Supporting), `#64748b` (Muted / Metadata)

## Component Standards
- Every risk finding uses the standard 5-part structure:
  1. `TITLE & SEVERITY BADGE`
  2. `WHAT HAPPENED`
  3. `WHY IT MATTERS`
  4. `EVIDENCE` (code/hash block with monospace font)
  5. `WHAT YOU SHOULD DO` + Action buttons (`[Fix Now]`, `[Ignore]`, `[Learn More]`)
