import z from "zod";
import { CourierMcpTools } from "./tools.js";

export class NotificationsTools extends CourierMcpTools {
  public register() {
    // List notifications
    this.mcp.tool(
      "list_notifications",
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
    this.mcp.tool(
      "get_notification_content",
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
    this.mcp.tool(
      "get_notification_draft_content",
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

    // // Get submission checks for a notification
    // this.mcp.tool(
    //   "get_notification_submission_checks",
    //   "Get submission checks for a notification by notification ID and submission ID.",
    //   {
    //     notification_id: z.string(),
    //     submission_id: z.string(),
    //     timeout_in_seconds: z.number().optional(),
    //     max_retries: z.number().optional(),
    //   },
    //   async ({ notification_id, submission_id }) => {
    //     return await this.mcp.client.notifications.getSubmissionChecks(
    //       notification_id,
    //       submission_id
    //     );
    //   }
    // );
  }
}
