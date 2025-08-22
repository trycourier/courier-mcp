import Http, { toJson } from "../utils/http.js";
import { BaseClient } from "./base-client.js";

export class InboundClient extends BaseClient {

  async track(request: any) {
    const res = await Http.post({
      client: this.client,
      route: `/inbound/track`,
      body: request,
    });
    return await toJson(this.client, res);
  }
} 