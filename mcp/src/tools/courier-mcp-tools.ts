import CourierMcpServer from "../index.js";

export class CourierMcpTools {
  readonly server: CourierMcpServer;

  constructor(server: CourierMcpServer) {
    this.server = server;
  }

  /**
   * Register all tools with the provided MCP server instance.
   */
  public register() {
    // Implement this method in subclasses to register tools
  }
}
