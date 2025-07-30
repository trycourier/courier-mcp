#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CourierClient } from '@trycourier/courier';
import { CourierMcpEnvironment } from './utils/environment.js';
export default class CourierMcp extends McpServer {
    readonly environment: CourierMcpEnvironment;
    readonly courierClient: CourierClient;
    constructor(headers?: Record<string, any>);
    private registerTools;
}
