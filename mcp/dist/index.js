#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { EnvironmentTools } from './tools/config-tools.js';
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
import { CourierMcpConfig } from './utils/environment.js';
import { CourierClient } from './client/courier-client.js';
import { UserTokensTools } from './tools/user-tokens-tools.js';
import { MessagesTools } from './tools/messages-tools.js';
export default class CourierMcp extends McpServer {
    constructor(headers) {
        super({
            name: 'courier-mcp',
            version: '1.0.0',
        });
        // Get the Courier config from mcp.json or headers
        const config = new CourierMcpConfig(headers);
        this.client = new CourierClient(config.toCourierClientOptions());
        // Register tools
        this.registerTools();
    }
    registerTools() {
        new AudienceTools(this).register();
        new AuditEventsTools(this).register();
        new AuthTokenTools(this).register();
        new AutomationsTools(this).register();
        new BrandsTools(this).register();
        new BulkTools(this).register();
        new DocsTools(this).register();
        new EnvironmentTools(this).register();
        new InboundTools(this).register();
        new ListsTools(this).register();
        new MessagesTools(this).register();
        new NotificationsTools(this).register();
        new ProfilesTools(this).register();
        new SendTools(this).register();
        new TemplatesTools(this).register();
        new UserTokensTools(this).register();
    }
}
//# sourceMappingURL=index.js.map