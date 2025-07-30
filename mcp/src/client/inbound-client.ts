import Http from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class InboundClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  async track(request: any) {
    return await Http.post({
      url: `${this.options.baseUrl}/inbound/track`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
      body: request,
    });
  }
} 