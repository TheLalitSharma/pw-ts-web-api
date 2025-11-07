import path from 'path';
import { Env } from '@config/env';
import { readJson } from './json.util';
import { readYaml } from './yaml.util';
import { readUsersFromExcel } from './excel.util';

type TestData = {
  users: { username: string; password: string }[];
  checkout: { firstName: string; lastName: string; postalCode: string };
  products: string[];
};

const baseFixture: TestData = {
  users: [
    { username: 'standard_user', password: 'secret_sauce' },
    { username: 'locked_out_user', password: 'secret_sauce' }
  ],
  checkout: { firstName: 'John', lastName: 'Doe', postalCode: '12345' },
  products: ['Sauce Labs Backpack']
};

export async function getTestData(): Promise<TestData> {
  const root = path.resolve('src/config');
  const source = Env.dataSource;
  if (source === 'excel') {
    const excelPath = path.join(root, 'excel', 'users.xlsx');
    const users = await readUsersFromExcel(excelPath);
    return { ...baseFixture, users };
  }
  if (source === 'yaml') return readYaml<TestData>(path.join(root, 'testdata.yaml'));
  if (source === 'json') return readJson<TestData>(path.join(root, 'testdata.json'));
  return baseFixture;
}