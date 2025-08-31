import { test, expect } from '@playwright/test'
import { mkdirSync } from 'fs'

const ROOT = process.env.APP_URL || 'http://localhost:1010'

test.describe('Visual UI Demo (screenshots)', () => {
  test('Drive popup and capture screenshots per step', async ({ page }) => {
    // Ensure output dir exists
    try { mkdirSync('test-results/visual-demo', { recursive: true } as any) } catch {}

    const resp = await page.goto(`${ROOT}/demo/ui-test?auto=0`)
    expect(resp?.ok()).toBeTruthy()

    const popup = page.locator('div.pointer-events-auto')
    await expect(popup).toBeVisible()

    // STEP 1
    await expect(popup.getByText('Step 1 / 3')).toBeVisible()
    await page.waitForTimeout(500) // small settle
    await popup.getByRole('button', { name: 'Run Check' }).click()
    await expect(popup.getByText(/Passed/i)).toBeVisible()
    await page.screenshot({ path: 'test-results/visual-demo/step1-passed.png', fullPage: true })
    await popup.getByRole('button', { name: 'Next' }).click()

    // STEP 2
    await expect(popup.getByText('Step 2 / 3')).toBeVisible()
    // Toggle overlay if needed
    const toggle = page.getByTestId('demo-footer-toggle')
    if (await toggle.isVisible().catch(() => false)) {
      await toggle.click()
    }
    await popup.getByRole('button', { name: 'Run Check' }).click()
    await expect(popup.getByText(/Passed/i)).toBeVisible()
    await page.screenshot({ path: 'test-results/visual-demo/step2-blur-passed.png', fullPage: true })
    await popup.getByRole('button', { name: 'Next' }).click()

    // STEP 3
    await expect(popup.getByText('Step 3 / 3')).toBeVisible()
    await popup.getByRole('button', { name: 'Run Check' }).click()
    await expect(popup.getByText(/Passed/i)).toBeVisible()
    await page.screenshot({ path: 'test-results/visual-demo/step3-scrollbar-passed.png', fullPage: true })
  })
})

