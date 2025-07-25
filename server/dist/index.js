import express from 'express';
import { statelessHandler } from 'express-mcp-handler';
import CourierMcpServer from 'courier-mcp';
const app = express();
app.use(express.json());
const createServer = () => {
    return new CourierMcpServer();
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