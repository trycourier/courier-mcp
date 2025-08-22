import { BaseClient } from "./base-client.js";

export class UserTokensClient extends BaseClient {

  // GET /users/{user_id}/tokens/{token}
  async getToken(userId: string, token: string) {
    const res = await this.request('GET', `/users/${userId}/tokens/${token}`);
    return await this.toJson(res);
  }

  // GET /users/{user_id}/tokens
  async listTokens(userId: string) {
    const res = await this.request('GET', `/users/${userId}/tokens`);
    return await this.toJson(res);
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
    const res = await this.request('PUT', `/users/${userId}/tokens/${token}`, {
      token: token,
      provider_key: provider_key,
      ...params,
    });
    return await this.toJson(res);
  }

  // PUT /users/{user_id}/tokens
  async putTokens(userId: string, body: any) {
    const res = await this.request('PUT', `/users/${userId}/tokens`, body);
    return await this.toJson(res);
  }

  // PATCH /users/{user_id}/tokens/{token}
  async patchToken(userId: string, token: string, body: any) {
    const res = await this.request('PATCH', `/users/${userId}/tokens/${token}`, body);
    return await this.toJson(res);
  }

  // DELETE /users/{user_id}/tokens/{token}
  async deleteToken(userId: string, token: string) {
    const res = await this.request('DELETE', `/users/${userId}/tokens/${token}`);
    return await this.toJson(res);
  }
}