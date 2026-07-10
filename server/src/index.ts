import express, { Request, Response, NextFunction } from 'express';
import { statelessHandler } from 'express-mcp-handler';
import CourierMcp, { CourierMcpLogLevel, CourierMcpConfig, CourierMcpTools, PACKAGE_NAME, PACKAGE_VERSION } from 'courier-mcp';

const app = express();
app.use(express.json());

// The single MCP endpoint. Per the MCP Streamable HTTP transport spec, this path
// must accept POST (JSON-RPC) and answer GET/DELETE with 405 — GET is the client's
// OPTIONAL server-to-client SSE stream, which a stateless server doesn't offer, and
// DELETE is client session termination, which we don't support. `statelessHandler`
// already does all of this: it dispatches POST to the MCP server and returns a
// spec-compliant 405 for any other method. Routing every method through the one
// handler (instead of hand-rolling separate 405 routes) means the 405 can't be
// dropped by accident — a missing GET route falls through to Express's default 404,
// which MCP clients treat as a fatal "Failed to open SSE stream".
// Spec: https://modelcontextprotocol.io/specification/2025-06-18/basic/transports
const mcpHandler = (req: Request, res: Response, next: NextFunction) => {
  const createServer = () => {
    const config = new CourierMcpConfig({
      headers: req.headers,
      logLevel: CourierMcpLogLevel.DEBUG,
      availableTools: CourierMcpTools.allAvailableTools,
    });
    return new CourierMcp(config);
  };
  return statelessHandler(createServer)(req, res, next);
};

app.post('/', mcpHandler);
app.get('/', mcpHandler);
app.delete('/', mcpHandler);

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

const PORT = parseInt(process.env.PORT || '3939', 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Stateless MCP server running on port ${PORT}`);
});
