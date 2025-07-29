import z from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";

export class AuditEventsTools extends CourierMcpTools {

  public register() {
    // Get an audit event by audit_event_id
    this.server.tool(
      'get_audit_event',
      'Get an audit event by its ID',
      {
        audit_event_id: z.string(),
      },
      async ({ audit_event_id }) => {
        try {
          const response = await this.server.courierClient.auditEvents.get(audit_event_id);
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

    // List all audit events
    this.server.tool(
      'list_audit_events',
      'List all audit events associated with the authorization token',
      {
        cursor: z.string().optional(),
        limit: z.number().optional(),
      },
      async ({ cursor, limit }) => {
        try {
          const request: any = {};
          if (cursor !== undefined) request.cursor = cursor;
          if (limit !== undefined) request.limit = limit;
          const response = await this.server.courierClient.auditEvents.list(request);
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