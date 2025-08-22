import { CourierMcpTools } from "./courier-mcp-tools.js";

export class ConfigTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'get_environment_config',
  ];

  public register() {
    this.registerToolIfNeeded(
      ConfigTools.tools[0],
      'Get the Courier environment configuration',
      {},
      async () => {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(this.mcp.client.options, null, 2),
            },
          ],
        };
      }
    );
  }
}