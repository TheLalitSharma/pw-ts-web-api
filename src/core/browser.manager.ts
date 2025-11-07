import { BrowserContext, Page, test } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export async function withHar(
    testName: string, 
    page: Page,
    fn: (page: Page, context: BrowserContext) => Promise<void>
) {
    const context = page.context();
    await test.step(`Start HAR for ${testName}`, async () => {
        const harDir = path.resolve('test-results/har');
        if (!fs.existsSync(harDir)) fs.mkdirSync(harDir, { recursive: true });
        await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
        await fn(page, context);
        await context.tracing.stop({ path: path.join(harDir, `${sanitize(testName)}-trace.zip`) });
    });
    
}

function sanitize(name: string) {
  return name.replace(/[^a-z0-9-_]/gi, '_');
}