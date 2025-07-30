import Http from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class NotificationsClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  async list(request?: { cursor?: string, limit?: number, draft?: boolean }) {
    const queryParams = request ? new URLSearchParams(
      Object.entries(request)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const url = queryParams
      ? `${this.options.baseUrl}/notifications?${queryParams}`
      : `${this.options.baseUrl}/notifications`;

    return await Http.get({
      url,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }

  async getContent(notificationId: string) {
    return await Http.get({
      url: `${this.options.baseUrl}/notifications/${notificationId}/content`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }

  async getDraftContent(notificationId: string) {
    return await Http.get({
      url: `${this.options.baseUrl}/notifications/${notificationId}/draft/content`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }

  async getSubmissionChecks(notificationId: string, submissionId: string) {
    return await Http.get({
      url: `${this.options.baseUrl}/notifications/${notificationId}/${submissionId}/checks`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }
} 