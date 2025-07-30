#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CourierClient } from './client/courier-client.js';
export default class CourierMcp extends McpServer {
    readonly client: CourierClient;
    constructor(headers?: Record<string, any>);
    private registerTools;
}
