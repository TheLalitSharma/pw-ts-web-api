import 'dotenv/config';

export const Env = {
    gorestToken: process.env.API_TOKEN ?? 'fc8c0e9500d1213c994c32eac45ba52a1e1e4d30cb48875b5c9cb0be5ae1393d',
    dataSource: (process.env.DATA_SOURCE ?? 'json').toLowerCase(),
    tags: process.env.TAGS,
};