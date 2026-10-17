-- ============================================================================
-- SENTINELKEY PRODUCTION DATABASE SCHEMA (POSTGRESQL 16+)
-- Privacy-First Zero-Plaintext Digital Identity & Security Platform
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ORGANIZATIONS (Multi-tenancy & Business Security)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan_tier VARCHAR(50) NOT NULL DEFAULT 'business', -- 'free', 'pro', 'family', 'business'
    security_policy JSONB NOT NULL DEFAULT '{
        "require_mfa": true,
        "session_timeout_minutes": 30,
        "allowed_ip_ranges": [],
        "min_password_entropy": 65
    }',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. USERS (Consumers, Family members, Business staff)
-- Note: NO plaintext passwords, NO reversible credentials.
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Argon2id hash only
    display_name VARCHAR(150),
    role VARCHAR(50) NOT NULL DEFAULT 'member', -- 'owner', 'security_admin', 'admin', 'member', 'auditor'
    account_type VARCHAR(50) NOT NULL DEFAULT 'consumer', -- 'consumer', 'family_member', 'business'
    is_mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    mfa_type VARCHAR(50), -- 'webauthn_passkey', 'totp'
    public_key_identity TEXT, -- Ed25519 identity key
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'locked'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. DEVICES (Endpoint Inventory & Posture)
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_name VARCHAR(150) NOT NULL,
    device_type VARCHAR(50) NOT NULL, -- 'desktop', 'laptop', 'mobile', 'tablet'
    os_name VARCHAR(100) NOT NULL, -- 'Windows 11', 'macOS Sonoma', 'Ubuntu 24.04', 'iOS', 'Android'
    os_version VARCHAR(100),
    agent_version VARCHAR(50),
    hardware_uuid_hash VARCHAR(64) NOT NULL, -- SHA-256 of hardware identity
    tpm_enclave_status VARCHAR(50) DEFAULT 'unverified', -- 'verified_hardware', 'software_only', 'absent'
    disk_encryption_status BOOLEAN DEFAULT FALSE,
    firewall_enabled BOOLEAN DEFAULT TRUE,
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_trusted BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. BROWSER_INSTALLATIONS (Browser Security Center)
CREATE TABLE browser_installations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    browser_name VARCHAR(50) NOT NULL, -- 'Chrome', 'Edge', 'Brave', 'Firefox', 'Safari'
    browser_version VARCHAR(50) NOT NULL,
    doh_enabled BOOLEAN NOT NULL DEFAULT FALSE, -- DNS over HTTPS
    hsts_preload_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    cookie_partition_enabled BOOLEAN NOT NULL DEFAULT TRUE, -- CHIPS
    sandbox_isolation_level VARCHAR(50) DEFAULT 'strict',
    extensions_count INT NOT NULL DEFAULT 0,
    high_risk_extensions_count INT NOT NULL DEFAULT 0,
    last_audited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ACCOUNTS (Monitored Digital Identities - Email, Cloud, Financial, Social)
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_name VARCHAR(100) NOT NULL, -- 'Google', 'GitHub', 'AWS', 'Microsoft 365', 'Slack'
    service_category VARCHAR(50) NOT NULL, -- 'primary_email', 'developer', 'cloud', 'social', 'financial'
    account_identifier_hash VARCHAR(64) NOT NULL, -- SHA-256 of user handle or email
    display_identifier VARCHAR(150) NOT NULL, -- e.g. "alex***@gmail.com"
    auth_method VARCHAR(50) NOT NULL DEFAULT 'password', -- 'passkey', 'totp', 'password', 'sso'
    has_mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    exposure_status VARCHAR(50) NOT NULL DEFAULT 'clean', -- 'clean', 'suspected', 'compromised', 'remediated'
    last_password_rotation_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. RISK_FINDINGS (Empirical Evidence-Backed Posture Issues)
