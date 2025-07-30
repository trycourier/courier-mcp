import Http from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class ProfilesClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  async getProfile(userId: string) {
    return await Http.get({
      url: `${this.options.baseUrl}/profiles/${userId}`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async create(userId: string, request: any) {
    return await Http.post({
      url: `${this.options.baseUrl}/profiles/${userId}`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: request,
    });
  }

  async replace(userId: string, request: any) {
    return await Http.put({
      url: `${this.options.baseUrl}/profiles/${userId}`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: request,
    });
  }

  async mergeProfile(userId: string, request: any) {
    return await Http.patch({
      url: `${this.options.baseUrl}/profiles/${userId}`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: request,
    });
  }

  async delete(userId: string) {
    return await Http.delete({
      url: `${this.options.baseUrl}/profiles/${userId}`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getListSubscriptions(userId: string, request?: any) {
    const queryParams = request ? new URLSearchParams(request).toString() : '';
    const url = queryParams
      ? `${this.options.baseUrl}/profiles/${userId}/lists?${queryParams}`
      : `${this.options.baseUrl}/profiles/${userId}/lists`;

    return await Http.get({
      url,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async subscribeToLists(userId: string, request: any) {
    return await Http.post({
      url: `${this.options.baseUrl}/profiles/${userId}/lists`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: request,
    });
  }

  async deleteListSubscription(userId: string) {
    return await Http.delete({
      url: `${this.options.baseUrl}/profiles/${userId}/lists`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

}