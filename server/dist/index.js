import express from 'express';
import { statelessHandler } from 'express-mcp-handler';
import CourierMcpServer from 'courier-mcp';
const app = express();
app.use(express.json());
app.post('/mcp', (req, res, next) => {
    const createServer = () => {
        const mcpServer = new CourierMcpServer(req.headers);
        console.log('Headers:', req.headers);
        console.log('Options:', mcpServer.client.options);
        res.on('finish', () => {
            if (typeof mcpServer.close === 'function') {
                mcpServer.close();
                console.log('MCP server instance closed');
            }
        });
        return mcpServer;
    };
    return statelessHandler(createServer, {
        onClose: (_req, _res) => {
            console.log('Request completed and transport closed');
        },
        onError: (error) => {
            console.error('Error handling request:', error);
        }
    })(req, res, next);
});
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});
const PORT = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Stateless MCP server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map