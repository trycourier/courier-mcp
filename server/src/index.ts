import express, { Request, Response, NextFunction } from 'express';
import { statelessHandler } from 'express-mcp-handler';
import CourierMcp, { CourierMcpLogLevel, CourierMcpConfig, CourierMcpTools, PACKAGE_NAME, PACKAGE_VERSION } from 'courier-mcp';

const app = express();
app.use(express.json());

app.post('/', (req: Request, res: Response, next: NextFunction) => {
  const createServer = () => {
    const config = new CourierMcpConfig({
      headers: req.headers,
      logLevel: CourierMcpLogLevel.DEBUG,
      availableTools: CourierMcpTools.allAvailableTools,
    });
    return new CourierMcp(config);
  };
  return statelessHandler(createServer)(req, res, next);
});

// MCP clients open an OPTIONAL standalone GET SSE stream to receive
// server-initiated messages. A stateless server never pushes anything on it, so
// we don't offer one. The MCP SDK client treats a 405 here as the documented
// "no SSE stream at this endpoint" signal and continues cleanly; it only fails
// fatally ("Failed to open SSE stream") on other non-2xx codes — notably the
// Express-default 404 you get when this route is missing entirely. So the route
// must exist and answer 405.
app.get('/', (_req: Request, res: Response) => {
  res.status(405).set('Allow', 'POST').send('SSE not supported on stateless server');
});

app.delete('/', (_req: Request, res: Response) => {
  res.status(405).set('Allow', 'POST').send('Sessions not supported on stateless server');
});

app.get('/.well-known/mcp/server-card.json', (_req: Request, res: Response) => {
  res.json({
    serverInfo: {
      name: PACKAGE_NAME,
      version: PACKAGE_VERSION,
    },
    authentication: {
      required: true,
      schemes: ['apiKey'],
    },
    configSchema: {
      type: 'object',
      properties: {
        api_key: {
          type: 'string',
          title: 'Courier API Key',
          description: 'Your Courier API key (from app.courier.com/settings/api-keys)',
        },
      },
      required: ['api_key'],
    },
  });
});

app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

const PORT = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Stateless MCP server running on port ${PORT}`);
});
