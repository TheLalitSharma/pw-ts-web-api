import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  timeout: 180_000,
  expect: { timeout: 30_000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['line'], ['html', { open: 'never' }], ['allure-playwright']],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ],
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 800 },
    actionTimeout: 20_000,
    navigationTimeout: 20_000,
    storageState: '.auth/storageState.json',
    // record HAR per test file
    launchOptions: { slowMo: 0 }
  },
  globalSetup: './global-setup.ts',
});
