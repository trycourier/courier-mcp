import CourierMcp from "../index.js";

export class CourierMcpTools {
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
}
