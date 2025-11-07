import { Locator, Page, expect } from '@playwright/test';
import { PageWrapper } from '@wrappers/page.wrapper';

export class CheckoutPage extends PageWrapper {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueBtn: Locator;
  readonly finishBtn: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.postalCode = page.getByPlaceholder('Zip/Postal Code');
    this.continueBtn = page.getByRole('button', { name: 'Continue' });
    this.finishBtn = page.getByRole('button', { name: 'Finish' });
    this.completeHeader = page.locator('.complete-header');
  }

  async fillInfo(first: string, last: string, zip: string) {
    await this.type(this.firstName, first);
    await this.type(this.lastName, last);
    await this.type(this.postalCode, zip);
  }

  async placeOrder() {
    await this.click(this.continueBtn, 'continue');
    await this.click(this.finishBtn, 'finish');
    await this.assertVisible(this.completeHeader);
    await expect(this.completeHeader).toHaveText(/thank you for your order/i);
  }
}