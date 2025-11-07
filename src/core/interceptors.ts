import { Page, Route } from '@playwright/test';

export async function injectTestJacket(page: Page) {
    // Fulfill inventory.html by injecting an extra product card called "Test Jacket"
    await page.route('**/inventory.html', async (route: Route) => {
        const response = await route.fetch();
        let body = await response.text();
        body = body.replace(
            '<div class="inventory_item" data-test="inventory-item"><div class="inventory_item_img"><a href="#" id="item_3_img_link" data-test="item-3-img-link"><img alt="Test.allTheThings() T-Shirt (Red)" class="inventory_item_img" src="/static/media/red-tatt-1200x1500.30dadef477804e54fc7b.jpg" data-test="inventory-item-test.allthethings()-t-shirt-(red)-img"></a></div><div class="inventory_item_description" data-test="inventory-item-description"><div class="inventory_item_label"><a href="#" id="item_3_title_link" data-test="item-3-title-link"><div class="inventory_item_name " data-test="inventory-item-name">Test.allTheThings() T-Shirt (Red)</div></a><div class="inventory_item_desc" data-test="inventory-item-desc">This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.</div></div><div class="pricebar"><div class="inventory_item_price" data-test="inventory-item-price">$15.99</div><button class="btn btn_primary btn_small btn_inventory " data-test="add-to-cart-test.allthethings()-t-shirt-(red)" id="add-to-cart-test.allthethings()-t-shirt-(red)" name="add-to-cart-test.allthethings()-t-shirt-(red)">Add to cart</button></div></div></div>',
            `<div class="inventory_item" data-test="inventory-item">
              <div class="inventory_item_description" data-test="inventory_item_description">
                <div class="inventory_item_label">
                  <a href="#" id="item_99_title" data-test="item-99-title-link">
                    <div class="inventory_item_name " data-test="inventory-item-name">Test Jacket</div>
                  </a>
                    <div class="inventory_item_desc" data-test="inventory-item-desc">Injected via network fulfill</div>
                </div>
                <div class="pricebar">
                    <div class="inventory_item_price" data-test="inventory_item_price">$99.99</div>
                    <button class="btn btn_primary btn_small btn_inventory" data-test="add-to-cart-test-jacket">Add to cart</button>
                </div>
            </div>`,
        );
        await route.fulfill({
            status: 200,
            headers: { 'content-type': 'text/html' },
            body,
        });
    });
}

export async function mockAddToCart500(page: Page) {
  // Intercept a fake endpoint we'll call via script to simulate server failure
  await page.route('**/mock/add-to-cart', async (route) => {
    await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Server error' }) });
  });
  await page.addInitScript(() => {
    // Monkey-patch add-to-cart buttons to call our mock endpoint and show UI error on 500
    function attach() {
      const buttons = document.querySelectorAll('button.btn_inventory');
      buttons.forEach((b) => {
        b.addEventListener('click', async (ev) => {
          ev.preventDefault();
          try {
            const res = await fetch('/mock/add-to-cart', { method: 'POST' });
            if (!res.ok) throw new Error('Failed add-to-cart');
          } catch (e) {
            let banner = document.getElementById('api-error');
            if (!banner) {
              banner = document.createElement('div');
              banner.id = 'api-error';
              banner.textContent = 'Add to cart failed (simulated 500).';
              banner.setAttribute('data-test', 'api-error');
              banner.setAttribute('style', 'background:#ffdddd;color:#900;padding:8px;margin:8px 0;');
              document.querySelector('#header_container')?.after(banner);
            }
          }
        });
      });
    }
    window.addEventListener('load', attach);
  });
}