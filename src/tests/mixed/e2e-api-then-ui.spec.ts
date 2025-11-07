import { test, expect } from '@playwright/test';
import { HttpClient } from '@core/http.client';
import { NaukriApi } from '@api/services/naukri.api';
import { NaukriUser } from '@api/models/register_naukri';

function uniqueYopmail() {
  return `ptest.user.${Date.now()}@yopmail.com`;
}

test.describe('mixed API + UI pattern @mixed', () => {
  test('Create user via API then reflect in UI banner', async ({ page }) => {

    const apiUrl = 'https://www.naukri.com/cloudgateway-mynaukri/resman-aggregator-services/v0/account';

    const emailId = uniqueYopmail();

    const payload: NaukriUser = {
        name: 'Test User',
        email: emailId,
        password: 'Naukri@12345',
        mobile: '9999999999',
        userType: 'exp',
        othersrcp: '22636',
        mailer: { UP: true, CS: true, CS2: true, UP2: true, VA: true, PM: true }
    };

    const apiHeaders: Record<string, string> = {
        'accept': 'application/json',
        'appid': '104',
        'clientid': 'd3skt0p',
        'content-type': 'application/json',
        'origin': 'https://www.naukri.com',
        'referer': 'https://www.naukri.com/registration/createAccount?othersrcp=22636',
        'systemid': 'js',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
    };

    
    const client = await new HttpClient('https://www.naukri.com').init();
    const api = new NaukriApi(client);
    const rawResHeaders = await api.create(payload, {
        "headers": apiHeaders
    });

    const headersForInject: Record<string, string> = {};
    for (const [k, v] of Object.entries(rawResHeaders)) {
        // If header value is array-like in string form, keep it as-is. Ensure it's a string.
        headersForInject[k] = typeof v === 'string' ? v : JSON.stringify(v);
    }

    // Use created data in UI via init script
    await page.addInitScript((headers) => {
        try{
            for(const key in headers){
                try {
                window.sessionStorage.setItem(key, JSON.stringify(headers[key]));
                } catch (e) {

            }
            }
        } catch (e) {

        }

      
    }, headersForInject);

    await page.goto('https://www.naukri.com', { waitUntil: 'networkidle' });

    
    const sessionKeys = await page.evaluate(() => Object.keys(sessionStorage));
    console.log('sessionStorage keys after navigation:', sessionKeys);
    expect(sessionKeys.length).toBeGreaterThan(0);

    //Try to find a UI element that indicates the user is logged in. This selector is a best-effort
    const loginIndicatorSelectors = [
        'text=My Naukri',
        'text=Hi',
        'a[title="My Naukri"]',
        'xpath=//a[contains(., "My Naukri")]',
    ];

    let found = false;
    for (const sel of loginIndicatorSelectors) {
        try {
        const locator = page.locator(sel).first();
        if (await locator.count() > 0) {
            if (await locator.isVisible()) {
            found = true;
            break;
            }
        }
        } catch (e) {
        // ignore selector problems and try next
        }
    }

    expect(found, 'Expected to find a UI indicator for logged-in state. If this fails, inspect required session keys or app flow.').toBeTruthy();

    // Extra debug: print few sessionStorage key-values to console
    const sampleEntries = await page.evaluate(() => {
        const out: Record<string, string> = {};
        const keys = Object.keys(sessionStorage).slice(0, 20);
        for (const k of keys) out[k] = sessionStorage.getItem(k) as string;
        return out;
    });
    console.log('Sample sessionStorage entries:', sampleEntries);

  });
});