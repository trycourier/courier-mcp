#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export default class CourierMcpServer extends McpServer {
    private config;
    private courierClient;
    constructor(headers?: Record<string, any>);
    private registerTools;
}
