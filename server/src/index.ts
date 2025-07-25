import express from 'express';
import { statelessHandler } from 'express-mcp-handler';
import CourierMcpServer from '../../mcp/dist/index.js';

// Create Express app
const app = express();
app.use(express.json());

// Factory function to configure and create the MCP server
const createServer = () => {
  return new CourierMcpServer();
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