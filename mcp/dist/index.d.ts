#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CourierClient } from '@trycourier/courier';
import { CourierClient2 } from './client/courier-client.js';
export default class CourierMcp extends McpServer {
    readonly courierClient: CourierClient;
    readonly client: CourierClient2;
    constructor(headers?: Record<string, any>);
    private registerTools;
}
