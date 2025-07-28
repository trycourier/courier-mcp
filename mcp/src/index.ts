#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CourierMcpConfig, getCourierConfig } from './utils.js';
import { CourierClient } from '@trycourier/courier';
import { ConfigTools } from './tools/config-tools.js';
import { SendTools } from './tools/send-tools.js';
import { DocsTools } from './tools/docs-tools.js';
import { AuthTokenTools } from './tools/auth-token-tools.js';

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

    // Register the tools
    this.registerTools();

  }

  private registerTools() {

    // Configuration of the MCP
    new ConfigTools(this).register();

    // Documentation tools
    new DocsTools(this).register();

    // Send tools
    new SendTools(this).register();

    // Auth token tools
    new AuthTokenTools(this).register();

  }
}