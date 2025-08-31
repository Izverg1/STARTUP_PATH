import { test, expect } from '@playwright/test'
import fs from 'fs'

test('capture dashboard red scrollbar', async ({ page }) => {
  const outDir = 'test-results/scrollbar'
  fs.mkdirSync(outDir, { recursive: true })

  // Login first (demo credentials)
  await page.goto('/login')
  await page.getByRole('heading', { name: /STARTUP_PATH Platform/i }).waitFor()
  await page.getByPlaceholder('Email address').fill('user@startuppath.ai')
  await page.getByPlaceholder('Password').fill('demo123')
  await page.getByRole('button', { name: /sign in/i }).click()
  // Wait for transition then redirect to projects
  await page.waitForURL(/\/dashboard\/projects/)

  // Wait for scroll container
  const container = page.locator('.dashboard-scrollbar').first()
  await expect(container).toBeVisible()

  // Ensure content overflows to show vertical scrollbar
  await page.evaluate((el) => {
    el.style.overflowY = 'scroll'
  }, await container.elementHandle())

  // Nudge scroll to ensure thumb is visible somewhere mid-track
  await container.evaluate((el) => { el.scrollTop = Math.max(100, (el.scrollHeight - el.clientHeight) / 2) })

  // Give CSS time to render animations/pulse
  await page.waitForTimeout(250)

  // First capture the whole container for context
  await container.screenshot({ path: `${outDir}/dashboard-scroll-container.png` })

  // Then clip to right edge to capture the vertical scrollbar clearly
  const box = await container.boundingBox()
  if (!box) throw new Error('No bounding box for container')
  const clipWidth = 48 // include track + thumb + a sliver of content
  const clip = {
    x: Math.max(0, box.x + box.width - clipWidth),
    y: box.y,
    width: clipWidth,
    height: Math.min(page.viewportSize()!.height, box.height),
  }

  await page.screenshot({
    path: `${outDir}/dashboard-scrollbar.png`,
    clip,
  })
})
