-- STARTUP_PATH Platform Database Schema
-- All tables use SPATH_ prefix to stand out from other tables in KSON_DB
-- Created: 2025-01-18

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- CORE USER MANAGEMENT TABLES
-- =============================================================================

-- Organizations table
CREATE TABLE IF NOT EXISTS SPATH_organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    domain TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_tier TEXT DEFAULT 'demo' CHECK (subscription_tier IN ('demo', 'starter', 'growth', 'enterprise')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users profile table (extends auth.users)
CREATE TABLE IF NOT EXISTS SPATH_users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    org_id UUID REFERENCES SPATH_organizations(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'contributor', 'viewer')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- PROJECT AND EXPERIMENT MANAGEMENT
-- =============================================================================

-- Projects table
CREATE TABLE IF NOT EXISTS SPATH_projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    org_id UUID REFERENCES SPATH_organizations(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES SPATH_users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
    mode TEXT DEFAULT 'simulation' CHECK (mode IN ('simulation', 'connected')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experiments table
CREATE TABLE IF NOT EXISTS SPATH_experiments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    hypothesis TEXT,
    project_id UUID REFERENCES SPATH_projects(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed', 'killed')),
    budget_allocated DECIMAL DEFAULT 0,
    target_cpqm DECIMAL,
    max_cac_payback_months INTEGER,
    icp JSONB DEFAULT '{}',
    success_criteria JSONB DEFAULT '{}',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- AUTHENTICATION HELPERS
-- =============================================================================

-- Function to create user profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO SPATH_users (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE SPATH_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE SPATH_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE SPATH_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE SPATH_experiments ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Users can view their organization" ON SPATH_organizations
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM SPATH_users WHERE org_id = SPATH_organizations.id
        )
    );

CREATE POLICY "Organization owners can update their organization" ON SPATH_organizations
    FOR UPDATE USING (auth.uid() = owner_id);

-- Users policies
CREATE POLICY "Users can view profiles in their organization" ON SPATH_users
    FOR SELECT USING (
        org_id = (SELECT org_id FROM SPATH_users WHERE id = auth.uid())
    );

CREATE POLICY "Users can update their own profile" ON SPATH_users
    FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view projects in their organization" ON SPATH_projects
    FOR SELECT USING (
        org_id = (SELECT org_id FROM SPATH_users WHERE id = auth.uid())
    );

CREATE POLICY "Users can create projects in their organization" ON SPATH_projects
    FOR INSERT WITH CHECK (
        org_id = (SELECT org_id FROM SPATH_users WHERE id = auth.uid())
    );

-- Experiments policies
CREATE POLICY "Users can view experiments in their projects" ON SPATH_experiments
    FOR SELECT USING (
        project_id IN (
            SELECT p.id FROM SPATH_projects p
            JOIN SPATH_users u ON u.org_id = p.org_id
            WHERE u.id = auth.uid()
        )
    );

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_spath_users_org_id ON SPATH_users(org_id);
CREATE INDEX IF NOT EXISTS idx_spath_projects_org_id ON SPATH_projects(org_id);
CREATE INDEX IF NOT EXISTS idx_spath_experiments_project_id ON SPATH_experiments(project_id);

-- =============================================================================
-- INITIAL DATA
-- =============================================================================

-- Create default organization for new users
INSERT INTO SPATH_organizations (name, slug, subscription_tier) 
VALUES ('STARTUP_PATH Demo', 'startup-path-demo', 'demo')
ON CONFLICT (slug) DO NOTHING;