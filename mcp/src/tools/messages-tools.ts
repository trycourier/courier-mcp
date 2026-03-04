import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class MessagesTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'list_messages',
    'get_message',
    'get_message_content',
    'get_message_history',
    'cancel_message',
  ];

  public register() {

    this.registerToolIfNeeded(
      MessagesTools.tools[0],
      "List messages you've previously sent. Filter by status, recipient, notification, provider, tags, or tenant.",
      {
        cursor: z.string().optional().describe('Pagination cursor for fetching the next page'),
        event: z.string().optional().describe('Filter by event ID'),
        list: z.string().optional().describe('Filter by list ID'),
        messageId: z.string().optional().describe('Filter by message ID'),
        notification: z.string().optional().describe('Filter by notification ID'),
        recipient: z.string().optional().describe('Filter by recipient user ID'),
        status: z.array(z.string()).optional().describe('Filter by status (e.g. DELIVERED, UNDELIVERABLE)'),
        tag: z.array(z.string()).optional().describe('Filter by metadata tags'),
        tags: z.string().optional().describe('Comma-delimited list of tags'),
        tenant_id: z.string().optional().describe('Filter by tenant ID'),
        traceId: z.string().optional().describe('Filter by trace ID'),
        enqueued_after: z.string().optional().describe('ISO 8601 timestamp; only return messages enqueued after this time'),
        provider: z.array(z.string()).optional().describe('Filter by provider key (e.g. sendgrid, twilio)'),
        archived: z.boolean().optional().describe('Include archived messages'),
      },
      async (args) => {
        return handleToolCall(() => {
          const query: Record<string, any> = {};
          for (const [k, v] of Object.entries(args)) {
            if (v !== undefined) query[k] = v;
          }
          return this.mcp.courier.messages.list(query);
        });
      }
    );

    this.registerToolIfNeeded(
      MessagesTools.tools[1],
      "Get the full details and status of a single message by its ID.",
      {
        message_id: z.string().describe('The message ID to retrieve'),
      },
      async ({ message_id }) => {
        return handleToolCall(() => this.mcp.courier.messages.retrieve(message_id));
      }
    );

    this.registerToolIfNeeded(
      MessagesTools.tools[2],
      "Get the rendered content (HTML, text, subject) of a previously sent message.",
      {
        message_id: z.string().describe('The message ID'),
      },
      async ({ message_id }) => {
        return handleToolCall(() => this.mcp.courier.messages.content(message_id));
      }
    );

    this.registerToolIfNeeded(
      MessagesTools.tools[3],
      "Get the event history for a message, showing each step in the delivery pipeline (enqueued, sent, delivered, etc.).",
      {
        message_id: z.string().describe('The message ID'),
        type: z.string().optional().describe('Filter by event type'),
      },
      async ({ message_id, type }) => {
        return handleToolCall(() => this.mcp.courier.messages.history(message_id, type ? { type } : {}));
      }
    );

    this.registerToolIfNeeded(
      MessagesTools.tools[4],
      "Cancel a message that is currently being delivered. Returns the message details with updated status.",
      {
        message_id: z.string().describe('The message ID to cancel'),
      },
      async ({ message_id }) => {
        return handleToolCall(() => this.mcp.courier.messages.cancel(message_id));
      }
    );
  }
}
