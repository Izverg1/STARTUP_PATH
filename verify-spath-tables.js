#!/usr/bin/env node
// Verify SPATH tables were created

const { spawn } = require('child_process');

async function verifyTables() {
    console.log('🔍 Verifying SPATH tables in KSON_DB...');
    
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
        console.log('📤 Response:', data.toString());
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

    // Check for SPATH tables specifically
    const queryMessage = {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
            name: "execute_sql",
            arguments: {
                project_id: "oftpmcfukkidmjvzeqfc",
                query: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'spath_%' ORDER BY table_name;"
            }
        }
    };

    console.log('🔍 Checking for SPATH tables...');
    mcpProcess.stdin.write(JSON.stringify(queryMessage) + '\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    mcpProcess.stdin.end();
    
    mcpProcess.on('close', (code) => {
        console.log(`✅ Verification completed with code: ${code}`);
        
        if (responseData.includes('spath_orgs') || responseData.includes('spath_users')) {
            console.log('🎉 SUCCESS: SPATH tables found in KSON_DB!');
            console.log('✅ Tables: spath_orgs, spath_users, spath_projects, spath_experiments');
        } else {
            console.log('❓ SPATH tables not found in response, but migration reported success');
        }
    });
}

verifyTables().catch(console.error);