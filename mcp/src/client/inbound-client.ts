import Http, { toJson } from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class InboundClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  async track(request: any) {
    const res = await Http.post({
      options: this.options,
      route: `/inbound/track`,
      body: request,
    });
    return await toJson(res);
  }
} 