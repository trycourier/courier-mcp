import z from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";

/**
 * Tool class for sending a message using CourierMcpServer.
 * This class can be instantiated with a CourierMcpServer instance and exposes a `run` method.
 */
export class SendTools extends CourierMcpTools {

  public register() {

    // Send a message to a user with Courier using title/body (no template)
    this.server.tool(
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
        try {
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

          const response = await this.server.courierClient.send(request);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response, null, 2),
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(err, null, 2),
              },
            ],
          };
        }
      }
    );

    // Send a message to a user with Courier using a template
    this.server.tool(
      'send_message_template',
      'Send a message to a user with Courier using a template',
      {
        user_id: z.string(),
        template: z.string(),
        data: z.record(z.string(), z.string()).optional(),
      },
      async ({ user_id, template, data }) => {
        try {
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

          const response = await this.server.courierClient.send(request);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response, null, 2),
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(err, null, 2),
              },
            ],
          };
        }
      }
    );
  }
}
