#!/usr/bin/env node
/*
  Smoke test runner:
  - Ensures the dev server is up (starts it if needed)
  - Runs root UI smoke (tests/ui)
  - Runs MCP capabilities subset in playwright-mcp
  - Shuts down dev server it started
*/

const { spawn } = require('child_process')

const APP_URL = process.env.APP_URL || 'http://localhost:1010'

async function waitForReady(url, timeoutMs = 60_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: 'GET' })
      if (res.ok) return true
    } catch {}
    await new Promise(r => setTimeout(r, 1000))
  }
  return false
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', ...opts })
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`))
    })
    child.on('error', reject)
  })
}

async function main() {
  let devStarted = false
  let devProc = null

  const reachableBefore = await waitForReady(APP_URL, 2000)
  if (!reachableBefore) {
    devProc = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: false })
    devStarted = true
    const ready = await waitForReady(APP_URL, 90_000)
    if (!ready) {
      if (devProc) devProc.kill('SIGINT')
      throw new Error(`Dev server not ready at ${APP_URL}`)
    }
  }

  try {
    // Root UI smoke
    await run('npx', ['playwright', 'install'])
    await run('npx', ['playwright', 'test', 'tests/ui', '--reporter=list'])

    // MCP capabilities (subset)
    await run('npx', ['playwright', 'install'], { cwd: 'playwright-mcp' })
    await run('npx', ['playwright', 'test', 'tests/capabilities.spec.ts', '--project=chromium', '--reporter=list'], { cwd: 'playwright-mcp' })

    console.log('\nSmoke tests completed successfully.')
  } finally {
    if (devStarted && devProc) {
      devProc.kill('SIGINT')
    }
  }
}

main().catch(err => {
  console.error('\nSmoke test failed:', err.message)
  process.exit(1)
})
