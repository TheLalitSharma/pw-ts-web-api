import { test } from '@playwright/test';
import { InventoryPage } from '@pages/inventory.page';
import { CartPage } from '@pages/cart.page';
import { CheckoutPage } from '@pages/checkout.page';
import { getTestData } from '@utils/data.fixture';
import { expectPageScreenshot } from '@core/visual.helper';

test.describe('cart & checkout @smoke', () => {
  test('add to cart and checkout', async ({ page }) => {
    const data = await getTestData();
    await page.goto('/inventory.html');

    const inventory = new InventoryPage(page);
    const product = data.products[0];
    if (!product) throw new Error("No product found in test data");
    await inventory.addProductToCart(product);

    // Visual snapshot of cart badge
    await expectPageScreenshot(page, 'cart-badge', [inventory.header.cartBadge]);

    await inventory.header.openCart();

    const cart = new CartPage(page);
    await cart.checkout();

    const checkout = new CheckoutPage(page);
    await checkout.fillInfo(data.checkout.firstName, data.checkout.lastName, data.checkout.postalCode);
    await checkout.placeOrder();
  });
});