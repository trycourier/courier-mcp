import { BaseClient } from "./base-client.js";

export class AuditEventsClient extends BaseClient {

  async get(auditEventId: string) {
    const res = await this.request('GET', `/audit-events/${auditEventId}`);
    return await this.toJson(res);
  }

  async list(request?: { cursor?: string, limit?: number }) {
    const queryParams = request ? new URLSearchParams(
      Object.entries(request)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const route = queryParams
      ? `/audit-events?${queryParams}`
      : `/audit-events`;
    const res = await this.request('GET', route);
    return await this.toJson(res);
  }
} 