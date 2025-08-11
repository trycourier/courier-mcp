import Http, { toJson } from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class MessagesClient {
  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

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
      options: this.options,
      route,
    });
    return await toJson(res);
  }

  // GET /messages/{message_id}
  async get(messageId: string) {
    const res = await Http.get({
      options: this.options,
      route: `/messages/${messageId}`,
    });
    return await toJson(res);
  }

  // POST /messages/{message_id}/cancel
  async cancel(messageId: string) {
    const res = await Http.post({
      options: this.options,
      route: `/messages/${messageId}/cancel`,
    });
    return await toJson(res);
  }

  // GET /messages/{message_id}/history
  async getHistory(messageId: string) {
    const res = await Http.get({
      options: this.options,
      route: `/messages/${messageId}/history`,
    });
    return await toJson(res);
  }

  // GET /messages/{message_id}/output
  async getContent(messageId: string) {
    const res = await Http.get({
      options: this.options,
      route: `/messages/${messageId}/output`,
    });
    return await toJson(res);
  }

  // PUT /requests/{request_id}/archive
  async archive(requestId: string) {
    const res = await Http.put({
      options: this.options,
      route: `/requests/${requestId}/archive`,
    });
    return await toJson(res);
  }
}