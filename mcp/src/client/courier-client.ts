import { CourierMcpLogger } from "../utils/logger.js";
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
import { TemplatesClient } from "./templates-client.js";
import { MessagesClient } from "./messages-client.js";
import { UserTokensClient } from "./user-tokens-client.js";

export type CourierClientOptions = {
  showLogs: boolean;
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
  readonly templates: TemplatesClient;
  readonly messages: MessagesClient;
  readonly userTokens: UserTokensClient;

  constructor(options: CourierClientOptions) {
    this.options = options;
    this.logger = new CourierMcpLogger(options);
    this.profiles = new ProfilesClient(options);
    this.audiences = new AudiencesClient(options);
    this.authTokens = new AuthTokensClient(options);
    this.auditEvents = new AuditEventsClient(options);
    this.automations = new AutomationsClient(options);
    this.brands = new BrandsClient(options);
    this.bulk = new BulkClient(options);
    this.inbound = new InboundClient(options);
    this.lists = new ListsClient(options);
    this.notifications = new NotificationsClient(options);
    this.send = new SendClient(options);
    this.templates = new TemplatesClient(options);
    this.messages = new MessagesClient(options);
    this.userTokens = new UserTokensClient(options);
  }

}