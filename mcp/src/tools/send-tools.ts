import z from "zod";
import { CourierMcpTools } from "./tools.js";

/**
 * Tool class for sending a message using CourierMcpServer.
 * This class can be instantiated with a CourierMcpServer instance and exposes a `run` method.
 */
export class SendTools extends CourierMcpTools {

  public register() {

    // Send a message to a user with Courier using title/body (no template)
    this.mcp.tool(
      'send_message',
      'Send a message to a user with Courier using title and body (no template)',
      {
        user_id: z.string(),
        title: z.string(),
        body: z.string(),
        data: z.record(z.string(), z.string()).optional(),
        method: z.enum(['all', 'single']).default('all'),
        channels: z.array(z.string()),
      },
      async ({ user_id, title, body, data, method, channels }) => {
        if (!title || !body) {
          throw new Error('Both title and body must be provided.');
        }

        let request: any = {
          message: {
            to: {
              user_id: user_id,
            },
            data: data,
            routing: {
              method: method,
              channels: channels
            },
            content: {
              title: title,
              body: body,
            }
          },
        };

        return await this.mcp.client.send.send(request);
      }
    );

    // Send a message to a user with Courier using a template
    this.mcp.tool(
      'send_message_template',
      'Send a message to a user with Courier using a template',
      {
        user_id: z.string(),
        template: z.string(),
        data: z.record(z.string(), z.string()).optional(),
      },
      async ({ user_id, template, data }) => {
        if (!template) {
          throw new Error('Template must be provided.');
        }

        let request: any = {
          message: {
            to: {
              user_id: user_id,
            },
            data: data,
            template: template
          },
        };

        return await this.mcp.client.send.send(request);
      }
    );

    // Send a message to a user with Courier using title/body (no template)
    this.mcp.tool(
      'send_message_to_list',
      'Send a message to a list with Courier using title and body (no template)',
      {
        list_id: z.string(),
        title: z.string(),
        body: z.string(),
        data: z.record(z.string(), z.string()).optional(),
        method: z.enum(['all', 'single']).default('all'),
        channels: z.array(z.string()),
      },
      async ({ list_id, title, body, data, method, channels }) => {
        if (!title || !body) {
          throw new Error('Both title and body must be provided.');
        }

        let request: any = {
          message: {
            to: {
              list_id: list_id,
            },
            data: data,
            routing: {
              method: method,
              channels: channels
            },
            content: {
              title: title,
              body: body,
            }
          },
        };

        return await this.mcp.client.send.send(request);
      }
    );

    // Send a message to a user with Courier using title/body (no template)
    this.mcp.tool(
      'send_message_to_list_template',
      'Send a message to a list with Courier using a template',
      {
        list_id: z.string(),
        template: z.string(),
        data: z.record(z.string(), z.string()).optional(),
        method: z.enum(['all', 'single']).default('all'),
        channels: z.array(z.string()),
      },
      async ({ list_id, template, data, method, channels }) => {
        if (!template) {
          throw new Error('Template must be provided.');
        }

        let request: any = {
          message: {
            to: {
              list_id: list_id,
            },
            data: data,
            template: template
          },
        };

        return await this.mcp.client.send.send(request);
      }
    );

  }
}
