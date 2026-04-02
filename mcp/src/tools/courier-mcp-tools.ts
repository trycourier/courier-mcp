import { ZodRawShape } from "zod";
import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolAnnotations } from "@modelcontextprotocol/sdk/types.js";
import CourierMcp from "../index.js";

export class CourierMcpTools {

  static readonly tools: string[] = [];
  readonly mcp: CourierMcp;

  constructor(mcp: CourierMcp) {
    this.mcp = mcp;
  }

  public register() {}

  public registerToolIfNeeded<Args extends ZodRawShape>(
    tool: string,
    description: string,
    paramsSchema: Args,
    cb: ToolCallback<Args>,
    annotations?: ToolAnnotations
  ) {
    if (this.mcp.config.availableTools.includes(tool)) {
      if (annotations) {
        this.mcp.tool(tool, description, paramsSchema, annotations, cb);
      } else {
        this.mcp.tool(tool, description, paramsSchema, cb);
      }
    }
  }
}
