import Http, { toJson } from "../utils/http.js";
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

    const res = await Http.get({
      options: this.options,
      route,
    });
    return await toJson(res);
  }

  async getContent(notificationId: string) {
    const res = await Http.get({
      options: this.options,
      route: `/notifications/${notificationId}/content`,
    });
    return await toJson(res);
  }

  async getDraftContent(notificationId: string) {
    const res = await Http.get({
      options: this.options,
      route: `/notifications/${notificationId}/draft/content`,
    });
    return await toJson(res);
  }

  async getSubmissionChecks(notificationId: string, submissionId: string) {
    const res = await Http.get({
      options: this.options,
      route: `/notifications/${notificationId}/${submissionId}/checks`,
    });
    return await toJson(res);
  }
} 