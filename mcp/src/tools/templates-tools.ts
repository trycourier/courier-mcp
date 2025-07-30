import z from "zod";
import { CourierMcpTools } from "./tools.js";

export class TemplatesTools extends CourierMcpTools {

  public register() {
    // List notification templates
    this.mcp.tool(
      'list_templates',
      'Returns a list of notification templates',
      {
        cursor: z.string().optional(),
        limit: z.number().optional(),
      },
      async ({ cursor, limit }) => {
        const request: any = {};
        if (cursor !== undefined) request.cursor = cursor;
        if (limit !== undefined) request.limit = limit;
        return await this.mcp.client.templates.list(request);
      }
    );
  }
}
