import express, { Request, Response, NextFunction } from 'express';
import { statelessHandler } from 'express-mcp-handler';
import CourierMcpServer from 'courier-mcp';

// Create Express app
const app = express();
app.use(express.json());

// Use the handler directly as Express middleware
app.post('/mcp', (req: Request, res: Response, next: NextFunction) => {

  // The statelessHandler expects a ServerFactory with at least one argument (the request)
  // So we pass a function that takes the request and returns the server
  const createServer = () => {
    const mcpServer = new CourierMcpServer(req.headers);

    // When the request is done, close the MCP server if it has a close method
    // TODO: This needs to be confirmed that it works
    res.on('finish', () => {
      if (typeof (mcpServer as any).close === 'function') {
        (mcpServer as any).close();
        console.log('MCP server instance closed');
      }
    });

    return mcpServer;
  };

  // Use the statelessHandler to handle the request
  return statelessHandler(createServer, {
    onClose: (_req: Request, _res: Response) => {
      console.log('Request completed and transport closed');
    },
    onError: (error: any) => {
      console.error('Error handling request:', error);
    }
  })(req, res, next);

});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Stateless MCP server running on port ${PORT}`);
});