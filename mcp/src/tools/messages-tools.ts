import { z } from "zod";
import { CourierMcpTools } from "./tools.js";

export class MessagesTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'list_messages',
    'get_message',
    'get_message_content',
  ];

  public register() {

    // List messages
    this.registerToolIfNeeded(
      MessagesTools.tools[0],
      "Fetch the statuses of messages you've previously sent.",
      {
        archived: z.boolean().optional(),
        cursor: z.string().optional(),
        event: z.string().optional(),
        list: z.string().optional(),
        messageId: z.string().optional(),
        notification: z.string().optional(),
        provider: z.union([z.string(), z.array(z.string())]).optional(),
        recipient: z.string().optional(),
        status: z.union([z.string(), z.array(z.string())]).optional(),
        tag: z.union([z.string(), z.array(z.string())]).optional(),
        tags: z.union([z.string(), z.array(z.string())]).optional(),
        tenant_id: z.string().optional(),
        enqueued_after: z.string().optional(),
        traceId: z.string().optional(),
      },
      async (args) => {
        // The API expects tags as a comma-delimited string, not an array.
        let req: any = { ...args };
        if (req.tags && Array.isArray(req.tags)) {
          req.tags = req.tags.join(",");
        }
        if (req.tag && Array.isArray(req.tag)) {
          req.tag = req.tag.join(",");
        }
        // Remove undefined values
        Object.keys(req).forEach((k) => req[k] === undefined && delete req[k]);
        return await this.mcp.client.messages.list(req);
      }
    );

    // Get message details
    this.registerToolIfNeeded(
      MessagesTools.tools[1],
      "Fetch the status of a message you've previously sent.",
      {
        message_id: z.string(),
      },
      async ({ message_id }) => {
        return await this.mcp.client.messages.get(message_id);
      }
    );

    // Get message content
    this.registerToolIfNeeded(
      MessagesTools.tools[2],
      "Fetch the rendered content of a message you've previously sent.",
      {
        message_id: z.string(),
      },
      async ({ message_id }) => {
        return await this.mcp.client.messages.getContent(message_id);
      }
    );
  }
}
