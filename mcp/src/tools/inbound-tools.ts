import z from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";

export class InboundTools extends CourierMcpTools {
  public register() {
    // Track an inbound event
    this.server.tool(
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
        timeout_in_seconds,
        max_retries,
      }) => {
        try {
          const request: any = {
            event,
          };
          if (message_id !== undefined) request.messageId = message_id;
          if (user_id !== undefined) request.userId = user_id;
          if (type !== undefined) request.type = type;
          if (properties !== undefined) request.properties = properties;

          const requestOptions: any = {};
          if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
          if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

          const response = await this.server.courierClient.inbound.track(request, requestOptions);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(response, null, 2),
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(err, null, 2),
              },
            ],
          };
        }
      }
    );
  }
}
