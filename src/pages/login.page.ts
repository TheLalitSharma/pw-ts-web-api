import { Locator, Page, expect } from '@playwright/test';
import { PageWrapper } from '@wrappers/page.wrapper';

export class LoginPage extends PageWrapper {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginBtn: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    super(page);
    this.username = page.getByPlaceholder('Username');
    this.password = page.getByPlaceholder('Password');
    this.loginBtn = page.getByRole('button', { name: 'Login' });
    this.error = page.locator('[data-test="error"]');
  }

  async goto() {
    await this['page'].goto('/');
  }

  async login(u: string, p: string) {
    await this.type(this.username, u, 'username');
    await this.type(this.password, p, 'password');
    await this.click(this.loginBtn, 'login');
    await expect(this['page']).toHaveURL(/inventory\.html/);
  }

  async loginExpectError(u: string, p: string) {
    await this.type(this.username, u);
    await this.type(this.password, p);
    await this.click(this.loginBtn);
    await this.assertVisible(this.error);
  }
}