import { test, expect } from '@playwright/test';
import { HttpClient } from '@core/http.client';
import { UsersApi } from '@api/services/users.api';
import { Env } from '@config/env';
import { faker } from '@faker-js/faker';

test.describe('GoREST users CRUD @api @smoke', () => {
  test('create, get, update, delete with schema validation', async () => {
    test.skip(!Env.gorestToken, 'API_TOKEN not set');

    const client = await new HttpClient('https://gorest.co.in',
       'fc8c0e9500d1213c994c32eac45ba52a1e1e4d30cb48875b5c9cb0be5ae1393d')//Env.gorestToken)
       .init();
    const api = new UsersApi(client);

    const newUser = await api.create({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      gender: 'male',
      status: 'active',
    });

    const fetched = await api.get(newUser.id!);
    expect(fetched.email).toBe(newUser.email);

    const updated = await api.update(newUser.id!, { status: 'inactive' });
    expect(updated.status).toBe('inactive');

    await api.remove(newUser.id!);
    await client.dispose();
  });
});