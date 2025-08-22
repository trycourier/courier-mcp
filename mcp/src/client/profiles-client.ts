import Http, { toJson } from "../utils/http.js";
import { BaseClient } from "./base-client.js";

export class ProfilesClient extends BaseClient {

  async getProfile(userId: string) {
    const res = await Http.get({
      client: this.client,
      route: `/profiles/${userId}`,
    });
    return await toJson(this.client, res);
  }

  async create(userId: string, request: any) {
    const res = await Http.post({
      client: this.client,
      route: `/profiles/${userId}`,
      body: {
        profile: request,
      },
    });
    return await toJson(this.client, res);
  }

  async replace(userId: string, request: any) {
    const res = await Http.put({
      client: this.client,
      route: `/profiles/${userId}`,
      body: {
        profile: request,
      },
    });
    return await toJson(this.client, res);
  }

  async mergeProfile(userId: string, request: any) {
    const res = await Http.patch({
      client: this.client,
      route: `/profiles/${userId}`,
      body: {
        profile: request,
      },
    });
    return await toJson(this.client, res);
  }

  async delete(userId: string) {
    const res = await Http.delete({
      client: this.client,
      route: `/profiles/${userId}`,
    });
    return await toJson(this.client, res);
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

    const res = await Http.get({
      client: this.client,
      route,
    });
    return await toJson(this.client, res);
  }

  async subscribeToLists(userId: string, request: any) {
    const res = await Http.post({
      client: this.client,
      route: `/profiles/${userId}/lists`,
      body: request,
    });
    return await toJson(this.client, res);
  }

  async deleteListSubscription(userId: string) {
    const res = await Http.delete({
      client: this.client,
      route: `/profiles/${userId}/lists`,
    });
    return await toJson(this.client, res);
  }

}