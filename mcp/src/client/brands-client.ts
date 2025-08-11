import Http, { toJson } from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class BrandsClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  async create(request: any) {
    const res = await Http.post({
      options: this.options,
      route: `/brands`,
      body: request,
    });
    return await toJson(res);
  }

  async get(brandId: string) {
    const res = await Http.get({
      options: this.options,
      route: `/brands/${brandId}`,
    });
    return await toJson(res);
  }

  async list(request?: { cursor?: string, limit?: number }) {
    const queryParams = request ? new URLSearchParams(
      Object.entries(request)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const route = queryParams
      ? `${this.options.baseUrl}/brands?${queryParams}`
      : `${this.options.baseUrl}/brands`;
    const res = await Http.get({
      options: this.options,
      route,
    });
    return await toJson(res);
  }
} 