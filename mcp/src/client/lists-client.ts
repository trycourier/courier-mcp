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

    const res = await this.request('GET', route);
    return await this.json(res);
  }

  async get(listId: string) {
    const res = await this.request('GET', `/lists/${listId}`);
    return await this.json(res);
  }

  async update(listId: string, request: any) {
    const res = await this.request('PUT', `/lists/${listId}`, request);
    return await this.json(res);
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

    const res = await this.request('GET', route);
    return await this.json(res);
  }

  async subscribe(listId: string, userId: string, request?: any) {
    const res = await this.request('PUT', `/lists/${listId}/subscriptions/${userId}`, request || {});
    return await this.json(res);
  }

  async unsubscribe(listId: string, userId: string) {
    const res = await this.request('DELETE', `/lists/${listId}/subscriptions/${userId}`);
    return await this.json(res);
  }
} 