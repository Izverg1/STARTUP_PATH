#!/usr/bin/env node
// Execute SPATH table creation using correct MCP tools

const { spawn } = require('child_process');

const createTablesSQL = `
-- SPATH Tables for STARTUP_PATH Platform
CREATE TABLE IF NOT EXISTS spath_orgs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS spath_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES spath_orgs(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'member',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS spath_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES spath_orgs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    settings JSONB DEFAULT '{}',
    created_by UUID REFERENCES spath_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS spath_experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE INDEX IF NOT EXISTS idx_spath_users_org_id ON spath_users(org_id);
CREATE INDEX IF NOT EXISTS idx_spath_projects_org_id ON spath_projects(org_id);
CREATE INDEX IF NOT EXISTS idx_spath_experiments_project_id ON spath_experiments(project_id);

-- Enable RLS
ALTER TABLE spath_orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE spath_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE spath_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE spath_experiments ENABLE ROW LEVEL SECURITY;
`;

async function executeMCP() {
    console.log('🔥 Creating SPATH tables using Supabase MCP...');
    
    const mcpProcess = spawn('npx', [
        '-y',
        '@supabase/mcp-server-supabase@latest',
        '--access-token',
        'sbp_59abfd7f2445ca411d1ce680f58c6ac2387e4e09'
    ], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
            ...process.env,
            SUPABASE_ACCESS_TOKEN: 'sbp_59abfd7f2445ca411d1ce680f58c6ac2387e4e09'
        }
    });

    let responseData = '';
    
    mcpProcess.stdout.on('data', (data) => {
        responseData += data.toString();
        console.log('📤 MCP:', data.toString());
    });

    mcpProcess.stderr.on('data', (data) => {
        console.log('🚨 Error:', data.toString());
    });

    // Initialize
    const initMessage = {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
            protocolVersion: "2024-11-05",
            capabilities: {},
            clientInfo: { name: "claude-code", version: "1.0.0" }
        }
    };

    mcpProcess.stdin.write(JSON.stringify(initMessage) + '\n');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Apply migration to create tables
    const migrationMessage = {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
            name: "apply_migration",
            arguments: {
                project_id: "oftpmcfukkidmjvzeqfc",
                name: "create_spath_tables",
                query: createTablesSQL
            }
        }
    };

    console.log('🔨 Applying SPATH migration...');
    mcpProcess.stdin.write(JSON.stringify(migrationMessage) + '\n');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Verify tables were created
    const verifyMessage = {
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
            name: "list_tables",
            arguments: {
                project_id: "oftpmcfukkidmjvzeqfc"
            }
        }
    };

    console.log('🔍 Verifying tables were created...');
    mcpProcess.stdin.write(JSON.stringify(verifyMessage) + '\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    mcpProcess.stdin.end();
    
    mcpProcess.on('close', (code) => {
        console.log(`✅ Process completed with code: ${code}`);
        if (responseData.includes('spath_')) {
            console.log('🎉 SUCCESS: SPATH tables created in KSON_DB!');
        } else if (responseData.includes('error')) {
            console.log('❌ Error in table creation');
        }
    });
}

executeMCP().catch(console.error);