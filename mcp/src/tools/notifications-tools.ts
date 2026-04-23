import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class NotificationsTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'list_notifications',
    'get_notification_content',
    'get_notification_draft_content',
  ];

  public register() {

    this.registerToolIfNeeded(
      NotificationsTools.tools[0],
      "List notification templates. Optionally filter by cursor.",
      {
        cursor: z.string().optional().describe('Pagination cursor'),
      },
      async ({ cursor }) => {
        return handleToolCall(() => this.mcp.courier.notifications.list(cursor ? { cursor } : {}));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      NotificationsTools.tools[1],
      "Get the published content blocks of a notification template.",
      {
        notification_id: z.string().describe('The notification template ID'),
      },
      async ({ notification_id }) => {
        return handleToolCall(() => this.mcp.courier.notifications.retrieveContent(notification_id));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      NotificationsTools.tools[2],
      "Get the draft (unpublished) content blocks of a notification template.",
      {
        notification_id: z.string().describe('The notification template ID'),
      },
      async ({ notification_id }) => {
        return handleToolCall(() => this.mcp.courier.notifications.retrieveContent(notification_id, { version: 'draft' }));
      },
      { readOnlyHint: true }
    );
  }
}
