import { BaseClient } from "./base-client.js";

export class MessagesClient extends BaseClient {

  // GET /messages
  async list(request?: Record<string, any>) {
    const queryParams = request ? new URLSearchParams(
      Object.entries(request)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const route = queryParams
      ? `/messages?${queryParams}`
      : `/messages`;

    const res = await this.request('GET', route);
    return await this.toJson(res);
  }

  // GET /messages/{message_id}
  async get(messageId: string) {
    const res = await this.request('GET', `/messages/${messageId}`);
    return await this.toJson(res);
  }

  // POST /messages/{message_id}/cancel
  async cancel(messageId: string) {
    const res = await this.request('POST', `/messages/${messageId}/cancel`);
    return await this.toJson(res);
  }

  // GET /messages/{message_id}/history
  async getHistory(messageId: string) {
    const res = await this.request('GET', `/messages/${messageId}/history`);
    return await this.toJson(res);
  }

  // GET /messages/{message_id}/output
  async getContent(messageId: string) {
    const res = await this.request('GET', `/messages/${messageId}/output`);
    return await this.toJson(res);
  }

  // PUT /requests/{request_id}/archive
  async archive(requestId: string) {
    const res = await this.request('PUT', `/requests/${requestId}/archive`);
    return await this.toJson(res);
  }
}