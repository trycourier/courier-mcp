import Http, { toJson } from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class AuditEventsClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  async get(auditEventId: string) {
    const res = await Http.get({
      options: this.options,
      route: `/audit-events/${auditEventId}`,
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
      ? `${this.options.baseUrl}/audit-events?${queryParams}`
      : `${this.options.baseUrl}/audit-events`;
    const res = await Http.get({
      options: this.options,
      route,
    });
    return await toJson(res);
  }
} 