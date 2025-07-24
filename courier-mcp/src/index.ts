#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { CourierClient } from "@trycourier/courier";

// Load API key from environment variable
const API_KEY = process.env.COURIER_API_KEY;

// Validate configuration at startup
if (!API_KEY) {
  console.error('Warning: COURIER_API_KEY environment variable not set. Some tools may not function.');
}

const server = new Server(
  {
    name: 'courier-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {}
    },
  }
);

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

// Helper: generate tool definitions for Flutter markdown files
function getFlutterMarkdownTools() {
  return FLUTTER_MARKDOWN_FILES.map(file => ({
    name: file.name,
    description: file.description,
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    }
  })).concat([
    {
      name: "get_all_flutter_guides",
      description: "Get all Courier Flutter SDK documentation files in one call.",
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      }
    }
  ]);
}

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

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'send_message',
        description: 'Send a message via Courier.',
        inputSchema: {
          type: 'object',
          properties: {
            user_id: {
              type: 'string',
              description: 'The message user id',
            },
            title: {
              type: 'string',
              description: 'The title of the message',
            },
            body: {
              type: 'string',
              description: 'The body of the message',
            },
            api_key: {
              type: 'string',
              description: 'API key (optional if COURIER_API_KEY env var is set)',
            },
          },
          required: ['user_id', 'title', 'body'],
        },
      },
      {
        name: 'get_inbox_ios_setup_guide',
        description: 'Get the setup guide for integrating Courier Inbox into your iOS app. Use this to reference documentation for setting up Courier Inbox for iOS.',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      ...getFlutterMarkdownTools()
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {

    case 'send_message':
      if (!args) throw new Error('Missing arguments');

      // Use API key from args or environment
      const apiKey = args.api_key || API_KEY;
      if (!apiKey) {
        return {
          content: [
            {
              type: 'text',
              text: 'Error: No API key available. Either set COURIER_API_KEY environment variable or provide api_key parameter.',
            },
          ],
        };
      }

      try {
        const client = new CourierClient({ authorizationToken: apiKey as string });

        // Support the args in the send function
        await client.send({
          message: {
            to: {
              user_id: args.user_id as string,
            },
            content: {
              title: args.title as string ?? 'Example Title',
              body: args.body as string ?? 'Example Body',
            },
            routing: {
              method: 'single',
              channels: ['inbox']
            }
            // Optionally pass data and routing if needed, or leave as is
            // Here, we just pass the required fields
          },
        });

        return {
          content: [
            {
              type: 'text',
              text: `Message sent to ${args.user_id}: "${args.body}" (using ${args.api_key ? 'provided' : 'environment'} API key)`,
            },
          ],
        };
      } catch (err: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Error sending message: ${err.message || err}`,
            },
          ],
        };
      }

    case 'get_inbox_ios_setup_guide': {
      // Provide a short guide and link to the Courier Inbox iOS setup documentation.
      // Use a CORS-friendly URL (raw.githubusercontent.com)
      const url = "https://raw.githubusercontent.com/trycourier/courier-ios/master/Docs/2_Inbox.md";
      try {
        const res = await fetch(url);
        const text = await res.text();
        return {
          content: [
            {
              type: 'text',
              text: `To set up Courier Inbox for iOS, follow the instructions below:\n\n${text}`,
            },
          ]
        };
      } catch (err: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving Inbox iOS setup guide: ${err.message || err}`,
            },
          ],
        };
      }
    }

    // Flutter markdown file tools
    case 'flutter_readme':
    case 'flutter_authentication_guide':
    case 'flutter_inbox_guide':
    case 'flutter_push_notifications_guide':
    case 'flutter_preferences_guide':
    case 'flutter_client_guide': {
      // Find the file info
      const file = FLUTTER_MARKDOWN_FILES.find(f => f.name === name);
      if (!file) {
        return {
          content: [
            {
              type: 'text',
              text: `Unknown Flutter markdown file: ${name}`,
            },
          ],
        };
      }
      try {
        const text = await fetchMarkdownFile(file.url);
        return {
          content: [
            {
              type: 'text',
              text: `# ${file.title}\n\n${text}`,
            },
          ]
        };
      } catch (err: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving ${file.title}: ${err.message || err}`,
            },
          ],
        };
      }
    }

    case 'get_all_flutter_guides': {
      // Fetch all Flutter markdown files and return as a single response
      try {
        const allFiles = await fetchAllFlutterMarkdownFiles();
        // Compose a single markdown string with all files, separated by headings
        const combined = allFiles.map(f =>
          `# ${f.title}\n\n[Source](${f.url})\n\n${f.content}`
        ).join('\n\n---\n\n');
        return {
          content: [
            {
              type: 'text',
              text: combined,
            },
          ]
        };
      } catch (err: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving all Flutter guides: ${err.message || err}`,
            },
          ],
        };
      }
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

server.onerror = (error) => {
  console.error('[MCP Error]', error);
};

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Courier MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});