// import z from "zod";
import { CourierMcpTools } from "./tools.js";

export class AuditEventsTools extends CourierMcpTools {

  // Not needed for now..
  // public register() {
  //   // Get an audit event by audit_event_id
  //   this.mcp.tool(
  //     'get_audit_event',
  //     'Get an audit event by its ID',
  //     {
  //       audit_event_id: z.string(),
  //     },
  //     async ({ audit_event_id }) => {
  //       return await this.mcp.client.auditEvents.get(audit_event_id);
  //     }
  //   );

  //   // List all audit events
  //   this.mcp.tool(
  //     'list_audit_events',
  //     'List all audit events associated with the authorization token',
  //     {
  //       cursor: z.string().optional(),
  //       limit: z.number().optional(),
  //     },
  //     async ({ cursor, limit }) => {
  //       const request: any = {};
  //       if (cursor !== undefined) request.cursor = cursor;
  //       if (limit !== undefined) request.limit = limit;
  //       return await this.mcp.client.auditEvents.list(request);
  //     }
  //   );
  // }
}