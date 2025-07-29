import { AuthTokenClient } from "./auth-token-client.js";

export type CourierClientOptions = {
  apiKey: string;
  baseUrl?: string;
}

const DEFAULT_BASE_URL = "https://api.courier.com";

export class CourierClient2 {

  private options: CourierClientOptions;
  readonly authToken: AuthTokenClient;

  constructor(options: CourierClientOptions) {
    this.options = {
      ...options,
      baseUrl: options.baseUrl ?? DEFAULT_BASE_URL,
    };
    this.authToken = new AuthTokenClient(this.options);
  }

}
