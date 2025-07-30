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
  /**
   * Create or replace a user token.
   * 
   * @param userId - The user ID
   * @param token - The token string (must match the path param)
   * @param params - The token object, e.g.:
   *   {
   *     token: string, // required, must match the path param
   *     provider_key: string, // required, e.g. "firebase-fcm"
   *     expiry_date?: string,
   *     properties?: any,
   *     device?: {
   *       app_id?: string,
   *       ad_id?: string,
   *       device_id?: string,
   *       platform?: string,
   *       manufacturer?: string,
   *       model?: string
   *     },
   *     tracking?: {
   *       os_version?: string,
   *       ip?: string,
   *       lat?: string,
   *       long?: string
   *     }
   *   }
   */
  async putToken(
    userId: string,
    token: string,
    provider_key: string,
    params: {
      expiry_date?: string;
      properties?: any;
      device?: {
        app_id?: string;
        ad_id?: string;
        device_id?: string;
        platform?: string;
        manufacturer?: string;
        model?: string;
      };
      tracking?: {
        os_version?: string;
        ip?: string;
        lat?: string;
        long?: string;
      };
      [key: string]: any;
    }
  ) {
    return await Http.put({
      url: `${this.options.baseUrl}/users/${userId}/tokens/${token}`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
      body: {
        token: token,
        provider_key: provider_key,
        ...params,
      },
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