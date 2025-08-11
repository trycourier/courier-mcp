import Http, { toJson } from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class AuthTokensClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  async issueToken(request: any) {
    const res = await Http.post({
      options: this.options,
      route: `/auth/issue-token`,
      body: request,
    });
    return await toJson(res);
  }
} 