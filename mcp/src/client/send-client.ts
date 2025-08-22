import Http, { toJson } from "../utils/http.js";
import { BaseClient } from "./base-client.js";

export class SendClient extends BaseClient {

  async send(request: any) {
    const res = await Http.post({
      client: this.client,
      route: `/send`,
      body: request,
    });
    return await toJson(this.client, res);
  }
} 