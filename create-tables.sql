-- Essential tables for STARTUP_PATH platform
-- Run this in Supabase SQL Editor or via API

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE IF NOT EXISTS SPATH_organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    domain TEXT,
    owner_id UUID,
    subscription_tier TEXT DEFAULT 'demo' CHECK (subscription_tier IN ('demo', 'starter', 'growth', 'enterprise')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users profile table (for demo - doesn't reference auth.users to avoid auth issues)
CREATE TABLE IF NOT EXISTS SPATH_users (
    id TEXT PRIMARY KEY,
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

-- Projects table
CREATE TABLE IF NOT EXISTS SPATH_projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    org_id UUID REFERENCES SPATH_organizations(id) ON DELETE CASCADE,
    created_by TEXT REFERENCES SPATH_users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
    mode TEXT DEFAULT 'simulation' CHECK (mode IN ('simulation', 'connected')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);