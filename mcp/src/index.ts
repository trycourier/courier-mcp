import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import Courier from '@trycourier/courier';

import { CourierMcpTools } from './tools/courier-mcp-tools.js';
import { ConfigTools } from './tools/config-tools.js';
import { SendTools } from './tools/send-tools.js';
import { DocsTools } from './tools/docs-tools.js';
import { AuthTokenTools } from './tools/auth-token-tools.js';
import { AudienceTools } from './tools/audience-tools.js';
import { AuditEventsTools } from './tools/audit-events.js';
import { AutomationsTools } from './tools/automations-tools.js';
import { BrandsTools } from './tools/brands-tools.js';
import { BulkTools } from './tools/bulk-tools.js';
import { InboundTools } from './tools/inbound-tools.js';
import { ListsTools } from './tools/lists-tools.js';
import { NotificationsTools } from './tools/notifications-tools.js';
import { ProfilesTools } from './tools/profiles-tools.js';
import { UserTokensTools } from './tools/user-tokens-tools.js';
import { MessagesTools } from './tools/messages-tools.js';
import { TenantsTools } from './tools/tenants-tools.js';
import { TranslationsTools } from './tools/translations-tools.js';
import { UsersTools } from './tools/users-tools.js';

import { CourierMcpConfig } from './utils/config.js';
import { MCP_DETAILS } from './utils/version.js';

export default class CourierMcp extends McpServer {

  readonly courier: Courier;
  readonly config: CourierMcpConfig;

  constructor(config: CourierMcpConfig) {
    super(MCP_DETAILS);
    this.courier = new Courier({
      apiKey: config.apiKey,
      baseURL: config.baseUrl,
    });
    this.config = config;
    this.registerTools();
  }

  private registerTools() {
    new AudienceTools(this).register();
    new AuditEventsTools(this).register();
    new AuthTokenTools(this).register();
    new AutomationsTools(this).register();
    new BrandsTools(this).register();
    new BulkTools(this).register();
    new DocsTools(this).register();
    new ConfigTools(this).register();
    new InboundTools(this).register();
    new ListsTools(this).register();
    new MessagesTools(this).register();
    new NotificationsTools(this).register();
    new ProfilesTools(this).register();
    new SendTools(this).register();
    new TenantsTools(this).register();
    new TranslationsTools(this).register();
    new UserTokensTools(this).register();
    new UsersTools(this).register();
  }
}

export { CourierMcpConfig };
export { CourierMcpLogLevel } from './utils/types.js';

export {
  SendTools,
  DocsTools,
  AuthTokenTools,
  AudienceTools,
  AuditEventsTools,
  AutomationsTools,
  BrandsTools,
  BulkTools,
  ConfigTools,
  InboundTools,
  ListsTools,
  NotificationsTools,
  ProfilesTools,
  UserTokensTools,
  MessagesTools,
  TenantsTools,
  TranslationsTools,
  UsersTools,
};

import { CourierMcpToolsRegistry } from './utils/courier-mcp-tools-registry.js';
export { CourierMcpToolsRegistry as CourierMcpTools };
