import z from "zod";
import { CourierMcpTools } from "./tools.js";

export class InboundTools extends CourierMcpTools {

  public register() {
    // Track an inbound event
    this.mcp.tool(
      "track_inbound_event",
      "Track an inbound event.",
      {
        event: z.string(),
        message_id: z.string().optional(),
        user_id: z.string().optional(),
        type: z.string().optional(),
        properties: z.record(z.any()).optional(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({
        event,
        message_id,
        user_id,
        type,
        properties,
      }) => {
        const request: any = {
          event,
        };
        if (message_id !== undefined) request.messageId = message_id;
        if (user_id !== undefined) request.userId = user_id;
        if (type !== undefined) request.type = type;
        if (properties !== undefined) request.properties = properties;

        return await this.mcp.client.inbound.track(request);
      }
    );
  }
}
