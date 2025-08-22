import Http, { toJson } from "../utils/http.js";
import { BaseClient } from "./base-client.js";

export class BulkClient extends BaseClient {

  async createJob(request: any) {
    const res = await Http.post({
      client: this.client,
      route: `/bulk`,
      body: request,
    });
    return await toJson(this.client, res);
  }

  async ingestUsers(jobId: string, request: any) {
    const res = await Http.post({
      client: this.client,
      route: `/bulk/${jobId}`,
      body: request,
    });
    return await toJson(this.client, res);
  }

  async runJob(jobId: string) {
    const res = await Http.post({
      client: this.client,
      route: `/bulk/${jobId}/run`,
    });
    return await toJson(this.client, res);
  }

  async getJob(jobId: string) {
    const res = await Http.get({
      client: this.client,
      route: `/bulk/${jobId}`,
    });
    return await toJson(this.client, res);
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
      client: this.client,
      route,
    });
    return await toJson(this.client, res);
  }
} 