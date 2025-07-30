import { CourierMcpLogger } from "../utils/logger.js";
import { ProfilesClient } from "./profiles-client.js";

export type CourierClientOptions = {
  showLogs: boolean;
  baseUrl: string;
  apiKey: string;
}

export class CourierClient2 {
  readonly options: CourierClientOptions;
  readonly logger: CourierMcpLogger;
  readonly profiles: ProfilesClient;

  constructor(options: CourierClientOptions) {
    this.options = options;
    this.logger = new CourierMcpLogger(options);
    this.profiles = new ProfilesClient(options);
  }

}