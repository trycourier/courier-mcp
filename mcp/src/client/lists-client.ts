import Http from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class ListsClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  async list(request?: { pattern?: string, cursor?: string, limit?: number }) {
    const queryParams = request ? new URLSearchParams(
      Object.entries(request)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const url = queryParams
      ? `${this.options.baseUrl}/lists?${queryParams}`
      : `${this.options.baseUrl}/lists`;

    return await Http.get({
      url,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }

  async get(listId: string) {
    return await Http.get({
      url: `${this.options.baseUrl}/lists/${listId}`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }

  async getSubscribers(listId: string, request?: { cursor?: string, limit?: number }) {
    const queryParams = request ? new URLSearchParams(
      Object.entries(request)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const url = queryParams
      ? `${this.options.baseUrl}/lists/${listId}/subscriptions?${queryParams}`
      : `${this.options.baseUrl}/lists/${listId}/subscriptions`;

    return await Http.get({
      url,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }

  async subscribe(listId: string, userId: string, request?: any) {
    return await Http.put({
      url: `${this.options.baseUrl}/lists/${listId}/subscriptions/${userId}`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
      body: request || {},
    });
  }

  async unsubscribe(listId: string, userId: string) {
    return await Http.delete({
      url: `${this.options.baseUrl}/lists/${listId}/subscriptions/${userId}`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }
} 