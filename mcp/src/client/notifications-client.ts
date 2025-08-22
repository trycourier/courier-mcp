import Http, { toJson } from "../utils/http.js";
import { BaseClient } from "./base-client.js";

export class NotificationsClient extends BaseClient {

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
      client: this.client,
      route,
    });
    return await toJson(this.client, res);
  }

  async getContent(notificationId: string) {
    const res = await Http.get({
      client: this.client,
      route: `/notifications/${notificationId}/content`,
    });
    return await toJson(this.client, res);
  }

  async getDraftContent(notificationId: string) {
    const res = await Http.get({
      client: this.client,
      route: `/notifications/${notificationId}/draft/content`,
    });
    return await toJson(this.client, res);
  }

  async getSubmissionChecks(notificationId: string, submissionId: string) {
    const res = await Http.get({
      client: this.client,
      route: `/notifications/${notificationId}/${submissionId}/checks`,
    });
    return await toJson(this.client, res);
  }
} 