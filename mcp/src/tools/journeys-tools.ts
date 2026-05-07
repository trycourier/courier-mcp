import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class JourneysTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'list_journeys',
    'invoke_journey',
  ];

  public register() {

    this.registerToolIfNeeded(
      JourneysTools.tools[0],
      'List journey templates in the workspace. Optionally filter by version (published or draft).',
      {
        cursor: z.string().optional().describe('Pagination cursor'),
        version: z.enum(['published', 'draft']).optional().describe('Filter by version state. Defaults to published.'),
      },
      async ({ cursor, version }) => {
        return handleToolCall(() => {
          const query: Record<string, any> = {};
          if (cursor) query.cursor = cursor;
          if (version) query.version = version;
          return this.mcp.courier.journeys.list(query);
        });
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      JourneysTools.tools[1],
      'Invoke a journey run from a journey template. Triggers the automation workflow for the specified user.',
      {
        template_id: z.string().describe('The journey template ID'),
        user_id: z.string().optional().describe('Recipient user ID. Can also be resolved from profile or data.'),
        data: z.record(z.any()).optional().describe('Data payload passed to the journey for conditions and template variables'),
        profile: z.record(z.any()).optional().describe('Profile data for the user (email, phone, custom fields)'),
      },
      async ({ template_id, user_id, data, profile }) => {
        return handleToolCall(() => {
          const body: Record<string, any> = {};
          if (user_id) body.user_id = user_id;
          if (data) body.data = data;
          if (profile) body.profile = profile;
          return this.mcp.courier.journeys.invoke(template_id, body);
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );
  }
}
