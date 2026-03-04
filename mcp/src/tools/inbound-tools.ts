import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class InboundTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'track_inbound_event',
  ];

  public register() {

    this.registerToolIfNeeded(
      InboundTools.tools[0],
      'Track an inbound event that can trigger automations. Requires event name, messageId (for deduplication), and properties.',
      {
        event: z.string().describe('The event name (appears as trigger in Automation Trigger node)'),
        messageId: z.string().describe('Unique ID for deduplication (returns 409 if not unique)'),
        properties: z.record(z.any()).describe('Event properties payload'),
        userId: z.string().optional().describe('User ID associated with the event'),
      },
      async ({ event, messageId, properties, userId }) => {
        return handleToolCall(() => {
          const body: Record<string, any> = { event, messageId, properties, type: 'track' as const };
          if (userId) body.userId = userId;
          return this.mcp.courier.inbound.trackEvent(body as any);
        });
      }
    );
  }
}
