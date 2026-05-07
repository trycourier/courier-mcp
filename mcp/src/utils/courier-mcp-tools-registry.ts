import { AudienceTools } from "../tools/audience-tools.js";
import { AuditEventsTools } from "../tools/audit-events.js";
import { AuthTokenTools } from "../tools/auth-token-tools.js";
import { AutomationsTools } from "../tools/automations-tools.js";
import { BrandsTools } from "../tools/brands-tools.js";
import { BulkTools } from "../tools/bulk-tools.js";
import { ConfigTools } from "../tools/config-tools.js";
import { DocsTools } from "../tools/docs-tools.js";
import { InboundTools } from "../tools/inbound-tools.js";
import { ListsTools } from "../tools/lists-tools.js";
import { MessagesTools } from "../tools/messages-tools.js";
import { NotificationsTools } from "../tools/notifications-tools.js";
import { ProfilesTools } from "../tools/profiles-tools.js";
import { SendTools } from "../tools/send-tools.js";
import { UserTokensTools } from "../tools/user-tokens-tools.js";
import { TenantsTools } from "../tools/tenants-tools.js";
import { TranslationsTools } from "../tools/translations-tools.js";
import { UsersTools } from "../tools/users-tools.js";
import { RequestsTools } from "../tools/requests-tools.js";
import { RoutingStrategiesTools } from "../tools/routing-strategies-tools.js";
import { JourneysTools } from "../tools/journeys-tools.js";
import { ProvidersTools } from "../tools/providers-tools.js";

export class CourierMcpToolsRegistry {

  /**
   * Core Courier API tools. Used by the hosted MCP server and as the
   * default when no explicit availableTools list is provided.
   */
  static get defaultTools(): string[] {
    return [
      ...SendTools.tools,
      ...MessagesTools.tools,
      ...ProfilesTools.tools,
      ...ListsTools.tools,
      ...AudienceTools.tools,
      ...NotificationsTools.tools,
      ...BrandsTools.tools,
      ...AuthTokenTools.tools,
      ...UserTokensTools.tools,
      ...DocsTools.tools,
      ...AutomationsTools.tools,
      ...BulkTools.tools,
      ...AuditEventsTools.tools,
      ...InboundTools.tools,
      ...TenantsTools.tools,
      ...TranslationsTools.tools,
      ...UsersTools.tools,
      ...RequestsTools.tools,
      ...RoutingStrategiesTools.tools,
      ...JourneysTools.tools,
      ...ProvidersTools.tools,
    ];
  }

  /**
   * Every registered tool, including diagnostic/meta tools that are
   * not part of the default set (e.g. get_environment_config), and
   * provider write operations (create/update/delete provider).
   */
  static get allAvailableTools(): string[] {
    return [
      ...this.defaultTools,
      ...ProvidersTools.optInTools,
      ...ConfigTools.tools,
    ];
  }
}
