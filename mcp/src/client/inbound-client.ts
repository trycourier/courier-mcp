import { BaseClient } from "./base-client.js";

export class InboundClient extends BaseClient {

  async track(request: any) {
    const res = await this.request('POST', `/inbound/track`, request);
    return await this.json(res);
  }
} 