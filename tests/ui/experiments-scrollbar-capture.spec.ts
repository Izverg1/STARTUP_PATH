import { test, expect } from '@playwright/test'
import fs from 'fs'

test('capture experiments page red scrollbar', async ({ page }) => {
  const outDir = 'test-results/scrollbar'
  fs.mkdirSync(outDir, { recursive: true })

  await page.goto('/login')
  await page.getByRole('heading', { name: /STARTUP_PATH Platform/i }).waitFor()
  await page.getByPlaceholder('Email address').fill('user@startuppath.ai')
  await page.getByPlaceholder('Password').fill('demo123')
  await page.getByRole('button', { name: /sign in/i }).click()
  await page.waitForURL(/\/dashboard\/projects/)

  await page.goto('/dashboard/experiments')

  // Find a scrollable experiments container with our red-scrollbar class
  const container = page.locator('.red-scrollbar').first()
  await expect(container).toBeVisible()

  // Force vertical scrollbar to be visible
  await container.evaluate((el) => {
    (el as HTMLElement).style.overflowY = 'scroll'
  })

  // Scroll to ensure the thumb is mid-track
  await container.evaluate((el) => { el.scrollTop = (el.scrollHeight - el.clientHeight) / 2 })
  await page.waitForTimeout(150)

  // Full container
  await container.screenshot({ path: `${outDir}/experiments-scroll-container.png` })

  // Right-edge crop
  const box = await container.boundingBox()
  if (!box) throw new Error('No bounding box available')
  const clipWidth = 48
  await page.screenshot({
    path: `${outDir}/experiments-scrollbar.png`,
    clip: {
      x: Math.max(0, box.x + box.width - clipWidth),
      y: box.y,
      width: clipWidth,
      height: Math.min(page.viewportSize()!.height, box.height),
    }
  })
})

