#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getCourierConfig } from './utils.js';
import { getCourierClient } from './client.js';

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
async function fetchMarkdownFile(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  return await res.text();
}

// Helper: fetch all Flutter markdown files
async function fetchAllFlutterMarkdownFiles() {
  const results: { title: string, url: string, content: string }[] = [];
  for (const file of FLUTTER_MARKDOWN_FILES) {
    try {
      const content = await fetchMarkdownFile(file.url);
      results.push({ title: file.title, url: file.url, content });
    } catch (err: any) {
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

  private registerTools() {

    // Export the Courier config from mcp.json
    this.tool(
      'get_config',
      'Get the Courier config from mcp.json',
      {},
      async () => {
        const config = getCourierConfig();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(config, null, 2),
            },
          ],
        };
      }
    );

    // Send a message to a user with Courier
    this.tool(
      'send_message',
      'Send a message to a user with Courier',
      {
        user_id: z.string(),
        template: z.string().optional(),
        title: z.string().optional(),
        body: z.string().optional(),
        data: z.record(z.string(), z.string()).optional(),
        method: z.enum(['all', 'single']).optional(),
        channels: z.array(z.string()).optional(),
      },
      async ({ user_id, template, title, body, data, method, channels }) => {
        try {

          if (!template && (!title || !body)) {
            throw new Error('Either a template or both title and body must be provided.');
          }

          if (template && (title || body)) {
            throw new Error('Provide either a template or title/body, not both.');
          }

          if (!method) {
            throw new Error('Method must be provided.');
          }

          if (!channels || channels.length === 0) {
            throw new Error('At least one channel must be provided. Available channels: inbox, email, sms, push');
          }

          let request: any = {
            message: {
              to: {
                user_id: user_id,
              },
              data: data,
              routing: {
                method: method,
                channels: channels
              }
            },
          }

          // Add either a template or content (title/body) to the message, but never both.
          // If a template is provided, add it to the message; otherwise, add content with title and body.
          if (template) {
            request.message.template = template;
          } else {
            request.message.content = {
              title: title,
              body: body,
            };
          }

          const client = getCourierClient();
          const response = await client.send(request);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response, null, 2),
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(err, null, 2),
              },
            ],
          };
        }
      }
    );
  }
}