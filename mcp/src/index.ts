/**
 * CourierMcp - Main entry point for the Courier MCP (Model Context Protocol) server.
 * This class extends the generic MCP server and registers all Courier-specific tools.
 * 
 * Exports:
 *   - CourierMcp (default): The main server class.
 *   - CourierMcpLogLevel: Enum for log levels.
 *   - CourierMcpConfig: Configuration class for Courier MCP.
 *   - All tool classes and the CourierClient for advanced usage.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Tool imports: Each tool provides a set of API endpoints for a specific Courier feature.
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

import { CourierMcpConfig } from './utils/config.js';
import { CourierClient } from './client/courier-client.js';
import { MCP_DETAILS } from './utils/version.js';

/**
 * The main Courier MCP server class.
 * 
 * Usage:
 *   const mcp = new CourierMcp(new CourierMcpConfig({ ... }));
 *   mcp.listen(...);
 */
export default class CourierMcp extends McpServer {

  /** Courier API client instance, configured for this MCP server */
  readonly client: CourierClient;

  /** Configuration for this MCP server instance */
  readonly config: CourierMcpConfig;

  /**
   * Construct a new CourierMcp server.
   * @param config - The configuration object for Courier MCP.
   */
  constructor(config: CourierMcpConfig) {
    super(MCP_DETAILS); // Pass version and metadata to the base MCP server
    this.client = new CourierClient(config.toCourierClientOptions());
    this.config = config;
    this.registerTools();
  }

  /**
   * Register all available Courier tools with the MCP server.
   * Tools are only registered if enabled in the config.
   */
  private registerTools() {
    // Each tool encapsulates a set of related API endpoints.
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
    new UserTokensTools(this).register();
  }

}

// Export core configuration, log level enum, and tools utility for external usage
export { CourierMcpConfig };
export { CourierMcpLogLevel } from './utils/types.js';
export { CourierMcpTools } from './tools/tools.js';

// Export all tool classes and the CourierClient for advanced/extensible usage
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
  CourierClient,
  UserTokensTools,
  MessagesTools
};
