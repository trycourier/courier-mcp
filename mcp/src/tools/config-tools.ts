import { CourierMcpTools } from "./courier-mcp-tools.js";

export class ConfigTools extends CourierMcpTools {

  public register() {
    this.server.tool(
      'get_config',
      'Get the Courier tool configuration',
      {},
      async () => {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(this.server.config, null, 2),
            },
          ],
        };
      }
    );
  }
}