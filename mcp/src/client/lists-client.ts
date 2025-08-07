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
    const route = queryParams
      ? `/lists?${queryParams}`
      : `/lists`;

    return await Http.get({
      options: this.options,
      route,
    });
  }

  async get(listId: string) {
    return await Http.get({
      options: this.options,
      route: `/lists/${listId}`,
    });
  }

  async getSubscribers(listId: string, request?: { cursor?: string, limit?: number }) {
    const queryParams = request ? new URLSearchParams(
      Object.entries(request)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const route = queryParams
      ? `/lists/${listId}/subscriptions?${queryParams}`
      : `/lists/${listId}/subscriptions`;

    return await Http.get({
      options: this.options,
      route,
    });
  }

  async subscribe(listId: string, userId: string, request?: any) {
    return await Http.put({
      options: this.options,
      route: `/lists/${listId}/subscriptions/${userId}`,
      body: request || {},
    });
  }

  async unsubscribe(listId: string, userId: string) {
    return await Http.delete({
      options: this.options,
      route: `/lists/${listId}/subscriptions/${userId}`,
    });
  }
} 