CREATE TABLE risk_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'
    affected_asset VARCHAR(150) NOT NULL, -- e.g. "Google Primary Account", "Chrome Browser on Mac"
    evidence JSONB NOT NULL, -- structured proof (e.g. {"breach_id": "Naz.API", "leak_date": "2024-01-15"})
    explanation TEXT NOT NULL, -- Plain language explanation
    recommended_action TEXT NOT NULL, -- Concrete remediation guidance
    remediation_status VARCHAR(50) NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'ignored'
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. BREACH_EVENTS (Privacy-Preserving k-Anonymity Intelligence)
CREATE TABLE breach_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name VARCHAR(150) NOT NULL, -- e.g. "ComboList2024", "ThirdPartySaaSDB"
    breach_date DATE NOT NULL,
    exposure_type VARCHAR(50) NOT NULL, -- 'confirmed_exposure', 'possible_exposure', 'informational', 'user_reported'
    data_classes TEXT[] NOT NULL, -- e.g. ['email', 'password_hash', 'ip_address']
    pwned_record_count BIGINT DEFAULT 0,
    description TEXT,
    severity VARCHAR(20) NOT NULL DEFAULT 'HIGH',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. INCIDENTS ("Secure My Accounts" Emergency Response Sessions)
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'contained', 'resolved', 'closed'
    severity VARCHAR(20) NOT NULL DEFAULT 'CRITICAL',
    trigger_source VARCHAR(100) NOT NULL, -- 'user_initiated', 'infostealer_alert', 'suspicious_session'
    containment_steps_completed INT NOT NULL DEFAULT 0,
    total_steps INT NOT NULL DEFAULT 10,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    contained_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ
);

-- 9. REMEDIATION_ACTIONS (Action items associated with an incident or finding)
CREATE TABLE remediation_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    risk_finding_id UUID REFERENCES risk_findings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    step_number INT NOT NULL, -- 1 to 10 for incident steps
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    evidence_notes TEXT
);

-- 10. SECURITY_EVENTS (Event Sourced Ledger of All Security State Changes)
CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL, -- 'new_device', 'login', 'security_alert', 'breach_detection', 'password_rotation', '2fa_enabled', 'session_revoked', 'api_key_rotated', 'malware_detection_indicator', 'recovery_action'
    severity VARCHAR(20) NOT NULL DEFAULT 'INFO',
    actor_id VARCHAR(100) NOT NULL, -- 'system', user_id, 'api_token'
    ip_address_hash VARCHAR(64), -- Hashed client IP (privacy-preserved)
    user_agent_category VARCHAR(100),
    event_payload JSONB NOT NULL DEFAULT '{}',
    hash_prev_event VARCHAR(64), -- Cryptographic tamper-evident hash chain
    event_hash VARCHAR(64) NOT NULL, -- SHA-256(prev_hash + timestamp + payload)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. AUDIT_LOGS (Compliance & Enterprise Access Tracking)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'user.invite', 'policy.update', 'incident.export', 'session.revoke'
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}',
    ip_address_hash VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. SUBSCRIPTIONS (Billing & Plan Tiers)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    plan_tier VARCHAR(50) NOT NULL, -- 'free', 'pro', 'family', 'business'
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'trialing', 'past_due', 'canceled'
    billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly', -- 'monthly', 'annual'
    stripe_customer_id VARCHAR(100),
    stripe_subscription_id VARCHAR(100),
    seats_purchased INT NOT NULL DEFAULT 1,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. NOTIFICATIONS (Real-Time In-App & Email Security Alerts)
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'INFO',
    category VARCHAR(50) NOT NULL, -- 'breach', 'session', 'incident', 'policy'
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    action_url VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. API_INTEGRATIONS (Developer Security & GitHub Official API Tokens)
CREATE TABLE api_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    provider_name VARCHAR(100) NOT NULL, -- 'github', 'aws_iam', 'gitlab'
    scopes TEXT[] NOT NULL DEFAULT '{}',
    token_encrypted BYTEA, -- AES-256-GCM encrypted OAuth token (never plaintext)
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_scanned_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES FOR PRODUCTION QUERY PERFORMANCE
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_security_events_user_id_time ON security_events(user_id, created_at DESC);
CREATE INDEX idx_risk_findings_user_status ON risk_findings(user_id, remediation_status);
CREATE INDEX idx_incidents_user_status ON incidents(user_id, status);
CREATE INDEX idx_audit_logs_org_time ON audit_logs(organization_id, created_at DESC);
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
