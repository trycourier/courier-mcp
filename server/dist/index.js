import express from 'express';
import { statelessHandler } from 'express-mcp-handler';
import CourierMcpServer from 'courier-mcp';
const app = express();
app.use(express.json());
app.post('/mcp', (req, res, next) => {
    const createServer = () => {
        const mcpServer = new CourierMcpServer(req.headers);
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Stateless MCP server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map