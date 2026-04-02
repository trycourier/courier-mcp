import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class AuditEventsTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'get_audit_event',
    'list_audit_events',
  ];

  public register() {

    this.registerToolIfNeeded(
      AuditEventsTools.tools[0],
      'Get a specific audit event by its ID.',
      {
        audit_event_id: z.string().describe('The audit event ID'),
      },
      async ({ audit_event_id }) => {
        return handleToolCall(() => this.mcp.courier.auditEvents.retrieve(audit_event_id));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      AuditEventsTools.tools[1],
      'List audit events in the workspace. Useful for tracking API usage and changes.',
      {
        cursor: z.string().optional().describe('Pagination cursor'),
      },
      async ({ cursor }) => {
        return handleToolCall(() => this.mcp.courier.auditEvents.list(cursor ? { cursor } : {}));
      },
      { readOnlyHint: true }
    );
  }
}
