import { CourierMcpLogLevel } from "./types.js";
import { CourierMcpToolsRegistry } from "./courier-mcp-tools-registry.js";

export class CourierMcpConfig {

  readonly apiKey: string;
  readonly baseUrl: string;
  readonly logLevel: CourierMcpLogLevel;
  readonly availableTools: string[];

  constructor(props: { headers?: Record<string, any>, logLevel?: CourierMcpLogLevel, availableTools?: string[] }) {
    const { headers, logLevel, availableTools } = props;

    this.apiKey =
      headers?.['API_KEY'] ||
      headers?.['api_key'] ||
      process.env.COURIER_API_KEY ||
      '';

    this.baseUrl =
      headers?.['BASE_URL'] ||
      headers?.['base_url'] ||
      process.env.COURIER_BASE_URL ||
      'https://api.courier.com';

    this.logLevel = logLevel || CourierMcpLogLevel.ERROR;
    this.availableTools = availableTools || CourierMcpToolsRegistry.defaultTools;
  }
}
