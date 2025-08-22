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

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const PORT = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Stateless MCP server running on port ${PORT}`);
});