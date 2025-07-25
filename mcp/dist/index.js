#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getCourierConfig } from './utils';
import { getCourierClient } from './client';
// Flutter markdown files to support
const FLUTTER_MARKDOWN_FILES = [
    {
        name: "flutter_readme",
        title: "Courier Flutter SDK README",
        url: "https://raw.githubusercontent.com/trycourier/courier-flutter/master/README.md",
        description: "Get the main README for the Courier Flutter SDK."
    },
    {
        name: "flutter_authentication_guide",
        title: "Courier Flutter Authentication Guide",
        url: "https://raw.githubusercontent.com/trycourier/courier-flutter/master/Docs/1_Authentication.md",
        description: "Get the authentication guide for Courier Flutter SDK."
    },
    {
        name: "flutter_inbox_guide",
        title: "Courier Flutter Inbox Guide",
        url: "https://raw.githubusercontent.com/trycourier/courier-flutter/master/Docs/2_Inbox.md",
        description: "Get the inbox integration guide for Courier Flutter SDK."
    },
    {
        name: "flutter_push_notifications_guide",
        title: "Courier Flutter Push Notifications Guide",
        url: "https://raw.githubusercontent.com/trycourier/courier-flutter/master/Docs/3_PushNotifications.md",
        description: "Get the push notifications guide for Courier Flutter SDK."
    },
    {
        name: "flutter_preferences_guide",
        title: "Courier Flutter Preferences Guide",
        url: "https://raw.githubusercontent.com/trycourier/courier-flutter/master/Docs/4_Preferences.md",
        description: "Get the preferences guide for Courier Flutter SDK."
    },
    {
        name: "flutter_client_guide",
        title: "Courier Flutter Client Guide",
        url: "https://raw.githubusercontent.com/trycourier/courier-flutter/master/Docs/5_Client.md",
        description: "Get the client usage guide for Courier Flutter SDK."
    }
];
// Helper: fetch a markdown file from a URL
async function fetchMarkdownFile(url) {
    const res = await fetch(url);
    if (!res.ok)
        throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
    return await res.text();
}
// Helper: fetch all Flutter markdown files
async function fetchAllFlutterMarkdownFiles() {
    const results = [];
    for (const file of FLUTTER_MARKDOWN_FILES) {
        try {
            const content = await fetchMarkdownFile(file.url);
            results.push({ title: file.title, url: file.url, content });
        }
        catch (err) {
            results.push({ title: file.title, url: file.url, content: `Error: ${err.message || err}` });
        }
    }
    return results;
}
export default class CourierMcpServer extends McpServer {
    constructor() {
        super({
            name: 'courier-mcp',
            version: '1.0.0',
        });
        this.registerTools();
    }
    registerTools() {
        // Register send_message tool
        this.tool('send_message', 'Send a message to a user with Courier', {
            user_id: z.string(),
            title: z.string(),
            body: z.string(),
        }, async ({ user_id, title, body }) => {
            try {
                const client = getCourierClient();
                const response = await client.send({
                    message: {
                        to: {
                            user_id: user_id,
                        },
                        content: {
                            title: title ?? 'Example Title',
                            body: body ?? 'Example Body',
                        },
                        routing: {
                            method: 'single',
                            channels: ['inbox']
                        }
                    },
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(response, null, 2),
                        },
                    ],
                };
            }
            catch (err) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error sending message: ${err.message || err}`,
                        },
                    ],
                };
            }
        });
        // Register export_config tool
        this.tool('export_config', 'Export the Courier config from mcp.json', {}, async () => {
            const config = getCourierConfig();
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(config, null, 2),
                    },
                ],
            };
        });
    }
}
