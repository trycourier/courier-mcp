import { CourierMcpTools } from "./courier-mcp-tools.js";
import { PACKAGE_VERSION } from "../utils/version.js";

export class ConfigTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'get_environment_config',
  ];

  public register() {
    this.registerToolIfNeeded(
      ConfigTools.tools[0],
      'Check which Courier API key, base URL, and package version this MCP session is using. Useful for debugging environment issues without leaving the agent.',
      {},
      async () => {
        const key = this.mcp.config.apiKey;
        const masked = key.length > 12
          ? key.slice(0, 8) + '...' + key.slice(-4)
          : '***';
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                apiKey: masked,
                baseUrl: this.mcp.config.baseUrl,
                version: PACKAGE_VERSION,
                toolCount: this.mcp.config.availableTools.length,
              }, null, 2),
            },
          ],
        };
      }
    );
  }
}
