-- =====================================================================================
-- STARTUP_PATH Platform - Core Tables Migration
-- Database: KSON_DB (Supabase)
-- Prefix: SPATH_ (all tables)
-- Purpose: Organizations, Users, Projects - Multi-tenant foundation
-- =====================================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================================
-- TABLE: SPATH_organizations
-- Purpose: Multi-tenant organization management
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    domain TEXT,
    owner_id UUID, -- Will be linked to SPATH_users after creation
    subscription_tier TEXT NOT NULL DEFAULT 'demo' CHECK (subscription_tier IN ('demo', 'starter', 'growth', 'enterprise')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_organizations_slug ON SPATH_organizations(slug);
CREATE INDEX IF NOT EXISTS idx_spath_organizations_owner_id ON SPATH_organizations(owner_id);
CREATE INDEX IF NOT EXISTS idx_spath_organizations_subscription_tier ON SPATH_organizations(subscription_tier);

-- =====================================================================================
-- TABLE: SPATH_users
-- Purpose: User management with organization membership
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_users (
    id UUID PRIMARY KEY, -- This will match Supabase auth.users.id
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    org_id UUID REFERENCES SPATH_organizations(id) ON DELETE SET NULL,
    role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'admin', 'contributor', 'viewer')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_users_email ON SPATH_users(email);
CREATE INDEX IF NOT EXISTS idx_spath_users_org_id ON SPATH_users(org_id);
CREATE INDEX IF NOT EXISTS idx_spath_users_role ON SPATH_users(role);
CREATE INDEX IF NOT EXISTS idx_spath_users_is_active ON SPATH_users(is_active);

-- Update organization owner_id foreign key constraint
ALTER TABLE SPATH_organizations 
ADD CONSTRAINT fk_spath_organizations_owner_id 
FOREIGN KEY (owner_id) REFERENCES SPATH_users(id) ON DELETE SET NULL;

-- =====================================================================================
-- TABLE: SPATH_projects
-- Purpose: Workspace projects for GTM experiments
-- =====================================================================================

CREATE TABLE IF NOT EXISTS SPATH_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    org_id UUID NOT NULL REFERENCES SPATH_organizations(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES SPATH_users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
    mode TEXT NOT NULL DEFAULT 'simulation' CHECK (mode IN ('simulation', 'connected')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_projects_org_id ON SPATH_projects(org_id);
CREATE INDEX IF NOT EXISTS idx_spath_projects_owner_id ON SPATH_projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_spath_projects_status ON SPATH_projects(status);
CREATE INDEX IF NOT EXISTS idx_spath_projects_mode ON SPATH_projects(mode);

-- =====================================================================================
-- TRIGGERS: Auto-update timestamps
-- =====================================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_spath_organizations_updated_at 
    BEFORE UPDATE ON SPATH_organizations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spath_users_updated_at 
    BEFORE UPDATE ON SPATH_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spath_projects_updated_at 
    BEFORE UPDATE ON SPATH_projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================================
-- COMMENTS: Table documentation
-- =====================================================================================

COMMENT ON TABLE SPATH_organizations IS 'Multi-tenant organizations using STARTUP_PATH Platform';
COMMENT ON TABLE SPATH_users IS 'Platform users with organization membership and roles';
COMMENT ON TABLE SPATH_projects IS 'GTM experiment workspaces within organizations';

COMMENT ON COLUMN SPATH_organizations.subscription_tier IS 'Billing tier: demo (free), starter, growth, enterprise';
COMMENT ON COLUMN SPATH_users.role IS 'Organization role: owner (full access), admin, contributor, viewer';
COMMENT ON COLUMN SPATH_projects.mode IS 'Project mode: simulation (demo data) or connected (real integrations)';

-- =====================================================================================
-- VALIDATION: Verify table creation
-- =====================================================================================

-- Verify all tables exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_organizations') THEN
        RAISE EXCEPTION 'Table SPATH_organizations was not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_users') THEN
        RAISE EXCEPTION 'Table SPATH_users was not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spath_projects') THEN
        RAISE EXCEPTION 'Table SPATH_projects was not created';
    END IF;
    
    RAISE NOTICE 'SUCCESS: Core tables (organizations, users, projects) created successfully';
END $$;