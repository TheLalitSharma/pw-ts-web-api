import { Locator, Page, expect } from '@playwright/test';
import { Logger } from '@core/logger';

export class PageWrapper {
  constructor(private readonly page: Page) {}

  private async highlight(locator: Locator) {
    await locator.evaluate((el) => {
      const prev = (el as HTMLElement).style.outline;
      (el as HTMLElement).style.outline = '2px solid #ff8800';
      setTimeout(() => ((el as HTMLElement).style.outline = prev), 250);
    }).catch(() => {});
  }

  async click(locator: Locator, step = 'click') {
    await this.tryStep(step, async () => {
      await this.highlight(locator);
      await locator.click({ timeout: 10_000 });
    });
  }

  async type(locator: Locator, text: string, step = 'type') {
    await this.tryStep(step, async () => {
      await this.highlight(locator);
      await locator.fill(text, { timeout: 10_000 });
    });
  }

  async assertVisible(locator: Locator, step = 'assert visible') {
    await this.tryStep(step, async () => {
      await expect(locator).toBeVisible();
    });
  }

  async assertText(locator: Locator, text: string) {
    await this.tryStep(`assert text "${text}"`, async () => {
      await expect(locator).toHaveText(text);
    });
  }

  private async tryStep(step: string, fn: () => Promise<void>, attempt = 1) {
    Logger.info(`➡️  ${step} (attempt ${attempt})`);
    try {
      await fn();
    } catch (e) {
      if (attempt < 2) {
        Logger.warn(`Retrying: ${step}`);
        await this.page.waitForTimeout(150);
        await this.tryStep(step, fn, attempt + 1);
      } else {
        await this.page.screenshot({ path: `test-results/${Date.now()}-error.png`, fullPage: true });
        Logger.error(`Step failed: ${step}`);
        throw e;
      }
    }
  }
}