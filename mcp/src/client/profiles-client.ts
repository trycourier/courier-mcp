import { BaseClient } from "./base-client.js";

export class ProfilesClient extends BaseClient {

  async getProfile(userId: string) {
    const res = await this.request('GET', `/profiles/${userId}`);
    return await this.toJson(res);
  }

  async create(userId: string, request: any) {
    const res = await this.request('POST', `/profiles/${userId}`, {
      profile: request,
    });
    return await this.toJson(res);
  }

  async replace(userId: string, request: any) {
    const res = await this.request('PUT', `/profiles/${userId}`, {
      profile: request,
    });
    return await this.toJson(res);
  }

  async mergeProfile(userId: string, request: any) {
    const res = await this.request('PATCH', `/profiles/${userId}`, {
      profile: request,
    });
    return await this.toJson(res);
  }

  async delete(userId: string) {
    const res = await this.request('DELETE', `/profiles/${userId}`);
    return await this.toJson(res);
  }

  async getListSubscriptions(userId: string, request?: Record<string, any>) {
    const queryParams = request
      ? new URLSearchParams(
        Object.entries(request)
          .filter(([_, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      ).toString()
      : '';
    const route = queryParams
      ? `/profiles/${userId}/lists?${queryParams}`
      : `/profiles/${userId}/lists`;

    const res = await this.request('GET', route);
    return await this.toJson(res);
  }

  async subscribeToLists(userId: string, request: any) {
    const res = await this.request('POST', `/profiles/${userId}/lists`, request);
    return await this.toJson(res);
  }

  async deleteListSubscription(userId: string) {
    const res = await this.request('DELETE', `/profiles/${userId}/lists`);
    return await this.toJson(res);
  }

}