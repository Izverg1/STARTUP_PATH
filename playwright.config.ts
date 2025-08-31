import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  retries: 1,
  timeout: 30_000,
  reporter: [['list'], ['html', { outputFolder: 'test-results/html' }]],
  use: {
    headless: true,
    baseURL: process.env.APP_URL || 'http://localhost:1010',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  webServer: {
    command: 'npm run dev',
    url: process.env.APP_URL || 'http://localhost:1010',
    reuseExistingServer: true,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 120_000,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
})
