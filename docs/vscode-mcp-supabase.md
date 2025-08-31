VS Code: Supabase MCP server

This repo includes a ready configuration for MCP‑capable VS Code extensions (e.g., Claude Dev).

Prerequisites
- Install the MCP‑aware extension (e.g., “Claude Dev”).
- Create a Supabase Platform access token and keep it private.

Environment variable
- macOS/Linux (bash/zsh): add to ~/.zprofile or ~/.bash_profile
  export SUPABASE_ACCESS_TOKEN=sbp_xxx
- Windows (PowerShell user scope):
  [Environment]::SetEnvironmentVariable("SUPABASE_ACCESS_TOKEN","sbp_xxx","User")
  Restart VS Code after setting it.

Project settings (already added)
- .vscode/settings.json contains:
  {
    "claudeDev.mcpServers": {
      "supabase": {
        "command": "npx",
        "args": ["-y", "@supabase/mcp-server-supabase@latest", "--access-token", "${env:SUPABASE_ACCESS_TOKEN}"]
      }
    }
  }

Notes
- The token referenced is a Supabase Platform access token (not your database keys).
- The extension will launch the server using your env var.
- If you prefer per‑user rather than per‑workspace config, move this block to user settings (Settings → Open Settings (JSON)).

