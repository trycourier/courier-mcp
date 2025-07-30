import { CourierClientOptions } from "../client/courier-client.js";

export class CourierMcpLogger {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  log(message: string) {
    if (this.options.showLogs) {
      console.log(message);
    }
  }
}