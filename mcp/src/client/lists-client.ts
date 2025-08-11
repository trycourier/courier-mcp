import Http, { toJson } from "../utils/http.js";
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

    const res = await Http.get({
      options: this.options,
      route,
    });
    return await toJson(res);
  }

  async get(listId: string) {
    const res = await Http.get({
      options: this.options,
      route: `/lists/${listId}`,
    });
    return await toJson(res);
  }

  async update(listId: string, request: any) {
    const res = await Http.put({
      options: this.options,
      route: `/lists/${listId}`,
      body: request,
    });
    return await toJson(res);
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

    const res = await Http.get({
      options: this.options,
      route,
    });
    return await toJson(res);
  }

  async subscribe(listId: string, userId: string, request?: any) {
    const res = await Http.put({
      options: this.options,
      route: `/lists/${listId}/subscriptions/${userId}`,
      body: request || {},
    });
    return await toJson(res);
  }

  async unsubscribe(listId: string, userId: string) {
    const res = await Http.delete({
      options: this.options,
      route: `/lists/${listId}/subscriptions/${userId}`,
    });
    return await toJson(res);
  }
} 