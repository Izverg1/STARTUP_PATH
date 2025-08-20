-- STARTUP_PATH Platform - Manual Database Setup
-- Execute this SQL in your Supabase SQL Editor
-- This will create the essential SPATH_ tables for the authentication system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- CORE AUTHENTICATION TABLES
-- =============================================================================

-- Organizations table (multi-tenant root)
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

-- Users table (extends auth.users with profile data)
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

-- Projects table (basic structure for future use)
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

-- =============================================================================
-- AUTHENTICATION HELPERS & TRIGGERS
-- =============================================================================

-- Function to automatically create user profile when auth.users record is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_org_id UUID;
    user_email TEXT;
    user_name TEXT;
BEGIN
    -- Get user details from the new auth.users record
    user_email := NEW.email;
    user_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
    
    -- Get the default organization (or create one if none exists)
    SELECT id INTO default_org_id 
    FROM SPATH_organizations 
    WHERE slug = 'startup-path-demo' 
    LIMIT 1;
    
    -- If no default org exists, create one
    IF default_org_id IS NULL THEN
        INSERT INTO SPATH_organizations (name, slug, description)
        VALUES ('STARTUP_PATH Demo', 'startup-path-demo', 'Demo organization for new users')
        RETURNING id INTO default_org_id;
    END IF;
    
    -- Create user profile
    INSERT INTO SPATH_users (id, org_id, email, name, role)
    VALUES (NEW.id, default_org_id, user_email, user_name, 'owner')
    ON CONFLICT (id) DO NOTHING; -- Prevent duplicate key errors
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists, then create new one
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

-- Organizations: Users can only access their own organization
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

-- Users: Can view users in their organization, update own profile
CREATE POLICY "Users can view org members" ON SPATH_users
    FOR SELECT USING (
        org_id = (SELECT org_id FROM SPATH_users WHERE id = auth.uid())
    );

CREATE POLICY "Users can update own profile" ON SPATH_users
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON SPATH_users
    FOR INSERT WITH CHECK (id = auth.uid());

-- Projects: Organization-scoped access
CREATE POLICY "Users can view org projects" ON SPATH_projects
    FOR SELECT USING (
        org_id = (SELECT org_id FROM SPATH_users WHERE id = auth.uid())
    );

CREATE POLICY "Users can manage org projects" ON SPATH_projects
    FOR ALL USING (
        org_id = (SELECT org_id FROM SPATH_users WHERE id = auth.uid())
    );

-- =============================================================================
-- PERFORMANCE INDEXES
-- =============================================================================

-- Primary lookup indexes
CREATE INDEX IF NOT EXISTS idx_spath_users_org_id ON SPATH_users(org_id);
CREATE INDEX IF NOT EXISTS idx_spath_users_email ON SPATH_users(email);
CREATE INDEX IF NOT EXISTS idx_spath_projects_org_id ON SPATH_projects(org_id);
CREATE INDEX IF NOT EXISTS idx_spath_organizations_slug ON SPATH_organizations(slug);

-- =============================================================================
-- INITIAL DATA
-- =============================================================================

-- Create default organization for demo users
INSERT INTO SPATH_organizations (name, slug, description, subscription_tier) 
VALUES ('STARTUP_PATH Demo', 'startup-path-demo', 'Demo organization for STARTUP_PATH Platform', 'demo')
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Check that tables were created successfully
DO $$
BEGIN
    RAISE NOTICE 'SPATH_organizations table exists: %', 
        (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'spath_organizations'));
    RAISE NOTICE 'SPATH_users table exists: %', 
        (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'spath_users'));
    RAISE NOTICE 'SPATH_projects table exists: %', 
        (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'spath_projects'));
    RAISE NOTICE 'Default organization created: %', 
        (SELECT COUNT(*) FROM SPATH_organizations WHERE slug = 'startup-path-demo');
END $$;

-- Show created tables
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name LIKE 'spath_%' 
ORDER BY table_name;