import { CourierMcpLogLevel } from "../utils/types.js";
import { CourierMcpTools } from "./tools.js";

export class EnvironmentTools extends CourierMcpTools {

  public register() {

    // Do not register the tool if the log level is not DEBUG
    // This tool is simply unusable unless debug is set
    if (this.mcp.client.options.logLevel === CourierMcpLogLevel.DEBUG) {
      this.mcp.tool(
        'get_environment_config',
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
}