import { ZodRawShape } from "zod";
import CourierMcp, { AudienceTools, AuditEventsTools, AuthTokenTools, AutomationsTools, BrandsTools, BulkTools, ConfigTools, DocsTools, InboundTools, ListsTools, MessagesTools, NotificationsTools, ProfilesTools, SendTools, UserTokensTools } from "../index.js";
import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";

export class CourierMcpTools {

  static readonly tools: string[] = [];
  readonly mcp: CourierMcp;

  constructor(mcp: CourierMcp) {
    this.mcp = mcp;
  }

  /**
   * Register all tools with the provided MCP server instance.
   */
  public register() {
    // Implement this method in subclasses to register tools
  }

  /**
   * Attach a tool to the MCP server instance.
   * @param tool - The name of the tool.
   * @param description - The description of the tool.
   * @param paramsSchema - The schema of the tool's parameters.
   * @param cb - The callback function for the tool.
   */
  public registerToolIfNeeded<Args extends ZodRawShape>(
    tool: string,
    description: string,
    paramsSchema: Args,
    cb: ToolCallback<Args>
  ) {

    // Only register the tool if it is allowed
    if (this.mcp.config.availableTools.includes(tool)) {
      this.mcp.tool(tool, description, paramsSchema, cb);
    }

  }

  // The default tools the MCP server will register
  static readonly defaultTools: string[] = [
    ...AudienceTools.tools,
    ...AuditEventsTools.tools,
    ...AuthTokenTools.tools,
    ...AutomationsTools.tools,
    ...BrandsTools.tools,
    ...BulkTools.tools,
    ...DocsTools.tools,
    ...InboundTools.tools,
    ...ListsTools.tools,
    ...MessagesTools.tools,
    ...NotificationsTools.tools,
    ...ProfilesTools.tools,
    ...SendTools.tools,
    ...UserTokensTools.tools,
  ];

  // The tools that are available to the MCP server
  static readonly allAvailableTools: string[] = [
    ...this.defaultTools,
    ...ConfigTools.tools,
  ];

}
