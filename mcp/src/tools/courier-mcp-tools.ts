import { ZodRawShape } from "zod";
import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import CourierMcp from "../index.js";

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

}
