-- SPATH Tables Migration for KSON_DB
-- Create authentication and core tables with spath_ prefix

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE spath_orgs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table  
CREATE TABLE spath_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES spath_orgs(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'member',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE spath_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES spath_orgs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    settings JSONB DEFAULT '{}',
    created_by UUID REFERENCES spath_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experiments table
CREATE TABLE spath_experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES spath_projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    config JSONB DEFAULT '{}',
    created_by UUID REFERENCES spath_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_spath_users_org_id ON spath_users(org_id);
CREATE INDEX idx_spath_projects_org_id ON spath_projects(org_id);
CREATE INDEX idx_spath_experiments_project_id ON spath_experiments(project_id);

-- Enable RLS
ALTER TABLE spath_orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE spath_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE spath_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE spath_experiments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own org" ON spath_orgs FOR ALL USING (id IN (
    SELECT org_id FROM spath_users WHERE id = auth.uid()
));

CREATE POLICY "Users can manage own profile" ON spath_users FOR ALL USING (id = auth.uid());

CREATE POLICY "Users can access org projects" ON spath_projects FOR ALL USING (org_id IN (
    SELECT org_id FROM spath_users WHERE id = auth.uid()
));

CREATE POLICY "Users can access project experiments" ON spath_experiments FOR ALL USING (project_id IN (
    SELECT p.id FROM spath_projects p 
    JOIN spath_users u ON p.org_id = u.org_id 
    WHERE u.id = auth.uid()
));