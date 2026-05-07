import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class RequestsTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'archive_request',
  ];

  public register() {

    this.registerToolIfNeeded(
      RequestsTools.tools[0],
      'Archive a send request and all its associated messages by request ID.',
      {
        request_id: z.string().describe('The request ID (requestId returned from /send)'),
      },
      async ({ request_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.requests.archive(request_id);
          return { success: true, message: `Request ${request_id} archived` };
        });
      },
      { destructiveHint: true, idempotentHint: true }
    );
  }
}
