import Http from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class AudiencesClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  // Get an audience by its ID
  async get(audienceId: string) {
    return await Http.get({
      url: `${this.options.baseUrl}/audiences/${audienceId}`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }

  // Create or update an audience by its ID
  async update(audienceId: string, request: any) {
    return await Http.put({
      url: `${this.options.baseUrl}/audiences/${audienceId}`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
      body: request,
    });
  }

  // Delete an audience by its ID
  async delete(audienceId: string) {
    return await Http.delete({
      url: `${this.options.baseUrl}/audiences/${audienceId}`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }

  // List members of an audience
  async listMembers(audienceId: string, request?: { cursor?: string, limit?: number }) {
    const queryParams = request ? new URLSearchParams(
      Object.entries(request)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const url = queryParams
      ? `${this.options.baseUrl}/audiences/${audienceId}/members?${queryParams}`
      : `${this.options.baseUrl}/audiences/${audienceId}/members`;

    return await Http.get({
      url,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }

  // List all audiences
  async listAudiences(request?: { cursor?: string, limit?: number }) {
    const queryParams = request ? new URLSearchParams(
      Object.entries(request)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const url = queryParams
      ? `${this.options.baseUrl}/audiences?${queryParams}`
      : `${this.options.baseUrl}/audiences`;

    return await Http.get({
      url,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }
}