import { Locator, Page, expect } from '@playwright/test';

export async function expectPageScreenshot(page: Page, name: string, masks?: Locator[]) {
  await expect(page).toHaveScreenshot(`${name}.png`, {
    mask: masks,
    maxDiffPixelRatio: 0.02
  });
}