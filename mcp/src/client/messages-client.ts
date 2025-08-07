import Http from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class MessagesClient {
  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  // GET /messages
  async list(queryParams?: Record<string, any>) {
    const url = new URL(`/messages`);
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value);
        }
      });
    }
    return await Http.get({
      options: this.options,
      route: url.toString(),
    });
  }

  // GET /messages/{message_id}
  async get(messageId: string) {
    return await Http.get({
      options: this.options,
      route: `/messages/${messageId}`,
    });
  }

  // POST /messages/{message_id}/cancel
  async cancel(messageId: string) {
    return await Http.post({
      options: this.options,
      route: `/messages/${messageId}/cancel`,
    });
  }

  // GET /messages/{message_id}/history
  async getHistory(messageId: string) {
    return await Http.get({
      options: this.options,
      route: `/messages/${messageId}/history`,
    });
  }

  // GET /messages/{message_id}/output
  async getContent(messageId: string) {
    return await Http.get({
      options: this.options,
      route: `/messages/${messageId}/output`,
    });
  }

  // PUT /requests/{request_id}/archive
  async archive(requestId: string) {
    return await Http.put({
      options: this.options,
      route: `/requests/${requestId}/archive`,
    });
  }
}