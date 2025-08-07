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
    const route = queryParams
      ? `/notifications?${queryParams}`
      : `/notifications`;

    return await Http.get({
      options: this.options,
      route,
    });
  }

  async getContent(notificationId: string) {
    return await Http.get({
      options: this.options,
      route: `/notifications/${notificationId}/content`,
    });
  }

  async getDraftContent(notificationId: string) {
    return await Http.get({
      options: this.options,
      route: `/notifications/${notificationId}/draft/content`,
    });
  }

  async getSubmissionChecks(notificationId: string, submissionId: string) {
    return await Http.get({
      options: this.options,
      route: `/notifications/${notificationId}/${submissionId}/checks`,
    });
  }
} 