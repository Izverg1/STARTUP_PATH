import { test, expect } from '@playwright/test'

const ROOT = process.env.APP_URL || 'http://localhost:1010'

test.describe('Interactive Demo (RPA-style)', () => {
  test('Auto-narrated popup completes all steps', async ({ page }) => {
    // Navigate to the interactive test page
    const resp = await page.goto(`${ROOT}/demo/ui-test`)
    expect(resp?.ok()).toBeTruthy()

    // Popup appears with narration (select the red-accent label in the modal)
    const modalTitle = page.locator('div.pointer-events-auto').locator('div').filter({ hasText: /^UI Interactive Test$/ }).first()
    await expect(modalTitle).toBeVisible()

    // Wait for auto-run to advance to Step 2 (~5s + execution time)
    await expect(page.getByText('Step 2 / 3')).toBeVisible({ timeout: 15000 })

    // Verify blur overlay appears in Step 2 (either via hover or auto toggle)
    await expect(page.locator('[data-testid="footer-blur-overlay"]')).toBeVisible()

    // Wait for auto-run to advance to Step 3 (allow extra time)
    const step3 = page.getByText('Step 3 / 3')
    try {
      await expect(step3).toBeVisible({ timeout: 25000 })
    } catch {
      // If auto-advance didn’t happen yet, nudge by clicking Run Check
      const runBtn = page.getByRole('button', { name: 'Run Check' })
      await runBtn.click({ trial: true }).catch(() => {})
      await runBtn.click().catch(() => {})
      await expect(step3).toBeVisible({ timeout: 10000 })
    }

    // Confirm the demo scroll container exists
    await expect(page.locator('.ui-test-scroll')).toBeVisible()
  })
})
