import z from "zod";
import { CourierMcpTools } from "./tools.js";

export class ListsTools extends CourierMcpTools {
  public register() {
    // List all lists
    this.mcp.tool(
      "list_lists",
      "Returns all of the lists, with the ability to filter based on a pattern.",
      {
        pattern: z.string().optional(),
        cursor: z.string().optional(),
        limit: z.number().optional(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ pattern, cursor, limit, timeout_in_seconds, max_retries }) => {
        try {
          const request: any = {};
          if (pattern !== undefined) request.pattern = pattern;
          if (cursor !== undefined) request.cursor = cursor;
          if (limit !== undefined) request.limit = limit;

          const requestOptions: any = {};
          if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
          if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

          const response = await this.mcp.courierClient.lists.list(request, requestOptions);

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

    // Get a list by ID
    this.mcp.tool(
      "get_list",
      "Returns a list based on the list ID provided.",
      {
        list_id: z.string(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ list_id, timeout_in_seconds, max_retries }) => {
        try {
          const requestOptions: any = {};
          if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
          if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

          const response = await this.mcp.courierClient.lists.get(list_id, requestOptions);

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

    // // Create or replace a list
    // this.server.tool(
    //   "put_list",
    //   "Create or replace an existing list with the supplied values.",
    //   {
    //     list_id: z.string(),
    //     name: z.string().optional(),
    //     preferences: z.record(z.any()).optional(),
    //     timeout_in_seconds: z.number().optional(),
    //     max_retries: z.number().optional(),
    //   },
    //   async ({ list_id, name, preferences, timeout_in_seconds, max_retries }) => {
    //     try {
    //       const request: any = {};
    //       if (name !== undefined) request.name = name;
    //       if (preferences !== undefined) request.preferences = preferences;

    //       const requestOptions: any = {};
    //       if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
    //       if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

    //       const response = await this.server.courierClient.lists.update(list_id, request, requestOptions);

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

    // // Delete a list
    // this.server.tool(
    //   "delete_list",
    //   "Delete a list by list ID.",
    //   {
    //     list_id: z.string(),
    //     timeout_in_seconds: z.number().optional(),
    //     max_retries: z.number().optional(),
    //   },
    //   async ({ list_id, timeout_in_seconds, max_retries }) => {
    //     try {
    //       const requestOptions: any = {};
    //       if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
    //       if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

    //       await this.server.courierClient.lists.delete(list_id, requestOptions);

    //       return {
    //         content: [
    //           {
    //             type: "text",
    //             text: `List '${list_id}' deleted successfully.`,
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

    // // Restore a deleted list
    // this.server.tool(
    //   "restore_list",
    //   "Restore a previously deleted list.",
    //   {
    //     list_id: z.string(),
    //     timeout_in_seconds: z.number().optional(),
    //     max_retries: z.number().optional(),
    //   },
    //   async ({ list_id, timeout_in_seconds, max_retries }) => {
    //     try {
    //       const requestOptions: any = {};
    //       if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
    //       if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

    //       await this.server.courierClient.lists.restore(list_id, requestOptions);

    //       return {
    //         content: [
    //           {
    //             type: "text",
    //             text: `List '${list_id}' restored successfully.`,
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

    // Get list subscribers
    this.mcp.tool(
      "get_list_subscribers",
      "Get the list's subscriptions.",
      {
        list_id: z.string(),
        cursor: z.string().optional(),
        limit: z.number().optional(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ list_id, cursor, limit, timeout_in_seconds, max_retries }) => {
        try {
          const request: any = {};
          if (cursor !== undefined) request.cursor = cursor;
          if (limit !== undefined) request.limit = limit;

          const requestOptions: any = {};
          if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
          if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

          const response = await this.mcp.courierClient.lists.getSubscribers(list_id, request, requestOptions);

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

    // // Update (replace) list subscribers
    // this.server.tool(
    //   "update_list_subscribers",
    //   "Subscribes the users to the list, overwriting existing subscriptions. If the list does not exist, it will be automatically created.",
    //   {
    //     list_id: z.string(),
    //     recipients: z.array(
    //       z.object({
    //         recipient_id: z.string(),
    //         preferences: z.record(z.any()).optional(),
    //       })
    //     ),
    //     timeout_in_seconds: z.number().optional(),
    //     max_retries: z.number().optional(),
    //   },
    //   async ({ list_id, recipients, timeout_in_seconds, max_retries }) => {
    //     try {
    //       const request: any = {
    //         recipients: recipients.map((r: any) => ({
    //           recipientId: r.recipient_id,
    //           preferences: r.preferences,
    //         })),
    //       };

    //       const requestOptions: any = {};
    //       if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
    //       if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

    //       await this.server.courierClient.lists.updateSubscribers(list_id, request, requestOptions);

    //       return {
    //         content: [
    //           {
    //             type: "text",
    //             text: `List '${list_id}' subscribers updated successfully.`,
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

    // // Add subscribers to a list (append)
    // this.server.tool(
    //   "add_list_subscribers",
    //   "Subscribes additional users to the list, without modifying existing subscriptions. If the list does not exist, it will be automatically created.",
    //   {
    //     list_id: z.string(),
    //     recipients: z.array(
    //       z.object({
    //         recipient_id: z.string(),
    //         preferences: z.record(z.any()).optional(),
    //       })
    //     ),
    //     idempotency_key: z.string().optional(),
    //     idempotency_expiry: z.string().optional(),
    //     timeout_in_seconds: z.number().optional(),
    //     max_retries: z.number().optional(),
    //   },
    //   async ({
    //     list_id,
    //     recipients,
    //     idempotency_key,
    //     idempotency_expiry,
    //     timeout_in_seconds,
    //     max_retries,
    //   }) => {
    //     try {
    //       const request: any = {
    //         recipients: recipients.map((r: any) => ({
    //           recipientId: r.recipient_id,
    //           preferences: r.preferences,
    //         })),
    //       };

    //       const requestOptions: any = {};
    //       if (idempotency_key !== undefined) requestOptions.idempotencyKey = idempotency_key;
    //       if (idempotency_expiry !== undefined) requestOptions.idempotencyExpiry = idempotency_expiry;
    //       if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
    //       if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

    //       await this.server.courierClient.lists.addSubscribers(list_id, request, requestOptions);

    //       return {
    //         content: [
    //           {
    //             type: "text",
    //             text: `Subscribers added to list '${list_id}' successfully.`,
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

    // Subscribe a user to a list
    this.mcp.tool(
      "subscribe_user_to_list",
      "Subscribe a user to an existing list (note: if the List does not exist, it will be automatically created).",
      {
        list_id: z.string(),
        user_id: z.string(),
        preferences: z.record(z.any()).optional(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ list_id, user_id, preferences, timeout_in_seconds, max_retries }) => {
        try {
          const request: any = {};
          if (preferences !== undefined) request.preferences = preferences;

          const requestOptions: any = {};
          if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
          if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

          await this.mcp.courierClient.lists.subscribe(list_id, user_id, request, requestOptions);

          return {
            content: [
              {
                type: "text",
                text: `User '${user_id}' subscribed to list '${list_id}' successfully.`,
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

    // Unsubscribe a user from a list
    this.mcp.tool(
      "unsubscribe_user_from_list",
      "Delete a subscription to a list by list ID and user ID.",
      {
        list_id: z.string(),
        user_id: z.string(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ list_id, user_id, timeout_in_seconds, max_retries }) => {
        try {
          const requestOptions: any = {};
          if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
          if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

          await this.mcp.courierClient.lists.unsubscribe(list_id, user_id, requestOptions);

          return {
            content: [
              {
                type: "text",
                text: `User '${user_id}' unsubscribed from list '${list_id}' successfully.`,
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
