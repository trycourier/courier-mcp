#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CourierMcpConfig, getCourierConfig } from './utils.js';
import { CourierClient } from '@trycourier/courier';

// // Flutter markdown files to support
// const FLUTTER_MARKDOWN_FILES = [
//   {
//     name: "flutter_readme",
//     title: "Courier Flutter SDK README",
//     url: "https://raw.githubusercontent.com/trycourier/courier-flutter/master/README.md",
//     description: "Get the main README for the Courier Flutter SDK."
//   },
//   {
//     name: "flutter_authentication_guide",
//     title: "Courier Flutter Authentication Guide",
//     url: "https://raw.githubusercontent.com/trycourier/courier-flutter/master/Docs/1_Authentication.md",
//     description: "Get the authentication guide for Courier Flutter SDK."
//   },
//   {
//     name: "flutter_inbox_guide",
//     title: "Courier Flutter Inbox Guide",
//     url: "https://raw.githubusercontent.com/trycourier/courier-flutter/master/Docs/2_Inbox.md",
//     description: "Get the inbox integration guide for Courier Flutter SDK."
//   },
//   {
//     name: "flutter_push_notifications_guide",
//     title: "Courier Flutter Push Notifications Guide",
//     url: "https://raw.githubusercontent.com/trycourier/courier-flutter/master/Docs/3_PushNotifications.md",
//     description: "Get the push notifications guide for Courier Flutter SDK."
//   },
//   {
//     name: "flutter_preferences_guide",
//     title: "Courier Flutter Preferences Guide",
//     url: "https://raw.githubusercontent.com/trycourier/courier-flutter/master/Docs/4_Preferences.md",
//     description: "Get the preferences guide for Courier Flutter SDK."
//   },
//   {
//     name: "flutter_client_guide",
//     title: "Courier Flutter Client Guide",
//     url: "https://raw.githubusercontent.com/trycourier/courier-flutter/master/Docs/5_Client.md",
//     description: "Get the client usage guide for Courier Flutter SDK."
//   }
// ];

// // Helper: fetch a markdown file from a URL
// async function fetchMarkdownFile(url: string): Promise<string> {
//   const res = await fetch(url);
//   if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
//   return await res.text();
// }

// // Helper: fetch all Flutter markdown files
// async function fetchAllFlutterMarkdownFiles() {
//   const results: { title: string, url: string, content: string }[] = [];
//   for (const file of FLUTTER_MARKDOWN_FILES) {
//     try {
//       const content = await fetchMarkdownFile(file.url);
//       results.push({ title: file.title, url: file.url, content });
//     } catch (err: any) {
//       results.push({ title: file.title, url: file.url, content: `Error: ${err.message || err}` });
//     }
//   }
//   return results;
// }

export default class CourierMcpServer extends McpServer {

  private config: CourierMcpConfig;
  private courierClient: CourierClient;

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

    // Export the Courier config from mcp.json
    this.tool(
      'get_config',
      'Get the Courier tool configuration',
      {},
      async () => {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(this.config, null, 2),
            },
          ],
        };
      }
    );

    // Issue tokens for Courier
    this.tool(
      'issue_token',
      'Generate a JWT authentication token for Courier. Ask for user id if not provided.',
      {
        user_id: z.string(),
        scopes: z.array(z.string()).optional(),
        expires_in: z.string().optional(),
      },
      async ({ user_id, scopes, expires_in }) => {
        try {
          // Provide sensible defaults if not supplied
          const defaultScopes = [
            'write:user-tokens',
            'inbox:read:messages',
            'inbox:write:events',
            'read:preferences',
            'write:preferences',
            'read:brands'
          ];
          const scopeList = scopes && scopes.length > 0 ? scopes : defaultScopes;
          const expires = expires_in || '1h';

          const response = await this.courierClient.authTokens.issueToken({
            scope: `user_id:${user_id} ${scopeList.join(' ')}`,
            expires_in: expires,
          });

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


    // Send a message to a user with Courier using title/body (no template)
    this.tool(
      'send_message',
      'Send a message to a user with Courier using title and body (no template)',
      {
        user_id: z.string(),
        title: z.string(),
        body: z.string(),
        data: z.record(z.string(), z.string()).optional(),
        method: z.enum(['all', 'single']),
        channels: z.array(z.string()),
      },
      async ({ user_id, title, body, data, method, channels }) => {
        try {
          if (!title || !body) {
            throw new Error('Both title and body must be provided.');
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
              },
              content: {
                title: title,
                body: body,
              }
            },
          };

          const response = await this.courierClient.send(request);
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

    // Send a message to a user with Courier using a template
    this.tool(
      'send_message_template',
      'Send a message to a user with Courier using a template',
      {
        user_id: z.string(),
        template: z.string(),
        data: z.record(z.string(), z.string()).optional(),
      },
      async ({ user_id, template, data }) => {
        try {
          if (!template) {
            throw new Error('Template must be provided.');
          }

          let request: any = {
            message: {
              to: {
                user_id: user_id,
              },
              data: data,
              template: template
            },
          };

          const response = await this.courierClient.send(request);
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