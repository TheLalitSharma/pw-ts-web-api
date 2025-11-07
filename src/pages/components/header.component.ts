import { Locator, Page } from '@playwright/test';
import { PageWrapper } from '@wrappers/page.wrapper';

export class HeaderComponent extends PageWrapper {
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('#shopping_cart_container a');
    this.sortSelect = page.locator('[data-test="product_sort_container"]');
  }

  async openCart() {
    await this.click(this.cartLink, 'open cart');
  }

  async selectSort(value: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.type(this.sortSelect, value, `sort ${value}`);
  }
}