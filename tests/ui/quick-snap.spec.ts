import { test } from '@playwright/test'

test('snap login page', async ({ page }) => {
  await page.goto('/login')
  await page.setViewportSize({ width: 1366, height: 900 })
  await page.screenshot({ path: 'test-results/quick/login.png', fullPage: true })
})

test('snap projects after login', async ({ page }) => {
  await page.goto('/login')
  await page.getByPlaceholder('Email address').fill('user@startuppath.ai')
  await page.getByPlaceholder('Password').fill('demo123')
  await page.getByRole('button', { name: /sign in/i }).click()
  await page.waitForURL(/\/dashboard\/projects/)
  await page.setViewportSize({ width: 1366, height: 900 })
  await page.screenshot({ path: 'test-results/quick/projects.png', fullPage: true })
})

