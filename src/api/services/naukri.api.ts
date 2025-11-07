import { HttpClient } from '@core/http.client';
import { NaukriUser } from '@api/models/register_naukri';
import { expect, APIRequestContext } from '@playwright/test';

export class NaukriApi {
  constructor(private readonly client: HttpClient) {}

  async create(user: NaukriUser, init?: Parameters<APIRequestContext['post']>[1]) {
    const res = await this.client.post('/cloudgateway-mynaukri/resman-aggregator-services/v0/account', user, init);
    expect(res.status(), 'create should return 200').toBe(200);
    const rawHeaders = res.headers();
    expect(rawHeaders !== undefined).toBeTruthy();
    return rawHeaders;
  }

}