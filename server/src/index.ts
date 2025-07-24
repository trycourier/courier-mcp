import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { statelessHandler } from 'express-mcp-handler';
import { CourierClient } from '@trycourier/courier';

// Create Express app
const app = express();
app.use(express.json());

// Factory function to configure and create the MCP server
const createServer = () => {
  const server = new McpServer({
    name: 'courier-mcp',
    version: '1.0.0',
  });

  server.tool(
    'send_message',
    {
      user_id: z.string(),
      title: z.string(),
      body: z.string(),
      api_key: z.string().optional()
    },
    async ({ user_id, title, body, api_key }) => {
      try {
        const client = new CourierClient({ authorizationToken: api_key });

        await client.send({
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
              text: `Message sent to ${user_id}: "${body}" (using ${api_key ? 'provided' : 'environment'} API key)`,
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
    }
  );

  return server;
};

// Configure the stateless handler
const handler = statelessHandler(createServer, {
  onClose: (_req: any, _res: any) => {
    console.log('Request completed and transport closed');
  },
  onError: (error: any) => {
    console.error('Error handling request:', error);
  }
});

app.post('/mcp', handler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Stateless MCP server running on port ${PORT}`);
});

// import express from 'express';
// import { Server } from '@modelcontextprotocol/sdk/server/index.js';
// import { McpServer } from '@modelcontextprotocol/sdk/server/index.js';
// import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
// import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

// // Custom HTTP Stream Transport for Express
// class HttpStreamTransport implements Transport {
//   private messageHandlers: ((message: any) => void)[] = [];
//   private closeHandlers: (() => void)[] = [];

//   constructor(private response: any, private request: any) {
//     // Handle incoming data
//     this.request.on('data', (chunk: Buffer) => {
//       try {
//         const lines = chunk.toString().split('\n').filter(line => line.trim());
//         for (const line of lines) {
//           const message = JSON.parse(line);
//           this.messageHandlers.forEach(handler => handler(message));
//         }
//       } catch (e) {
//         console.error('Parse error:', e);
//       }
//     });

//     // Handle connection close
//     this.request.on('close', () => {
//       this.closeHandlers.forEach(handler => handler());
//     });

//     this.request.on('end', () => {
//       this.closeHandlers.forEach(handler => handler());
//     });
//   }

//   async start(): Promise<void> {
//     // For HTTP streaming, we can just resolve immediately as setup is done in constructor
//     return Promise.resolve();
//   }

//   async send(message: any): Promise<void> {
//     if (!this.response.destroyed) {
//       this.response.write(JSON.stringify(message) + '\n');
//     }
//   }

//   onMessage(handler: (message: any) => void): void {
//     this.messageHandlers.push(handler);
//   }

//   onClose(handler: () => void): void {
//     this.closeHandlers.push(handler);
//   }

//   async close(): Promise<void> {
//     if (!this.response.destroyed) {
//       this.response.end();
//     }
//   }
// }

// // Create server instance
// const createServer = () => {
//   const server = new Server(
//     {
//       name: 'courier-mcp',
//       version: '1.0.0',
//     },
//     {
//       capabilities: {
//         tools: {},
//         resources: {}
//       },
//     }
//   );

//   // Add your tools and resources here
//   server.setRequestHandler(ListToolsRequestSchema, async () => {
//     return {
//       tools: [
//         {
//           name: "example_tool",
//           description: "An example tool",
//           inputSchema: {
//             type: "object",
//             properties: {
//               query: { type: "string" }
//             }
//           }
//         }
//       ]
//     };
//   });

//   // Add tool call handler
//   server.setRequestHandler(CallToolRequestSchema, async (request) => {
//     const { name, arguments: args } = request.params;

//     if (name === 'example_tool') {
//       return {
//         content: [
//           {
//             type: "text",
//             text: `Tool called with query: ${args?.query || 'no query'}`
//           }
//         ]
//       };
//     }

//     throw new Error(`Unknown tool: ${name}`);
//   });

//   return server;
// };

// const app = express();

// app.use(express.json());

// app.get('/', (_req, res) => {
//   res.json({ message: 'Hello from the root endpoint!' });
// });

// // MCP endpoint
// app.all('/mcp', async (req, res) => {
//   // Set headers for streaming
//   res.setHeader('Content-Type', 'application/json');
//   res.setHeader('Transfer-Encoding', 'chunked');
//   res.setHeader('Connection', 'keep-alive');
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//   // Handle preflight requests
//   if (req.method === 'OPTIONS') {
//     res.status(200).end();
//     return;
//   }

//   try {
//     const server = createServer();
//     const transport = new HttpStreamTransport(res, req);

//     // Handle connection cleanup
//     const cleanup = () => {
//       try {
//         server.close();
//         transport.close();
//       } catch (e) {
//         console.error('Cleanup error:', e);
//       }
//     };

//     req.on('close', cleanup);
//     req.on('error', cleanup);

//     // Start the transport and connect server
//     await transport.start();
//     await server.connect(transport);

//   } catch (error) {
//     console.error('MCP Server error:', error);
//     if (!res.headersSent) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }
// });

// const PORT = 3000;
// const HOST = 'localhost';

// app.listen(PORT, HOST, () => {
//   console.log(`🚀 Server running on http://${HOST}:${PORT}`);
// });