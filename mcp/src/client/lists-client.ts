import Http, { toJson } from "../utils/http.js";
import { BaseClient } from "./base-client.js";

export class ListsClient extends BaseClient {

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
      client: this.client,
      route,
    });
    return await toJson(this.client, res);
  }

  async get(listId: string) {
    const res = await Http.get({
      client: this.client,
      route: `/lists/${listId}`,
    });
    return await toJson(this.client, res);
  }

  async update(listId: string, request: any) {
    const res = await Http.put({
      client: this.client,
      route: `/lists/${listId}`,
      body: request,
    });
    return await toJson(this.client, res);
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
      client: this.client,
      route,
    });
    return await toJson(this.client, res);
  }

  async subscribe(listId: string, userId: string, request?: any) {
    const res = await Http.put({
      client: this.client,
      route: `/lists/${listId}/subscriptions/${userId}`,
      body: request || {},
    });
    return await toJson(this.client, res);
  }

  async unsubscribe(listId: string, userId: string) {
    const res = await Http.delete({
      client: this.client,
      route: `/lists/${listId}/subscriptions/${userId}`,
    });
    return await toJson(this.client, res);
  }
} 