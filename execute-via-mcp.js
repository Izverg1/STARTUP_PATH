#!/usr/bin/env node
// Direct execution via Supabase MCP protocol

const { spawn } = require('child_process');
const fs = require('fs');

// SQL to create SPATH tables
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
    console.log('🔥 Executing SPATH table creation via Supabase MCP...');
    
    // Start the MCP server with the same config as your Claude Desktop
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
        console.log('📤 MCP Response:', data.toString());
    });

    mcpProcess.stderr.on('data', (data) => {
        console.log('🚨 MCP Error:', data.toString());
    });

    // Send initialization message
    const initMessage = {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
            protocolVersion: "2024-11-05",
            capabilities: {},
            clientInfo: {
                name: "claude-code",
                version: "1.0.0"
            }
        }
    };

    console.log('📡 Sending initialization...');
    mcpProcess.stdin.write(JSON.stringify(initMessage) + '\n');

    // Wait a bit for initialization
    await new Promise(resolve => setTimeout(resolve, 2000));

    // List available tools
    const listToolsMessage = {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/list",
        params: {}
    };

    console.log('📋 Requesting available tools...');
    mcpProcess.stdin.write(JSON.stringify(listToolsMessage) + '\n');

    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Try to execute SQL
    const executeMessage = {
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
            name: "query",
            arguments: {
                sql: createTablesSQL,
                project_ref: "oftpmcfukkidmjvzeqfc"
            }
        }
    };

    console.log('🔨 Executing table creation SQL...');
    mcpProcess.stdin.write(JSON.stringify(executeMessage) + '\n');

    // Wait for completion
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Clean shutdown
    mcpProcess.stdin.end();
    
    mcpProcess.on('close', (code) => {
        console.log(`✅ MCP process finished with code: ${code}`);
        if (responseData.includes('error')) {
            console.log('❌ Errors detected in response');
        } else {
            console.log('🎉 SPATH tables should now be created in KSON_DB!');
        }
    });
}

executeMCP().catch(console.error);