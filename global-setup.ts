import {chromium, expect} from '@playwright/test';
import * as fs from 'fs';
import path from 'path';

export default async () => {
    const dir = path.resolve('.auth');
    if(!fs.existsSync(dir)) fs.mkdirSync(dir);
    const browser = await chromium.launch();
    
    const page = await browser.newPage({ baseURL: 'https://www.saucedemo.com' });

    await page.goto('/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory\.html/);

    await page.context().storageState({ path: path.join(dir, 'storageState.json') });
    await browser.close();
};