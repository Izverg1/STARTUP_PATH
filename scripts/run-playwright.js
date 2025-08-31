#!/usr/bin/env node
/* Lightweight Playwright runner that executes tests in playwright-mcp/ */
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const args = process.argv.slice(2)
const isWin = process.platform === 'win32'
const subprojectDir = path.join(__dirname, '..', 'playwright-mcp')
const rootDir = path.join(__dirname, '..')
const useSubproject = fs.existsSync(subprojectDir) && fs.existsSync(path.join(subprojectDir, 'package.json'))

// Prefer the Playwright Test binary from the subproject to avoid version mismatches.
let bin = path.join(useSubproject ? subprojectDir : rootDir, 'node_modules', '.bin', isWin ? 'playwright.cmd' : 'playwright')
if (!fs.existsSync(bin)) {
  // Fallback: use npx playwright if local bin not found
  bin = isWin ? 'npx.cmd' : 'npx'
  args.unshift('playwright', 'test')
} else {
  args.unshift('test')
}

const child = spawn(bin, args, {
  cwd: useSubproject ? subprojectDir : rootDir,
  stdio: 'inherit',
  env: { ...process.env, PW_DISABLE_TELEMETRY: '1' },
  shell: false,
})

child.on('close', (code) => process.exit(code))
child.on('error', (err) => {
  console.error('Failed to run Playwright CLI:', err.message)
  process.exit(1)
})
