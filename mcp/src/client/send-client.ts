import Http from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class SendClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  async send(request: any) {
    return await Http.post({
      url: `${this.options.baseUrl}/send`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
      body: request,
    });
  }
} 