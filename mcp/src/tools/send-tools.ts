import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class SendTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'send_message',
    'send_message_template',
    'send_message_to_list',
    'send_message_to_list_template',
  ];

  public register() {

    this.registerToolIfNeeded(
      SendTools.tools[0],
      'Send a message to a user using inline title and body content (no template). Optionally specify routing channels.',
      {
        user_id: z.string().describe('The recipient user ID'),
        title: z.string().describe('Message title'),
        body: z.string().describe('Message body'),
        data: z.record(z.string(), z.any()).optional().describe('Key-value data to include with the message'),
        method: z.enum(['all', 'single']).default('all').describe('Routing method: deliver to all channels or stop after first success'),
        channels: z.array(z.string()).optional().describe('Channel names to route through (e.g. email, sms, push). Omit to use default routing.'),
      },
      async ({ user_id, title, body, data, method, channels }) => {
        return handleToolCall(() => {
          const message: Record<string, any> = {
            to: { user_id },
            content: { title, body },
          };
          if (data) message.data = data;
          if (channels && channels.length > 0) {
            message.routing = { method, channels };
          }
          return this.mcp.courier.send.message({ message });
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      SendTools.tools[1],
      'Send a message to a user using a published notification template. The template must be published before sending — call publish_notification first if needed. Example: { user_id: "user-123", template: "nt_01abc123", data: { name: "Alex", resetUrl: "https://app.example.com/reset" } }.',
      {
        user_id: z.string().describe('The recipient user ID'),
        template: z.string().describe('Template ID or notification slug'),
        data: z.record(z.string(), z.any()).optional().describe('Key-value data for template variables'),
        method: z.enum(['all', 'single']).default('all').optional().describe('Routing method'),
        channels: z.array(z.string()).optional().describe('Channel names to route through. Omit to use template routing config.'),
      },
      async ({ user_id, template, data, method, channels }) => {
        return handleToolCall(() => {
          const message: Record<string, any> = {
            to: { user_id },
            template,
          };
          if (data) message.data = data;
          if (channels && channels.length > 0) {
            message.routing = { method: method || 'all', channels };
          }
          return this.mcp.courier.send.message({ message });
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      SendTools.tools[2],
      'Send a message to all subscribers of a list using inline title and body content.',
      {
        list_id: z.string().describe('The list ID to send to'),
        title: z.string().describe('Message title'),
        body: z.string().describe('Message body'),
        data: z.record(z.string(), z.any()).optional().describe('Key-value data to include'),
        method: z.enum(['all', 'single']).default('all').describe('Routing method'),
        channels: z.array(z.string()).optional().describe('Channel names to route through. Omit to use default routing.'),
      },
      async ({ list_id, title, body, data, method, channels }) => {
        return handleToolCall(() => {
          const message: Record<string, any> = {
            to: { list_id },
            content: { title, body },
          };
          if (data) message.data = data;
          if (channels && channels.length > 0) {
            message.routing = { method, channels };
          }
          return this.mcp.courier.send.message({ message });
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      SendTools.tools[3],
      'Send a message to all subscribers of a list using a notification template.',
      {
        list_id: z.string().describe('The list ID to send to'),
        template: z.string().describe('Template ID or notification slug'),
        data: z.record(z.string(), z.any()).optional().describe('Key-value data for template variables'),
        method: z.enum(['all', 'single']).default('all').optional().describe('Routing method'),
        channels: z.array(z.string()).optional().describe('Channel names to route through. Omit to use template routing config.'),
      },
      async ({ list_id, template, data, method, channels }) => {
        return handleToolCall(() => {
          const message: Record<string, any> = {
            to: { list_id },
            template,
          };
          if (data) message.data = data;
          if (channels && channels.length > 0) {
            message.routing = { method: method || 'all', channels };
          }
          return this.mcp.courier.send.message({ message });
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );
  }
}
