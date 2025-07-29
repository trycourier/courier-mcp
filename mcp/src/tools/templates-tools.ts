import z from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";

export class TemplatesTools extends CourierMcpTools {

  public register() {
    // List notification templates
    this.server.tool(
      'list_templates',
      'Returns a list of notification templates',
      {
        cursor: z.string().optional(),
        limit: z.number().optional(),
      },
      async ({ cursor, limit }) => {
        try {
          const request: any = {};
          if (cursor !== undefined) request.cursor = cursor;
          if (limit !== undefined) request.limit = limit;
          const response = await this.server.courierClient.templates.list(request);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response, null, 2),
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(err, null, 2),
              },
            ],
          };
        }
      }
    );
  }
}
