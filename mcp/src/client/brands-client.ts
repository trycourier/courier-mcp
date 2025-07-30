import Http from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class BrandsClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  async create(request: any) {
    return await Http.post({
      url: `${this.options.baseUrl}/brands`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
      body: request,
    });
  }

  async get(brandId: string) {
    return await Http.get({
      url: `${this.options.baseUrl}/brands/${brandId}`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
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
      url,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }
} 