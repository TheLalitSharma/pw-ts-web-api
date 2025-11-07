import { test, expect } from '@playwright/test';

test.describe('auth storage @smoke', () => {
  test('storage state already created in globalSetup; verify inventory accessible', async ({ page }) => {
    await page.goto('/inventory.html');
    await expect(page.locator('.inventory_list')).toBeVisible();
  });
});