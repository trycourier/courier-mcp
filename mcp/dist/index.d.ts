#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CourierMcpConfig } from './utils.js';
import { CourierClient } from '@trycourier/courier';
export default class CourierMcpServer extends McpServer {
    readonly config: CourierMcpConfig;
    readonly courierClient: CourierClient;
    constructor(headers?: Record<string, any>);
    private registerTools;
}
