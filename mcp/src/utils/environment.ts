import { CourierClientOptions } from "../client/courier-client.js";
import fs from "fs";
import path from "path";

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

        // Support Courier config from mcp.json (CLI/Server)
        if (parsed?.mcpServers?.Courier?.env) {
          return parsed.mcpServers.Courier.env;
        }

        // Support Courier config from claude_desktop_config.json (Claude Desktop)
        if (parsed?.mcpServers?.courier?.headers) {
          return parsed.mcpServers.courier.headers;
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
  readonly showLogs: boolean;

  constructor(headers?: Record<string, any>) {
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
    this.showLogs =
      headers?.['SHOW_LOGS'] ??
      headers?.['show_logs'] ??
      fileConfig['SHOW_LOGS'] ??
      fileConfig['show_logs'] ??
      true;
  }

  public toCourierClientOptions(): CourierClientOptions {
    return {
      apiKey: this.apiKey,
      baseUrl: this.baseUrl,
      showLogs: this.showLogs,
    };
  }

}