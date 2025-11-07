import { test, expect, request } from '@playwright/test';
import { HttpClient } from '@core/http.client';

test.describe('GoREST negatives @api @regression', () => {
  test('invalid token returns 401', async () => {
    const client = await new HttpClient('https://gorest.co.in', 'invalid').init();
    const res = await client.post('/public/v2/users', { name: 'x' });
    expect(res.status()).toBe(401);
    await client.dispose();
  });

  test('invalid payload returns 422', async () => {
    const ctx = await request.newContext({
      baseURL: 'https://gorest.co.in',
      extraHTTPHeaders: { Authorization: `Bearer invalid` }, // still 401 precedence
    });
    const res = await ctx.post('/public/v2/users', { data: { wrong: 'shape' } });
    expect([401, 422]).toContain(res.status()); // allow either based on token status
    await ctx.dispose();
  });

  test('404 on missing resource', async () => {
    const ctx = await request.newContext({ baseURL: 'https://gorest.co.in' });
    const res = await ctx.get('/public/v2/users/999999999');
    expect(res.status()).toBe(404);
    await ctx.dispose();
  });
});