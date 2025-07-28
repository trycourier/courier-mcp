import fs from 'fs';
import path from 'path';

export type CourierMcpConfig = {
  BASE_URL?: string;
  API_KEY?: string;
};

/**
 * Attempts to load just the Courier "config" part from mcp.json from several possible locations.
 * Returns the config object, or undefined if not found.
 */
export function getCourierConfig(headers?: Record<string, any>): CourierMcpConfig {

  if (headers) {
    let authHeader = headers['Authorization'] || headers['authorization'];
    let token: string | undefined = undefined;
    if (typeof authHeader === 'string') {
      // Split out "Bearer <token>"
      const match = authHeader.match(/^Bearer\s+(.+)$/i);
      token = match ? match[1] : authHeader;
    }
    return {
      API_KEY: token,
      BASE_URL: undefined, // TODO: add base url
    };
  }

  const possiblePaths = [
    path.resolve(process.cwd(), 'mcp.json'),
    path.resolve(process.cwd(), '.cursor', 'mcp.json'),
    path.resolve(process.env.HOME || '', '.cursor', 'mcp.json'),
  ];
  for (const configPath of possiblePaths) {
    try {
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        if (
          config &&
          config.mcpServers &&
          config.mcpServers.Courier &&
          config.mcpServers.Courier.config
        ) {
          return config.mcpServers.Courier.config as CourierMcpConfig;
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  return {
    API_KEY: undefined,
    BASE_URL: undefined,
  };
}
