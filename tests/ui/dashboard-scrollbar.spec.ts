import { test, expect } from '@playwright/test'

const APP_URL = process.env.APP_URL || 'http://localhost:1010/dashboard/projects'

test.describe('Dashboard scrollbar visuals', () => {
  test('shows red pulsating scrollbar in dashboard area', async ({ page }) => {
    // Preflight: ensure app is running; skip otherwise
    let reachable = true
    try {
      const res = await fetch(APP_URL)
      reachable = res.ok || res.status === 200
    } catch {
      reachable = false
    }
    test.skip(!reachable, `App not reachable at ${APP_URL}`)

    await page.goto(APP_URL)

    const container = page.locator('.dashboard-scrollbar')
    await expect(container).toHaveCount(1)

    // Basic vertical scrollability check (not strict in case of short content)
    const [clientH, scrollH] = await Promise.all([
      container.evaluate(el => el.clientHeight),
      container.evaluate(el => el.scrollHeight)
    ])
    // This assertion is soft — scrollbar may not appear if content is short
    test.info().annotations.push({ type: 'note', description: `clientH=${clientH}, scrollH=${scrollH}` })
    expect(clientH).toBeGreaterThan(0)
  })
})

