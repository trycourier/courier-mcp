import Http from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class ProfilesClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  async getProfile(userId: string) {
    return await Http.get({
      options: this.options,
      route: `/profiles/${userId}`,
    });
  }

  async create(userId: string, request: any) {
    return await Http.post({
      options: this.options,
      route: `/profiles/${userId}`,
      body: {
        profile: request,
      },
    });
  }

  async replace(userId: string, request: any) {
    return await Http.put({
      options: this.options,
      route: `/profiles/${userId}`,
      body: {
        profile: request,
      },
    });
  }

  async mergeProfile(userId: string, request: any) {
    return await Http.patch({
      options: this.options,
      route: `/profiles/${userId}`,
      body: {
        profile: request,
      },
    });
  }

  async delete(userId: string) {
    return await Http.delete({
      options: this.options,
      route: `/profiles/${userId}`,
    });
  }

  async getListSubscriptions(userId: string, request?: any) {
    const queryParams = request ? new URLSearchParams(request).toString() : '';
    const route = queryParams
      ? `/profiles/${userId}/lists?${queryParams}`
      : `/profiles/${userId}/lists`;

    return await Http.get({
      options: this.options,
      route,
    });
  }

  async subscribeToLists(userId: string, request: any) {
    return await Http.post({
      options: this.options,
      route: `/profiles/${userId}/lists`,
      body: request,
    });
  }

  async deleteListSubscription(userId: string) {
    return await Http.delete({
      options: this.options,
      route: `/profiles/${userId}/lists`,
    });
  }

}