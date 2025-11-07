import { Locator, Page } from '@playwright/test';
import { PageWrapper } from '@wrappers/page.wrapper';

export class CartPage extends PageWrapper {
  readonly checkoutBtn: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutBtn = page.getByRole('button', { name: 'Checkout' });
    this.cartItems = page.locator('.cart_item');
  }

  async checkout() {
    await this.click(this.checkoutBtn, 'checkout');
  }
}