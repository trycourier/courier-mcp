#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CourierClient } from '@trycourier/courier';
import { AudienceTools } from './tools/audience-tools.js';
import { ProfilesTools } from './tools/profiles-tools.js';
import { CourierMcpConfig } from './utils/environment.js';
import { CourierClient2 } from './client/courier-client.js';
export default class CourierMcp extends McpServer {
    constructor(headers) {
        super({
            name: 'courier-mcp',
            version: '1.0.0',
        });
        // Get the Courier config from mcp.json or headers
        const config = new CourierMcpConfig(headers);
        this.courierClient = new CourierClient({
            authorizationToken: config.apiKey,
            baseUrl: config.baseUrl,
        });
        this.client = new CourierClient2(config.toCourierClientOptions());
        this.client.logger.log('Courier MCP initialized');
        this.client.logger.log(`Config: ${JSON.stringify(config, null, 2)}`);
        this.registerTools();
    }
    registerTools() {
        // Audience tools
        new AudienceTools(this).register();
        // // Audit events tools
        // new AuditEventsTools(this).register();
        // // Auth token tools
        // new AuthTokenTools(this).register();
        // // Automations tools
        // new AutomationsTools(this).register();
        // // Brands tools
        // new BrandsTools(this).register();
        // // Bulk tools
        // new BulkTools(this).register();
        // // Configuration of the MCP
        // new EnvironmentTools(this).register();
        // // Documentation tools
        // new DocsTools(this).register();
        // // Inbound tools
        // new InboundTools(this).register();
        // // Lists tools
        // new ListsTools(this).register();
        // // Notifications tools
        // new NotificationsTools(this).register();
        // Profiles tools
        new ProfilesTools(this).register();
        // // Send tools
        // new SendTools(this).register();
        // // Templates tools
        // new TemplatesTools(this).register();
    }
}
//# sourceMappingURL=index.js.map