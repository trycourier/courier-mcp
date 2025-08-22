import Http, { toJson } from "../utils/http.js";
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

    const res = await Http.get({
      client: this.client,
      route,
    });
    return await toJson(this.client, res);
  }

  // GET /messages/{message_id}
  async get(messageId: string) {
    const res = await Http.get({
      client: this.client,
      route: `/messages/${messageId}`,
    });
    return await toJson(this.client, res);
  }

  // POST /messages/{message_id}/cancel
  async cancel(messageId: string) {
    const res = await Http.post({
      client: this.client,
      route: `/messages/${messageId}/cancel`,
    });
    return await toJson(this.client, res);
  }

  // GET /messages/{message_id}/history
  async getHistory(messageId: string) {
    const res = await Http.get({
      client: this.client,
      route: `/messages/${messageId}/history`,
    });
    return await toJson(this.client, res);
  }

  // GET /messages/{message_id}/output
  async getContent(messageId: string) {
    const res = await Http.get({
      client: this.client,
      route: `/messages/${messageId}/output`,
    });
    return await toJson(this.client, res);
  }

  // PUT /requests/{request_id}/archive
  async archive(requestId: string) {
    const res = await Http.put({
      client: this.client,
      route: `/requests/${requestId}/archive`,
    });
    return await toJson(this.client, res);
  }
}