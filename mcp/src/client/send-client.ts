import { BaseClient } from "./base-client.js";

export class SendClient extends BaseClient {

  async send(request: any) {
    const res = await this.request('POST', `/send`, request);
    return await this.json(res);
  }
} 