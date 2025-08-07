import Http from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class BrandsClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  async create(request: any) {
    return await Http.post({
      options: this.options,
      route: `/brands`,
      body: request,
    });
  }

  async get(brandId: string) {
    return await Http.get({
      options: this.options,
      route: `/brands/${brandId}`,
    });
  }

  async list(request?: { cursor?: string, limit?: number }) {
    const queryParams = request ? new URLSearchParams(
      Object.entries(request)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const url = queryParams
      ? `${this.options.baseUrl}/brands?${queryParams}`
      : `${this.options.baseUrl}/brands`;

    return await Http.get({
      options: this.options,
      route: `/brands?${queryParams}`,
    });
  }
} 