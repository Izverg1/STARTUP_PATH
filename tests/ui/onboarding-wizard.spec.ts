import { test, expect } from '@playwright/test'

test.describe('Onboarding Wizard', () => {
  test('completes end-to-end with valid inputs', async ({ page }) => {
    await page.goto('/onboarding/wizard')
    await expect(page.getByTestId('onboarding-wizard')).toBeVisible()

    // Step 1: ICP & Economics
    await page.getByTestId('select-persona').click()
    await page.getByRole('option', { name: /Founder\/CEO/i }).click()

    await page.getByTestId('select-companySize').click()
    await page.getByRole('option', { name: /Startup \(1-50\)/i }).click()

    await page.getByTestId('select-geography').click()
    await page.getByRole('option', { name: /North America/i }).click()

    await page.getByTestId('select-acvBand').click()
    await page.getByRole('option', { name: /\$5K - \$25K/i }).click()

    await page.getByTestId('input-grossMargin').fill('80')

    await page.getByTestId('select-salesMotion').click()
    await page.getByRole('option', { name: /Inside Sales/i }).click()

    await page.getByTestId('next').click()

    // Step 2: Channels
    await page.getByTestId('channel-google-search').click()
    await page.getByTestId('channel-webinar').click()

    await page.getByTestId('next').click()

    // Step 3: Success
    await page.getByTestId('input-cacPaybackWindow').fill('12')
    await page.getByTestId('input-cpqmTarget').fill('250')

    await page.getByTestId('next').click()

    // Step 4: Mode
    await page.getByTestId('mode-simulation').check()

    // Submit
    await page.getByTestId('submit').click()

    // Redirects to dashboard → projects
    await expect(page).toHaveURL(/\/dashboard\/projects/)
  })
})

