import { APIRequestContext, request, expect } from '@playwright/test';
import { Logger } from '@core/logger';

export class HttpClient {
    private _ctx!: APIRequestContext;
    constructor(private readonly baseURL: string, private readonly token?: string){}

    async init() {
        this._ctx = await request.newContext({
            baseURL: this.baseURL,
            extraHTTPHeaders: this.token ? { Authorization: `Bearer ${this.token}` } : {},
        });
        return this;
    }

    getctx(){
        return this._ctx;
    }

    async get(path: string, init?: Parameters<APIRequestContext['get']>[1]) {
        Logger.info(`GET ${path}`);
        const res = await this._ctx.get(path, init);
        await expect(res, `GET ${path} should be 2xx`).toBeOK();
        return res;
    }

    async post(path: string, data: unknown, init?: Parameters<APIRequestContext['post']>[1]) {
        Logger.info(`POST ${path}`);
        const res = await this._ctx.post(path, { data, ...init });
        return res;
    }

    async patch(path: string, data: unknown, init?: Parameters<APIRequestContext['patch']>[1]) {
        Logger.info(`PATCH ${path}`);
        const res = await this._ctx.patch(path, { data, ...init });
        return res;
    }

    async delete(path: string, init?: Parameters<APIRequestContext['delete']>[1]) {
        Logger.info(`DELETE ${path}`);
        const res = await this._ctx.delete(path, init);
        return res;
    }

    async dispose() {
        await this._ctx.dispose();
    }
}