import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login.page';
import { getTestData } from '@utils/data.fixture';

test.describe('login @regression', () => {
  test('happy path with storage state reuse', async ({ page }) => {
    await page.goto('/inventory.html');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('locked out user negative', async ({ page }) => {
    const data = await getTestData();
    const locked = data.users.find((u) => u.username === 'locked_out_user')!;
    const login = new LoginPage(page);
    await login.goto();
    await login.loginExpectError(locked.username, locked.password);
    await expect(login.error).toContainText('locked out');
  });
});