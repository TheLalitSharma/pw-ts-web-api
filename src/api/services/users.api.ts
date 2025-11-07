import { HttpClient } from '@core/http.client';
import { GoUser } from '@api/models/user';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import userSchema from '@api/schema/user.schema.json';
import { expect } from '@playwright/test';

export class UsersApi {
  constructor(private readonly client: HttpClient) {}

  static ajv = new Ajv({ allErrors: true, strict: false });
  static validator = addFormats(UsersApi.ajv).compile<GoUser>(userSchema as any);

  async create(user: GoUser) {
    const res = await this.client.post('/public/v2/users', user);
    expect(res.status(), 'create should return 201').toBe(201);
    const body = (await res.json()) as GoUser;
    expect(UsersApi.validator(body), JSON.stringify(UsersApi.validator.errors, null, 2)).toBeTruthy();
    return body;
  }

  async get(id: number) {
    const res = await this.client.get(`/public/v2/users/${id}`);
    const body = (await res.json()) as GoUser;
    expect(UsersApi.validator(body)).toBeTruthy();
    return body;
  }

  async update(id: number, patch: Partial<GoUser>) {
    const res = await this.client.patch(`/public/v2/users/${id}`, patch);
    expect([200, 201]).toContain(res.status());
    return (await res.json()) as GoUser;
  }

  async remove(id: number) {
    const res = await this.client.delete(`/public/v2/users/${id}`);
    expect(res.status()).toBe(204);
  }
}