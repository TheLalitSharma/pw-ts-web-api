import { test, expect } from '@playwright/test';
import { injectTestJacket, mockAddToCart500 } from '@core/interceptors';

test.describe('network features @regression', () => {
  test.skip('inject extra product via network fulfill', async ({ page }) => {
    debugger;
    await injectTestJacket(page);
    await page.goto('/inventory.html');
    await expect(page.locator('.inventory_item_name', { hasText: 'Test Jacket' })).toBeVisible();
  });

  test('simulate 500 on add-to-cart and show UI error', async ({ page }) => {
    await mockAddToCart500(page);
    await page.goto('/inventory.html');
    // Click first add-to-cart to trigger our mock path
    await page.locator('button.btn_inventory').first().click();
    await expect(page.locator('#api-error')).toHaveText(/Add to cart failed/i);
  });
});