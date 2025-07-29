import { z } from "zod";
import { CourierMcpTools } from "./tools.js";

export class MessagesTools extends CourierMcpTools {
  // public register() {
  //   // List messages
  //   this.server.tool(
  //     "list_messages",
  //     "Fetch the statuses of messages you've previously sent.",
  //     {
  //       request: z
  //         .object({
  //           archived: z.boolean().optional(),
  //           cursor: z.string().optional(),
  //           event: z.string().optional(),
  //           list: z.string().optional(),
  //           messageId: z.string().optional(),
  //           notification: z.string().optional(),
  //           provider: z.union([z.string(), z.array(z.string())]).optional(),
  //           recipient: z.string().optional(),
  //           status: z.union([z.string(), z.array(z.string())]).optional(),
  //           tag: z.union([z.string(), z.array(z.string())]).optional(),
  //           tags: z.string().optional(),
  //           tenant_id: z.string().optional(),
  //           enqueued_after: z.string().optional(),
  //           traceId: z.string().optional(),
  //         })
  //         .optional(),
  //       timeout_in_seconds: z.number().optional(),
  //       max_retries: z.number().optional(),
  //     },
  //     async ({ request, timeout_in_seconds, max_retries }) => {
  //       try {
  //         const requestOptions: any = {};
  //         if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
  //         if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

  //         // The API expects tags as a comma-delimited string, not an array.
  //         let req = { ...request };
  //         if (req && Array.isArray(req.tags)) {
  //           req.tags = req.tags.join(",");
  //         }

  //         const resp = await this.server.courierClient.messages.list(req, requestOptions);
  //         return {
  //           content: [
  //             {
  //               type: "json",
  //               json: resp,
  //             },
  //           ],
  //         };
  //       } catch (err: any) {
  //         return {
  //           content: [
  //             {
  //               type: "text",
  //               text: JSON.stringify(err, null, 2),
  //             },
  //           ],
  //         };
  //       }
  //     }
  //   );

  //   // Get message details
  //   this.server.tool(
  //     "get_message",
  //     "Fetch the status of a message you've previously sent.",
  //     {
  //       message_id: z.string(),
  //       timeout_in_seconds: z.number().optional(),
  //       max_retries: z.number().optional(),
  //     },
  //     async ({ message_id, timeout_in_seconds, max_retries }) => {
  //       try {
  //         const requestOptions: any = {};
  //         if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
  //         if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

  //         const resp = await this.server.courierClient.messages.get(message_id, requestOptions);
  //         return {
  //           content: [
  //             {
  //               type: "json",
  //               json: resp,
  //             },
  //           ],
  //         };
  //       } catch (err: any) {
  //         return {
  //           content: [
  //             {
  //               type: "text",
  //               text: JSON.stringify(err, null, 2),
  //             },
  //           ],
  //         };
  //       }
  //     }
  //   );

  //   // Cancel a message
  //   this.server.tool(
  //     "cancel_message",
  //     "Cancel a message that is currently in the process of being delivered.",
  //     {
  //       message_id: z.string(),
  //       idempotency_key: z.string().optional(),
  //       idempotency_expiry: z.string().optional(),
  //       timeout_in_seconds: z.number().optional(),
  //       max_retries: z.number().optional(),
  //     },
  //     async ({ message_id, idempotency_key, idempotency_expiry, timeout_in_seconds, max_retries }) => {
  //       try {
  //         const requestOptions: any = {};
  //         if (idempotency_key !== undefined) requestOptions.idempotencyKey = idempotency_key;
  //         if (idempotency_expiry !== undefined) requestOptions.idempotencyExpiry = idempotency_expiry;
  //         if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
  //         if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

  //         const resp = await this.server.courierClient.messages.cancel(message_id, requestOptions);
  //         return {
  //           content: [
  //             {
  //               type: "json",
  //               json: resp,
  //             },
  //           ],
  //         };
  //       } catch (err: any) {
  //         return {
  //           content: [
  //             {
  //               type: "text",
  //               text: JSON.stringify(err, null, 2),
  //             },
  //           ],
  //         };
  //       }
  //     }
  //   );

  //   // Get message history
  //   this.server.tool(
  //     "get_message_history",
  //     "Fetch the array of events of a message you've previously sent.",
  //     {
  //       message_id: z.string(),
  //       request: z
  //         .object({
  //           type: z.string().optional(),
  //         })
  //         .optional(),
  //       timeout_in_seconds: z.number().optional(),
  //       max_retries: z.number().optional(),
  //     },
  //     async ({ message_id, request, timeout_in_seconds, max_retries }) => {
  //       try {
  //         const requestOptions: any = {};
  //         if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
  //         if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

  //         const resp = await this.server.courierClient.messages.getHistory(message_id, request, requestOptions);
  //         return {
  //           content: [
  //             {
  //               type: "json",
  //               json: resp,
  //             },
  //           ],
  //         };
  //       } catch (err: any) {
  //         return {
  //           content: [
  //             {
  //               type: "text",
  //               text: JSON.stringify(err, null, 2),
  //             },
  //           ],
  //         };
  //       }
  //     }
  //   );

  //   // Get message content
  //   this.server.tool(
  //     "get_message_content",
  //     "Fetch the rendered content of a message you've previously sent.",
  //     {
  //       message_id: z.string(),
  //       timeout_in_seconds: z.number().optional(),
  //       max_retries: z.number().optional(),
  //     },
  //     async ({ message_id, timeout_in_seconds, max_retries }) => {
  //       try {
  //         const requestOptions: any = {};
  //         if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
  //         if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

  //         const resp = await this.server.courierClient.messages.getContent(message_id, requestOptions);
  //         return {
  //           content: [
  //             {
  //               type: "json",
  //               json: resp,
  //             },
  //           ],
  //         };
  //       } catch (err: any) {
  //         return {
  //           content: [
  //             {
  //               type: "text",
  //               text: JSON.stringify(err, null, 2),
  //             },
  //           ],
  //         };
  //       }
  //     }
  //   );

  //   // Archive a message request
  //   this.server.tool(
  //     "archive_message_request",
  //     "Archive a message request by request ID.",
  //     {
  //       request_id: z.string(),
  //       timeout_in_seconds: z.number().optional(),
  //       max_retries: z.number().optional(),
  //     },
  //     async ({ request_id, timeout_in_seconds, max_retries }) => {
  //       try {
  //         const requestOptions: any = {};
  //         if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
  //         if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

  //         await this.server.courierClient.messages.archive(request_id, requestOptions);
  //         return {
  //           content: [
  //             {
  //               type: "text",
  //               text: `Message request '${request_id}' archived successfully.`,
  //             },
  //           ],
  //         };
  //       } catch (err: any) {
  //         return {
  //           content: [
  //             {
  //               type: "text",
  //               text: JSON.stringify(err, null, 2),
  //             },
  //           ],
  //         };
  //       }
  //     }
  //   );
  // }
}
