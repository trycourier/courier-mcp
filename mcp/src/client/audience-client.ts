import { BaseClient } from "./base-client.js";

export class AudiencesClient extends BaseClient {

  // Get an audience by its ID
  async get(audienceId: string) {
    const res = await this.request('GET', `/audiences/${audienceId}`);
    return await this.toJson(res);
  }

  // Create or update an audience by its ID
  async update(audienceId: string, request: any) {
    const res = await this.request('PUT', `/audiences/${audienceId}`, request);
    return await this.toJson(res);
  }

  // Delete an audience by its ID
  async delete(audienceId: string) {
    const res = await this.request('DELETE', `/audiences/${audienceId}`);
    return await this.toJson(res);
  }

  // List members of an audience
  async listMembers(audienceId: string, request?: { cursor?: string, limit?: number }) {
    const queryParams = request ? new URLSearchParams(
      Object.entries(request)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const route = queryParams
      ? `/audiences/${audienceId}/members?${queryParams}`
      : `/audiences/${audienceId}/members`;
    const res = await this.request('GET', route);
    return await this.toJson(res);
  }

  // List all audiences
  async listAudiences(request?: { cursor?: string, limit?: number }) {
    const queryParams = request ? new URLSearchParams(
      Object.entries(request)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const route = queryParams
      ? `/audiences?${queryParams}`
      : `/audiences`;
    const res = await this.request('GET', route);
    return await this.toJson(res);
  }
}