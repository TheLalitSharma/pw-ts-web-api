import { test, expect } from '@playwright/test';
import { InventoryPage } from '@pages/inventory.page';
import { expectPageScreenshot } from '@core/visual.helper';

test.describe('visuals @visual', () => {
  test('inventory listing visual', async ({ page }) => {
    await page.goto('/inventory.html');
    const inventory = new InventoryPage(page);
    await expect(inventory.items.first()).toBeVisible();
    await expectPageScreenshot(page, 'inventory-list');
  });
});