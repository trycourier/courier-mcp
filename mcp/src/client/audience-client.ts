import Http, { toJson } from "../utils/http.js";
import { BaseClient } from "./base-client.js";

export class AudiencesClient extends BaseClient {

  // Get an audience by its ID
  async get(audienceId: string) {
    const res = await Http.get({
      client: this.client,
      route: `/audiences/${audienceId}`,
    });
    return await toJson(this.client, res);
  }

  // Create or update an audience by its ID
  async update(audienceId: string, request: any) {
    const res = await Http.put({
      client: this.client,
      route: `/audiences/${audienceId}`,
      body: request,
    });
    return await toJson(this.client, res);
  }

  // Delete an audience by its ID
  async delete(audienceId: string) {
    const res = await Http.delete({
      client: this.client,
      route: `/audiences/${audienceId}`,
    });
    return await toJson(this.client, res);
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
    const res = await Http.get({ client: this.client, route });
    return await toJson(this.client, res);
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
    const res = await Http.get({ client: this.client, route });
    return await toJson(this.client, res);
  }
}