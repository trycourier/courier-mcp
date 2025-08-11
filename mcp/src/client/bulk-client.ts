import Http, { toJson } from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class BulkClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  async createJob(request: any) {
    const res = await Http.post({
      options: this.options,
      route: `/bulk`,
      body: request,
    });
    return await toJson(res);
  }

  async ingestUsers(jobId: string, request: any) {
    const res = await Http.post({
      options: this.options,
      route: `/bulk/${jobId}`,
      body: request,
    });
    return await toJson(res);
  }

  async runJob(jobId: string) {
    const res = await Http.post({
      options: this.options,
      route: `/bulk/${jobId}/run`,
    });
    return await toJson(res);
  }

  async getJob(jobId: string) {
    const res = await Http.get({
      options: this.options,
      route: `/bulk/${jobId}`,
    });
    return await toJson(res);
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

    const res = await Http.get({
      options: this.options,
      route,
    });
    return await toJson(res);
  }
} 