import Http from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class MessagesClient {
  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  // GET /messages
  async list(queryParams?: Record<string, any>) {
    const url = new URL(`${this.options.baseUrl}/messages`);
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value);
        }
      });
    }
    return await Http.get({
      url: url.toString(),
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }

  // GET /messages/{message_id}
  async get(messageId: string) {
    return await Http.get({
      url: `${this.options.baseUrl}/messages/${messageId}`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }

  // POST /messages/{message_id}/cancel
  async cancel(messageId: string) {
    return await Http.post({
      url: `${this.options.baseUrl}/messages/${messageId}/cancel`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }

  // GET /messages/{message_id}/history
  async getHistory(messageId: string) {
    return await Http.get({
      url: `${this.options.baseUrl}/messages/${messageId}/history`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }

  // GET /messages/{message_id}/output
  async getContent(messageId: string) {
    return await Http.get({
      url: `${this.options.baseUrl}/messages/${messageId}/output`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }

  // PUT /requests/{request_id}/archive
  async archive(requestId: string) {
    return await Http.put({
      url: `${this.options.baseUrl}/requests/${requestId}/archive`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }
}