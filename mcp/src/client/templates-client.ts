import Http from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class TemplatesClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  async list(request?: { cursor?: string, limit?: number }) {
    const queryParams = request ? new URLSearchParams(
      Object.entries(request)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const route = queryParams
      ? `/templates?${queryParams}`
      : `/templates`;

    return await Http.get({
      options: this.options,
      route,
    });
  }
} 