import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

// NOTE: The published @trycourier/courier SDK does not yet expose a typed
// `digests` resource. Until it is regenerated, these tools call the SDK's raw
// HTTP methods. Swap to `this.mcp.courier.digests.schedules.*` when available.
export class DigestsTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'release_digest',
    'list_digest_instances',
  ];

  public register() {

    this.registerToolIfNeeded(
      DigestsTools.tools[0],
      'Release a digest schedule early — send what users have collected so far now instead of waiting for the scheduled time. A 204 is also returned when the schedule has no in-progress instances to release.',
      {
        schedule_id: z.string().describe('The digest schedule id, in the form "sch/{uuid}"'),
      },
      async ({ schedule_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.post(`/digests/schedules/${encodeURIComponent(schedule_id)}/trigger`);
          return { success: true, message: `Digest schedule ${schedule_id} released` };
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      DigestsTools.tools[1],
      'List the digest instances for a schedule. Each instance represents the events accumulated for a single user against the schedule, useful for monitoring accumulation before a digest is released.',
      {
        schedule_id: z.string().describe('The digest schedule id, in the form "sch/{uuid}"'),
        cursor: z.string().optional().describe('Pagination cursor from a previous response'),
        limit: z.number().optional().describe('Max instances to return (default 20, max 100)'),
      },
      async ({ schedule_id, cursor, limit }) => {
        return handleToolCall(() => {
          const query: Record<string, any> = {};
          if (cursor) query.cursor = cursor;
          if (limit) query.limit = limit;
          return this.mcp.courier.get(`/digests/schedules/${encodeURIComponent(schedule_id)}/instances`, { query });
        });
      },
      { readOnlyHint: true }
    );
  }
}
