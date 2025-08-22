import Http, { toJson } from "../utils/http.js";
import { BaseClient } from "./base-client.js";

export class AuthTokensClient extends BaseClient {

  async issueToken(request: any) {
    const res = await Http.post({
      client: this.client,
      route: `/auth/issue-token`,
      body: request,
    });
    return await toJson(this.client, res);
  }
} 