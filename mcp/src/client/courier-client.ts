import { CourierMcpLogger } from "../utils/logger.js";
import { CourierMcpLogLevel } from "../utils/types.js";
import { AudiencesClient } from "./audience-client.js";
import { ProfilesClient } from "./profiles-client.js";
import { AuthTokensClient } from "./auth-tokens-client.js";
import { AuditEventsClient } from "./audit-events-client.js";
import { AutomationsClient } from "./automations-client.js";
import { BrandsClient } from "./brands-client.js";
import { BulkClient } from "./bulk-client.js";
import { InboundClient } from "./inbound-client.js";
import { ListsClient } from "./lists-client.js";
import { NotificationsClient } from "./notifications-client.js";
import { SendClient } from "./send-client.js";
import { MessagesClient } from "./messages-client.js";
import { UserTokensClient } from "./user-tokens-client.js";

export type CourierClientOptions = {
  logLevel: CourierMcpLogLevel;
  baseUrl: string;
  apiKey: string;
}

export class CourierClient {
  readonly options: CourierClientOptions;
  readonly logger: CourierMcpLogger;
  readonly profiles: ProfilesClient;
  readonly audiences: AudiencesClient;
  readonly authTokens: AuthTokensClient;
  readonly auditEvents: AuditEventsClient;
  readonly automations: AutomationsClient;
  readonly brands: BrandsClient;
  readonly bulk: BulkClient;
  readonly inbound: InboundClient;
  readonly lists: ListsClient;
  readonly notifications: NotificationsClient;
  readonly send: SendClient;
  readonly messages: MessagesClient;
  readonly userTokens: UserTokensClient;

  constructor(options: CourierClientOptions) {
    this.options = options;
    this.logger = new CourierMcpLogger(options);
    this.profiles = new ProfilesClient(this);
    this.audiences = new AudiencesClient(this);
    this.authTokens = new AuthTokensClient(this);
    this.auditEvents = new AuditEventsClient(this);
    this.automations = new AutomationsClient(this);
    this.brands = new BrandsClient(this);
    this.bulk = new BulkClient(this);
    this.inbound = new InboundClient(this);
    this.lists = new ListsClient(this);
    this.notifications = new NotificationsClient(this);
    this.send = new SendClient(this);
    this.messages = new MessagesClient(this);
    this.userTokens = new UserTokensClient(this);
  }

}