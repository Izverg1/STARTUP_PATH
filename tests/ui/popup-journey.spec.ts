import { test, expect } from '@playwright/test'

const ROOT = process.env.APP_URL || 'http://localhost:1010'

test.describe('Popup‑driven RPA demo', () => {
  test('Clicks through popup, monitors results', async ({ page }) => {
    const resp = await page.goto(`${ROOT}/demo/ui-test?auto=0`)
    expect(resp?.ok()).toBeTruthy()

    const popup = page.locator('div.pointer-events-auto')
    await expect(popup).toBeVisible()

    // Helper to click Run Check, wait for pass/fail, return boolean
    async function runAndAwaitResult(): Promise<boolean> {
      await page.waitForTimeout(5000) // narration time
      const run = popup.getByRole('button', { name: 'Run Check' })
      await run.click()
      const pass = popup.getByText(/✓ Passed|Passed/i)
      const fail = popup.getByText(/✗ Not Passed|Not Passed/i)
      const res = await Promise.race([
        pass.waitFor({ timeout: 10000 }).then(() => 'passed').catch(() => null),
        fail.waitFor({ timeout: 10000 }).then(() => 'failed').catch(() => null),
      ])
      return res === 'passed'
    }

    // Step 1
    await expect(popup.getByText('Step 1 / 3')).toBeVisible()
    let ok = await runAndAwaitResult()
    expect(ok).toBeTruthy()
    await popup.getByRole('button', { name: 'Next' }).click()

    // Step 2 (ensure overlay toggled for blur)
    await expect(popup.getByText('Step 2 / 3')).toBeVisible()
    const toggle = page.getByTestId('demo-footer-toggle')
    if (await toggle.isVisible().catch(() => false)) {
      await toggle.click()
    }
    ok = await runAndAwaitResult()
    expect(ok).toBeTruthy()
    await popup.getByRole('button', { name: 'Next' }).click()

    // Step 3
    await expect(popup.getByText('Step 3 / 3')).toBeVisible()
    ok = await runAndAwaitResult()
    expect(ok).toBeTruthy()
  })
})
