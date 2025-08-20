# STARTUP SIM - MCP Configuration

## Claude Code MCP Access

Claude Code now has access to the same MCP servers as Claude Desktop:

### Available MCP Servers

1. **Desktop Commander** - File operations, process management
2. **MCP Docker** - Extensive tool suite (GitHub, Stripe, Browser automation, etc.)
3. **Filesystem** - Access to `/Users/izverg/Projects` directory
4. **Supabase** - Database operations for KSON_DB project

### Database Configuration

- **Project ID**: `oftpmcfukkidmjvzeqfc`
- **Tables**: Uses `spath_*` tables for isolation from other apps
- **Current User**: `test@karlson.com` (ID: `2643cff2-87ff-465f-b746-bcf2d5606517`)

### Testing Claude Code MCP Access

1. Open this project in Claude Code
2. Test commands:
   ```
   > list tables in the database
   > show me the spath_users table
   > create a user in spath_users table
   > show current directory structure
   ```

### Configuration Files

- **Global**: `/Users/izverg/.config/claude-code/settings.json`
- **Project**: `.claude_config.json` (in this directory)

### Troubleshooting

If MCP servers aren't working:
1. Restart Claude Code
2. Check that all MCP server dependencies are installed
3. Run the verification script: `/Users/izverg/Projects/verify_mcp_setup.sh`

### User Creation for Startup App

The user `test@karlson.com` exists in:
- ✅ `auth.users` (Supabase authentication)
- ✅ `spath_users` (app-specific user management)
- ✅ `profiles` (system profiles)

All tables share the same UUID for consistency.
