import { BaseClient } from "./base-client.js";

export class AuthTokensClient extends BaseClient {

  async issueToken(request: any) {
    const res = await this.request('POST', `/auth/issue-token`, request);
    return await this.json(res);
  }
} 