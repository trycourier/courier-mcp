import { CourierClient } from "./courier-client.js";

export class BaseClient {

  readonly client: CourierClient;

  constructor(client: CourierClient) {
    this.client = client;
  }

}