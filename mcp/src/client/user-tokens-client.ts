import Http from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class UserTokensClient {
  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  // GET /users/{user_id}/tokens/{token}
  async getToken(userId: string, token: string) {
    return await Http.get({
      url: `${this.options.baseUrl}/users/${userId}/tokens/${token}`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }

  // GET /users/{user_id}/tokens
  async listTokens(userId: string) {
    return await Http.get({
      url: `${this.options.baseUrl}/users/${userId}/tokens`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }

  // PUT /users/{user_id}/tokens/{token}
  async putToken(userId: string, token: string, body: any) {
    return await Http.put({
      url: `${this.options.baseUrl}/users/${userId}/tokens/${token}`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
      body,
    });
  }

  // PUT /users/{user_id}/tokens
  async putTokens(userId: string, body: any) {
    return await Http.put({
      url: `${this.options.baseUrl}/users/${userId}/tokens`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
      body,
    });
  }

  // PATCH /users/{user_id}/tokens/{token}
  async patchToken(userId: string, token: string, body: any) {
    return await Http.patch({
      url: `${this.options.baseUrl}/users/${userId}/tokens/${token}`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
      body,
    });
  }

  // DELETE /users/{user_id}/tokens/{token}
  async deleteToken(userId: string, token: string) {
    return await Http.delete({
      url: `${this.options.baseUrl}/users/${userId}/tokens/${token}`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
    });
  }
}