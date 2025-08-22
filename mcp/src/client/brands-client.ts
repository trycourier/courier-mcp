import Http, { toJson } from "../utils/http.js";
import { BaseClient } from "./base-client.js";

export class BrandsClient extends BaseClient {

  async create(request: any) {
    const res = await Http.post({
      client: this.client,
      route: `/brands`,
      body: request,
    });
    return await toJson(this.client, res);
  }

  async get(brandId: string) {
    const res = await Http.get({
      client: this.client,
      route: `/brands/${brandId}`,
    });
    return await toJson(this.client, res);
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
    const res = await Http.get({
      client: this.client,
      route,
    });
    return await toJson(this.client, res);
  }
} 