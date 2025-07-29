#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CourierMcpConfig, getCourierConfig } from './utils.js';
import { CourierClient } from '@trycourier/courier';
import { ConfigTools } from './tools/config-tools.js';
import { SendTools } from './tools/send-tools.js';
import { DocsTools } from './tools/docs-tools.js';
import { AuthTokenTools } from './tools/auth-token-tools.js';
import { TemplatesTools } from './tools/templates-tools.js';
import { AudienceTools } from './tools/audience-tools.js';
import { AuditEventsTools } from './tools/audit-events.js';
import { AutomationsTools } from './tools/automations-tools.js';
import { BrandsTools } from './tools/brands-tools.js';
import { BulkTools } from './tools/bulk-tools.js';
import { InboundTools } from './tools/inbound-tools.js';
import { ListsTools } from './tools/lists-tools.js';
import { NotificationsTools } from './tools/notifications-tools.js';
import { ProfilesTools } from './tools/profiles-tools.js';

export default class CourierMcpServer extends McpServer {

  readonly config: CourierMcpConfig;
  readonly courierClient: CourierClient;

  constructor(headers?: Record<string, any>) {
    super({
      name: 'courier-mcp',
      version: '1.0.0',
    });

    // Get the Courier config from mcp.json or headers
    this.config = getCourierConfig(headers);
    this.courierClient = new CourierClient({
      authorizationToken: this.config.API_KEY,
      baseUrl: this.config.BASE_URL,
    });

    this.registerTools();
  }

  private registerTools() {

    // Audience tools
    new AudienceTools(this).register();

    // Audit events tools
    new AuditEventsTools(this).register();

    // Auth token tools
    new AuthTokenTools(this).register();

    // Automations tools
    new AutomationsTools(this).register();

    // Brands tools
    new BrandsTools(this).register();

    // Bulk tools
    new BulkTools(this).register();

    // Configuration of the MCP
    new ConfigTools(this).register();

    // Documentation tools
    new DocsTools(this).register();

    // Inbound tools
    new InboundTools(this).register();

    // Lists tools
    new ListsTools(this).register();

    // Notifications tools
    new NotificationsTools(this).register();

    // Profiles tools
    new ProfilesTools(this).register();

    // Send tools
    new SendTools(this).register();

    // Templates tools
    new TemplatesTools(this).register();

  }

}