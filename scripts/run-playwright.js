#!/usr/bin/env node
/* Lightweight Playwright runner that executes tests in playwright-mcp/ */
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const args = process.argv.slice(2)
const isWin = process.platform === 'win32'
const cwd = path.join(__dirname, '..', 'playwright-mcp')

// Prefer the Playwright Test binary from the subproject to avoid version mismatches.
let bin = path.join(cwd, 'node_modules', '.bin', isWin ? 'playwright.cmd' : 'playwright')
if (!fs.existsSync(bin)) {
  // Fallback: root (less ideal due to version differences)
  bin = path.join(__dirname, '..', 'node_modules', '.bin', isWin ? 'playwright.cmd' : 'playwright')
}

const child = spawn(bin, ['test', ...args], {
  cwd,
  stdio: 'inherit',
  env: { ...process.env, PW_DISABLE_TELEMETRY: '1' },
  shell: false,
})

child.on('close', (code) => process.exit(code))
child.on('error', (err) => {
  console.error('Failed to run Playwright CLI:', err.message)
  process.exit(1)
})
