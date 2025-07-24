import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { statelessHandler } from 'express-mcp-handler';
import { CourierClient } from '@trycourier/courier';
const app = express();
app.use(express.json());
const createServer = () => {
    const server = new McpServer({
        name: 'courier-mcp',
        version: '1.0.0',
    });
    server.tool('send_message', {
        user_id: z.string(),
        title: z.string(),
        body: z.string(),
        api_key: z.string().optional()
    }, async ({ user_id, title, body, api_key }) => {
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
    return server;
};
const handler = statelessHandler(createServer, {
    onClose: (_req, _res) => {
        console.log('Request completed and transport closed');
    },
    onError: (error) => {
        console.error('Error handling request:', error);
    }
});
app.post('/mcp', handler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Stateless MCP server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map