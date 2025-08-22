import { BaseClient } from "./base-client.js";

export class BulkClient extends BaseClient {

  async createJob(request: any) {
    const res = await this.request('POST', `/bulk`, request);
    return await this.toJson(res);
  }

  async ingestUsers(jobId: string, request: any) {
    const res = await this.request('POST', `/bulk/${jobId}`, request);
    return await this.toJson(res);
  }

  async runJob(jobId: string) {
    const res = await this.request('POST', `/bulk/${jobId}/run`);
    return await this.toJson(res);
  }

  async getJob(jobId: string) {
    const res = await this.request('GET', `/bulk/${jobId}`);
    return await this.toJson(res);
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

    const res = await this.request('GET', route);
    return await this.toJson(res);
  }
} 