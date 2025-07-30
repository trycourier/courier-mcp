import Http from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class BulkClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  async createJob(request: any, options?: any) {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.options.apiKey}`,
    };

    if (options?.idempotencyKey) {
      headers['Idempotency-Key'] = options.idempotencyKey;
    }
    if (options?.idempotencyExpiry) {
      headers['X-Idempotency-Expiry'] = options.idempotencyExpiry;
    }

    return await Http.post({
      url: `${this.options.baseUrl}/bulk`,
      headers,
      body: request,
    });
  }

  async ingestUsers(jobId: string, request: any, options?: any) {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.options.apiKey}`,
    };

    if (options?.idempotencyKey) {
      headers['Idempotency-Key'] = options.idempotencyKey;
    }
    if (options?.idempotencyExpiry) {
      headers['X-Idempotency-Expiry'] = options.idempotencyExpiry;
    }

    return await Http.post({
      url: `${this.options.baseUrl}/bulk/${jobId}`,
      headers,
      body: request,
    });
  }

  async runJob(jobId: string, options?: any) {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.options.apiKey}`,
    };

    if (options?.idempotencyKey) {
      headers['Idempotency-Key'] = options.idempotencyKey;
    }
    if (options?.idempotencyExpiry) {
      headers['X-Idempotency-Expiry'] = options.idempotencyExpiry;
    }

    return await Http.post({
      url: `${this.options.baseUrl}/bulk/${jobId}/run`,
      headers,
      body: {},
    });
  }

  async getJob(jobId: string) {
    return await Http.get({
      url: `${this.options.baseUrl}/bulk/${jobId}`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }

  async getUsers(jobId: string, request?: { cursor?: string, limit?: number }) {
    const queryParams = request ? new URLSearchParams(
      Object.entries(request)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const url = queryParams
      ? `${this.options.baseUrl}/bulk/${jobId}/users?${queryParams}`
      : `${this.options.baseUrl}/bulk/${jobId}/users`;

    return await Http.get({
      url,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }
} 