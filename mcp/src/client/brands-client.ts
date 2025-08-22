import { BaseClient } from "./base-client.js";

export class BrandsClient extends BaseClient {

  async create(request: any) {
    const res = await this.request('POST', `/brands`, request);
    return await this.toJson(res);
  }

  async get(brandId: string) {
    const res = await this.request('GET', `/brands/${brandId}`);
    return await this.toJson(res);
  }

  async list(request?: { cursor?: string, limit?: number }) {
    const queryParams = request ? new URLSearchParams(
      Object.entries(request)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const route = queryParams
      ? `/brands?${queryParams}`
      : `/brands`;
    const res = await this.request('GET', route);
    return await this.toJson(res);
  }
} 