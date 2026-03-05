import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";

export class ConfigTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'get_environment_config',
  ];

  public register() {
    this.registerToolIfNeeded(
      ConfigTools.tools[0],
      'Get the current Courier MCP environment configuration (base URL, available tools). Does not expose the API key.',
      {},
      async () => {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                baseUrl: this.mcp.config.baseUrl,
                availableTools: this.mcp.config.availableTools,
              }, null, 2),
            },
          ],
        };
      }
    );
  }
}
