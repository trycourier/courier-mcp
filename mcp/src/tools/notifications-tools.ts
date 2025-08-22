import z from "zod";
import { CourierMcpTools } from "./tools.js";

export class NotificationsTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'list_notifications',
    'get_notification_content',
    'get_notification_draft_content',
  ];

  public register() {

    // List notifications
    this.registerToolIfNeeded(
      NotificationsTools.tools[0],
      "List notifications. Optionally filter by cursor, limit, or draft status.",
      {
        cursor: z.string().optional(),
        limit: z.number().optional(),
        draft: z.boolean().optional(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ cursor, limit, draft }) => {
        const request: any = {};
        if (cursor !== undefined) request.cursor = cursor;
        if (limit !== undefined) request.limit = limit;
        if (draft !== undefined) request.draft = draft;

        return await this.mcp.client.notifications.list(request);
      }
    );

    // Get notification content by ID
    this.registerToolIfNeeded(
      NotificationsTools.tools[1],
      "Get the content of a notification by its ID.",
      {
        notification_id: z.string(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ notification_id }) => {
        return await this.mcp.client.notifications.getContent(notification_id);
      }
    );

    // Get draft content of a notification by ID
    this.registerToolIfNeeded(
      NotificationsTools.tools[2],
      "Get the draft content of a notification by its ID.",
      {
        notification_id: z.string(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ notification_id }) => {
        return await this.mcp.client.notifications.getDraftContent(notification_id);
      }
    );

  }
}
