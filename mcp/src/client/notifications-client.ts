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

    const res = await this.request('GET', route);
    return await this.toJson(res);
  }

  async getContent(notificationId: string) {
    const res = await this.request('GET', `/notifications/${notificationId}/content`);
    return await this.toJson(res);
  }

  async getDraftContent(notificationId: string) {
    const res = await this.request('GET', `/notifications/${notificationId}/draft/content`);
    return await this.toJson(res);
  }

  async getSubmissionChecks(notificationId: string, submissionId: string) {
    const res = await this.request('GET', `/notifications/${notificationId}/${submissionId}/checks`);
    return await this.toJson(res);
  }
} 