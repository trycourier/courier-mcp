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
import { SdkContextTools } from "../tools/sdk-context-tools.js";
import { TenantsTools } from "../tools/tenants-tools.js";
import { TranslationsTools } from "../tools/translations-tools.js";
import { UsersTools } from "../tools/users-tools.js";

export class CourierMcpToolsRegistry {

  /**
   * Core tools registered by default. These cover the most common
   * agent workflows: sending, message debugging, profiles, lists,
   * audiences, notifications, brands, auth, user tokens, and docs.
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
    ];
  }

  /**
   * All available tools including advanced/niche operations.
   * The hosted server (mcp.courier.com) registers these.
   */
  static get allAvailableTools(): string[] {
    return [
      ...this.defaultTools,
      ...AutomationsTools.tools,
      ...BulkTools.tools,
      ...AuditEventsTools.tools,
      ...InboundTools.tools,
      ...TenantsTools.tools,
      ...TranslationsTools.tools,
      ...UsersTools.tools,
      ...ConfigTools.tools,
      ...SdkContextTools.tools,
    ];
  }
}
