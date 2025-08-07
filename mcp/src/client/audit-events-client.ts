import Http from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class AuditEventsClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  async get(auditEventId: string) {
    return await Http.get({
      options: this.options,
      route: `/audit-events/${auditEventId}`,
    });
  }

  async list(request?: { cursor?: string, limit?: number }) {
    const queryParams = request ? new URLSearchParams(
      Object.entries(request)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const url = queryParams
      ? `${this.options.baseUrl}/audit-events?${queryParams}`
      : `${this.options.baseUrl}/audit-events`;

    return await Http.get({
      options: this.options,
      route: `/audit-events?${queryParams}`,
    });
  }
} 