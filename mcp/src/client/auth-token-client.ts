import Http from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class AuthTokenClient {

  private options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  public async issueToken(props: { scope: string, expires_in: string }) {
    return await Http.post({
      url: `${this.options.baseUrl}/auth/issue-token`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
      body: {
        scope: props.scope,
        expires_in: props.expires_in,
      },
    });
  }

}