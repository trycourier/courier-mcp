import express, { Request, Response, NextFunction } from 'express';
import { statelessHandler } from 'express-mcp-handler';
import CourierMcp, { CourierMcpLogLevel, CourierMcpConfig, CourierMcpTools } from 'courier-mcp';

const app = express();
app.use(express.json());

app.post('/', (req: Request, res: Response, next: NextFunction) => {
  const createServer = () => {
    const config = new CourierMcpConfig({
      headers: req.headers,
      logLevel: CourierMcpLogLevel.DEBUG,
      availableTools: CourierMcpTools.allAvailableTools
    });
    return new CourierMcp(config);
  };
  return statelessHandler(createServer)(req, res, next);
});

// Stateless mode doesn't support SSE streaming. Return 405 so MCP clients
// know this endpoint exists but doesn't accept GET (instead of a confusing 404).
app.get('/', (_req: Request, res: Response) => {
  res.status(405).set('Allow', 'POST').send('SSE not supported on stateless server');
});

app.delete('/', (_req: Request, res: Response) => {
  res.status(405).set('Allow', 'POST').send('Sessions not supported on stateless server');
});

app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

const PORT = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Stateless MCP server running on port ${PORT}`);
});