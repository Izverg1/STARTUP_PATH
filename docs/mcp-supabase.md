Supabase MCP Server (Model Context Protocol)

This repo includes a ready-to-use configuration for the Supabase MCP server. It lets MCP‑compatible clients (Claude Desktop, VS Code MCP clients, etc.) talk to Supabase using a Supabase Platform access token.

Prerequisites
- A Supabase personal access token (Platform): create one in https://supabase.com/dashboard/account/tokens
  - Keep this token private. Do not commit it to git.

Run from the repo (ad‑hoc)
- macOS/Linux:
  export SUPABASE_ACCESS_TOKEN=sbp_xxx
  npm run mcp:supabase

- Windows (PowerShell):
  $env:SUPABASE_ACCESS_TOKEN="sbp_xxx"; npm run mcp:supabase

Claude Desktop settings
Add this block to your ~/.claude/settings.local.json (or merge with existing mcpServers):

{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "${SUPABASE_ACCESS_TOKEN}"
      ]
    }
  }
}

Then set SUPABASE_ACCESS_TOKEN in your shell/profile so Claude can inherit it:
- macOS/Linux (bash/zsh): add to ~/.zprofile or ~/.bash_profile
  export SUPABASE_ACCESS_TOKEN=sbp_xxx
- Windows: System Environment Variables → New user variable SUPABASE_ACCESS_TOKEN.

Notes
- The token above is a Supabase Platform access token (not your database anon key).
- Do not store the token in the repo. Use environment variables or your secret manager.
- If you need multiple environments, create tokens per Supabase org/project and switch via env var.

