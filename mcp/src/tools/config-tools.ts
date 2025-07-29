import { CourierMcpTools } from "./tools.js";

export class EnvironmentTools extends CourierMcpTools {

  public register() {
    this.mcp.tool(
      'get_environment_config',
      'Get the Courier environment configuration',
      {},
      async () => {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(this.mcp.environment, null, 2),
            },
          ],
        };
      }
    );
  }
}