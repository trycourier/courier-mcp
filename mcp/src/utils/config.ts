import fs from "fs";
import path from "path";
import { CourierClientOptions } from "../client/courier-client.js";
import { CourierMcpLogLevel } from "./types.js";
import { CourierMcpToolsRegistry } from "./courier-mcp-tools-registry.js";

function loadMcpConfigFile(): any {
  const possiblePaths = [
    path.resolve(process.cwd(), 'mcp.json'),
    path.resolve(process.cwd(), '.cursor', 'mcp.json'),
    path.resolve(process.env.HOME || '', '.cursor', 'mcp.json'),
    path.resolve(process.cwd(), 'claude_desktop_config.json'),
    path.resolve(process.env.HOME || '', '.cursor', 'claude_desktop_config.json'),
  ];

  for (const configPath of possiblePaths) {
    try {
      if (fs.existsSync(configPath)) {
        const fileContent = fs.readFileSync(configPath, "utf-8");
        const parsed = JSON.parse(fileContent);

        // Support envs
        if (parsed?.mcpServers?.Courier?.env) {
          return parsed.mcpServers.Courier.env;
        }

        if (parsed?.mcpServers?.courier?.env) {
          return parsed.mcpServers.courier.env;
        }

        // Support headers
        if (parsed?.mcpServers?.Courier?.headers) {
          return parsed.mcpServers.Courier.headers;
        }

        if (parsed?.mcpServers?.courier?.env) {
          return parsed.mcpServers.courier.env;
        }

        // Fallback: return the whole file if structure is different
        return parsed;
      }
    } catch (err) {
      // Ignore and try next path
    }
  }
  return {};
}

export class CourierMcpConfig {

  readonly apiKey: string;
  readonly baseUrl: string;
  readonly logLevel: CourierMcpLogLevel;
  readonly availableTools: string[];

  constructor(props: { headers?: Record<string, any>, logLevel?: CourierMcpLogLevel, availableTools?: string[] }) {
    const { headers, logLevel, availableTools } = props;

    const fileConfig = loadMcpConfigFile();

    this.apiKey =
      headers?.['API_KEY'] ||
      headers?.['api_key'] ||
      fileConfig['API_KEY'] ||
      fileConfig['api_key'] ||
      '';

    this.baseUrl =
      headers?.['BASE_URL'] ||
      headers?.['base_url'] ||
      fileConfig['BASE_URL'] ||
      fileConfig['base_url'] ||
      'https://api.courier.com';

    this.logLevel = logLevel || CourierMcpLogLevel.ERROR;

    this.availableTools = availableTools || CourierMcpToolsRegistry.defaultTools;
  }

  public toCourierClientOptions(): CourierClientOptions {
    return {
      apiKey: this.apiKey,
      baseUrl: this.baseUrl,
      logLevel: this.logLevel,
    };
  }

}