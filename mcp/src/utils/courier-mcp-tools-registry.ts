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

export class CourierMcpToolsRegistry {

  // The default tools the MCP server will register
  static get defaultTools(): string[] {
    return [
      ...AudienceTools.tools,
      ...AuditEventsTools.tools,
      ...AuthTokenTools.tools,
      ...AutomationsTools.tools,
      ...BrandsTools.tools,
      ...BulkTools.tools,
      ...DocsTools.tools,
      ...InboundTools.tools,
      ...ListsTools.tools,
      ...MessagesTools.tools,
      ...NotificationsTools.tools,
      ...ProfilesTools.tools,
      ...SendTools.tools,
      ...UserTokensTools.tools,
      ...SdkContextTools.tools,
    ];
  }

  // The tools that are available to the MCP server
  static get allAvailableTools(): string[] {
    return [
      ...this.defaultTools,
      ...ConfigTools.tools,
    ];
  }

}