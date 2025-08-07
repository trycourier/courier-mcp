import Http from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class BulkClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  async createJob(request: any) {
    return await Http.post({
      options: this.options,
      route: `/bulk`,
      body: request,
    });
  }

  async ingestUsers(jobId: string, request: any) {
    return await Http.post({
      options: this.options,
      route: `/bulk/${jobId}`,
      body: request,
    });
  }

  async runJob(jobId: string) {
    return await Http.post({
      options: this.options,
      route: `/bulk/${jobId}/run`,
    });
  }

  async getJob(jobId: string) {
    return await Http.get({
      options: this.options,
      route: `/bulk/${jobId}`,
    });
  }

  async getUsers(jobId: string, request?: { cursor?: string, limit?: number }) {
    const queryParams = request ? new URLSearchParams(
      Object.entries(request)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const route = queryParams
      ? `/bulk/${jobId}/users?${queryParams}`
      : `/bulk/${jobId}/users`;

    return await Http.get({
      options: this.options,
      route: route,
    });
  }
} 