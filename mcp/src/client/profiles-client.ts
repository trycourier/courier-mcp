import Http, { toJson } from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class ProfilesClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  async getProfile(userId: string) {
    const res = await Http.get({
      options: this.options,
      route: `/profiles/${userId}`,
    });
    return await toJson(res);
  }

  async create(userId: string, request: any) {
    const res = await Http.post({
      options: this.options,
      route: `/profiles/${userId}`,
      body: {
        profile: request,
      },
    });
    return await toJson(res);
  }

  async replace(userId: string, request: any) {
    const res = await Http.put({
      options: this.options,
      route: `/profiles/${userId}`,
      body: {
        profile: request,
      },
    });
    return await toJson(res);
  }

  async mergeProfile(userId: string, request: any) {
    const res = await Http.patch({
      options: this.options,
      route: `/profiles/${userId}`,
      body: {
        profile: request,
      },
    });
    return await toJson(res);
  }

  async delete(userId: string) {
    const res = await Http.delete({
      options: this.options,
      route: `/profiles/${userId}`,
    });
    return await toJson(res);
  }

  async getListSubscriptions(userId: string, request?: any) {
    const queryParams = request ? new URLSearchParams(request).toString() : '';
    const route = queryParams
      ? `/profiles/${userId}/lists?${queryParams}`
      : `/profiles/${userId}/lists`;

    const res = await Http.get({
      options: this.options,
      route,
    });
    return await toJson(res);
  }

  async subscribeToLists(userId: string, request: any) {
    const res = await Http.post({
      options: this.options,
      route: `/profiles/${userId}/lists`,
      body: request,
    });
    return await toJson(res);
  }

  async deleteListSubscription(userId: string) {
    const res = await Http.delete({
      options: this.options,
      route: `/profiles/${userId}/lists`,
    });
    return await toJson(res);
  }

}