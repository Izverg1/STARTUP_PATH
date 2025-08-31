import { test, expect } from '@playwright/test'

const ROOT = process.env.APP_URL || 'http://localhost:1010'

test.describe('Pre‑Sales Demo Journey', () => {
  test('Guided flow: load, footer focus, scrollbar', async ({ page }) => {
    // Step 1: Open the interactive UI test page
    const resp = await page.goto(`${ROOT}/demo/ui-test`)
    expect(resp?.ok()).toBeTruthy()

    // Step 2: Focus shifts when demo footer overlay is toggled
    await page.getByTestId('demo-footer-toggle').click()
    await expect(page.locator('[data-testid="footer-blur-overlay"]')).toBeVisible()

    // Step 3: Verify a red-styled scrollbar container exists and is scrollable
    const scroll = page.locator('.ui-test-scroll')
    await expect(scroll).toBeVisible()
    const [clientH, scrollH] = await Promise.all([
      scroll.evaluate(el => (el as HTMLElement).clientHeight),
      scroll.evaluate(el => (el as HTMLElement).scrollHeight),
    ])
    test.info().annotations.push({ type: 'note', description: `clientH=${clientH}, scrollH=${scrollH}` })
    expect(scrollH).toBeGreaterThan(clientH)
  })
})
