-- STARTUP_PATH Database Schema - Run this in Supabase SQL Editor
-- Copy and paste this entire SQL into your Supabase SQL Editor and click "Run"

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Organizations table
CREATE TABLE IF NOT EXISTS SPATH_organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    website TEXT,
    settings JSONB DEFAULT '{}',
    subscription_tier TEXT DEFAULT 'demo' CHECK (subscription_tier IN ('demo', 'starter', 'growth', 'enterprise')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS SPATH_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id UUID REFERENCES SPATH_organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'contributor', 'viewer')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    onboarding_completed BOOLEAN DEFAULT false,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS SPATH_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES SPATH_organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
    settings JSONB DEFAULT '{}',
    created_by UUID REFERENCES SPATH_users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE SPATH_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE SPATH_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE SPATH_projects ENABLE ROW LEVEL SECURITY;

-- RLS policies for organizations
CREATE POLICY "Users can view their organization" ON SPATH_organizations
    FOR SELECT USING (
        id IN (SELECT org_id FROM SPATH_users WHERE id = auth.uid())
    );

CREATE POLICY "Organization owners can update their organization" ON SPATH_organizations
    FOR UPDATE USING (
        id IN (
            SELECT org_id FROM SPATH_users 
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- RLS policies for users
CREATE POLICY "Users can view org members" ON SPATH_users
    FOR SELECT USING (
        org_id = (SELECT org_id FROM SPATH_users WHERE id = auth.uid())
    );

CREATE POLICY "Users can update own profile" ON SPATH_users
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Allow insert during signup" ON SPATH_users
    FOR INSERT WITH CHECK (true);

-- RLS policies for projects
CREATE POLICY "Users can view org projects" ON SPATH_projects
    FOR SELECT USING (
        org_id = (SELECT org_id FROM SPATH_users WHERE id = auth.uid())
    );

CREATE POLICY "Users can manage org projects" ON SPATH_projects
    FOR ALL USING (
        org_id = (SELECT org_id FROM SPATH_users WHERE id = auth.uid())
    );

-- Create default organization
INSERT INTO SPATH_organizations (name, slug, description, subscription_tier) 
VALUES ('STARTUP_PATH Demo', 'startup-path-demo', 'Demo organization for STARTUP_PATH Platform', 'demo')
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_spath_users_org_id ON SPATH_users(org_id);
CREATE INDEX IF NOT EXISTS idx_spath_users_email ON SPATH_users(email);
CREATE INDEX IF NOT EXISTS idx_spath_projects_org_id ON SPATH_projects(org_id);
CREATE INDEX IF NOT EXISTS idx_spath_organizations_slug ON SPATH_organizations(slug);

-- Verification: Show created tables
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name LIKE 'spath_%' 
ORDER BY table_name;