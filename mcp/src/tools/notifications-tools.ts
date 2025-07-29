import z from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";

export class NotificationsTools extends CourierMcpTools {
  public register() {
    // List notifications
    this.server.tool(
      "list_notifications",
      "List notifications. Optionally filter by cursor, limit, or draft status.",
      {
        cursor: z.string().optional(),
        limit: z.number().optional(),
        draft: z.boolean().optional(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ cursor, limit, draft, timeout_in_seconds, max_retries }) => {
        try {
          const request: any = {};
          if (cursor !== undefined) request.cursor = cursor;
          if (limit !== undefined) request.limit = limit;
          if (draft !== undefined) request.draft = draft;

          const requestOptions: any = {};
          if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
          if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

          const response = await this.server.courierClient.notifications.list(request, requestOptions);

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

    // Get notification content by ID
    this.server.tool(
      "get_notification_content",
      "Get the content of a notification by its ID.",
      {
        notification_id: z.string(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ notification_id, timeout_in_seconds, max_retries }) => {
        try {
          const requestOptions: any = {};
          if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
          if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

          const response = await this.server.courierClient.notifications.getContent(notification_id, requestOptions);

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

    // Get draft content of a notification by ID
    this.server.tool(
      "get_notification_draft_content",
      "Get the draft content of a notification by its ID.",
      {
        notification_id: z.string(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ notification_id, timeout_in_seconds, max_retries }) => {
        try {
          const requestOptions: any = {};
          if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
          if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

          const response = await this.server.courierClient.notifications.getDraftContent(notification_id, requestOptions);

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

    // Get submission checks for a notification
    this.server.tool(
      "get_notification_submission_checks",
      "Get submission checks for a notification by notification ID and submission ID.",
      {
        notification_id: z.string(),
        submission_id: z.string(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ notification_id, submission_id, timeout_in_seconds, max_retries }) => {
        try {
          const requestOptions: any = {};
          if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
          if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

          const response = await this.server.courierClient.notifications.getSubmissionChecks(
            notification_id,
            submission_id,
            requestOptions
          );

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

    // // Replace submission checks for a notification
    // this.server.tool(
    //   "replace_notification_submission_checks",
    //   "Replace submission checks for a notification by notification ID and submission ID.",
    //   {
    //     notification_id: z.string(),
    //     submission_id: z.string(),
    //     checks: z.array(
    //       z.object({
    //         id: z.string(),
    //         status: z.string(),
    //         type: z.string(),
    //       })
    //     ),
    //     timeout_in_seconds: z.number().optional(),
    //     max_retries: z.number().optional(),
    //   },
    //   async ({ notification_id, submission_id, checks, timeout_in_seconds, max_retries }) => {
    //     try {
    //       const request = { checks };
    //       const requestOptions: any = {};
    //       if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
    //       if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

    //       const response = await this.server.courierClient.notifications.replaceSubmissionChecks(
    //         notification_id,
    //         submission_id,
    //         request,
    //         requestOptions
    //       );

    //       return {
    //         content: [
    //           {
    //             type: "text",
    //             text: JSON.stringify(response, null, 2),
    //           },
    //         ],
    //       };
    //     } catch (err: any) {
    //       return {
    //         content: [
    //           {
    //             type: "text",
    //             text: JSON.stringify(err, null, 2),
    //           },
    //         ],
    //       };
    //     }
    //   }
    // );

    // // Cancel a notification submission
    // this.server.tool(
    //   "cancel_notification_submission",
    //   "Cancel a notification submission by notification ID and submission ID.",
    //   {
    //     notification_id: z.string(),
    //     submission_id: z.string(),
    //     timeout_in_seconds: z.number().optional(),
    //     max_retries: z.number().optional(),
    //   },
    //   async ({ notification_id, submission_id, timeout_in_seconds, max_retries }) => {
    //     try {
    //       const requestOptions: any = {};
    //       if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
    //       if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

    //       await this.server.courierClient.notifications.cancelSubmission(
    //         notification_id,
    //         submission_id,
    //         requestOptions
    //       );

    //       return {
    //         content: [
    //           {
    //             type: "text",
    //             text: `Notification submission '${submission_id}' for notification '${notification_id}' cancelled successfully.`,
    //           },
    //         ],
    //       };
    //     } catch (err: any) {
    //       return {
    //         content: [
    //           {
    //             type: "text",
    //             text: JSON.stringify(err, null, 2),
    //           },
    //         ],
    //       };
    //     }
    //   }
    // );
  }
}
