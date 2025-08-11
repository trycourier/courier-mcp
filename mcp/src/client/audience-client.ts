import Http, { toJson } from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class AudiencesClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  // Get an audience by its ID
  async get(audienceId: string) {
    const res = await Http.get({
      options: this.options,
      route: `/audiences/${audienceId}`,
    });
    return await toJson(res);
  }

  // Create or update an audience by its ID
  async update(audienceId: string, request: any) {
    const res = await Http.put({
      options: this.options,
      route: `/audiences/${audienceId}`,
      body: request,
    });
    return await toJson(res);
  }

  // Delete an audience by its ID
  async delete(audienceId: string) {
    const res = await Http.delete({
      options: this.options,
      route: `/audiences/${audienceId}`,
    });
    return await toJson(res);
  }

  // List members of an audience
  async listMembers(audienceId: string, request?: { cursor?: string, limit?: number }) {
    const queryParams = request ? new URLSearchParams(
      Object.entries(request)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const route = queryParams
      ? `${this.options.baseUrl}/audiences/${audienceId}/members?${queryParams}`
      : `${this.options.baseUrl}/audiences/${audienceId}/members`;
    const res = await Http.get({ options: this.options, route });
    return await toJson(res);
  }

  // List all audiences
  async listAudiences(request?: { cursor?: string, limit?: number }) {
    const queryParams = request ? new URLSearchParams(
      Object.entries(request)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const route = queryParams
      ? `${this.options.baseUrl}/audiences?${queryParams}`
      : `${this.options.baseUrl}/audiences`;
    const res = await Http.get({ options: this.options, route });
    return await toJson(res);
  }
}