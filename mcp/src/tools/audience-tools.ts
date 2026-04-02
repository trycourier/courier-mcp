import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class AudienceTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'get_audience',
    'list_audience_members',
    'list_audiences',
    'update_audience',
    'delete_audience',
  ];

  public register() {

    this.registerToolIfNeeded(
      AudienceTools.tools[0],
      'Get an audience by its ID, including its filter definition.',
      {
        audience_id: z.string().describe('The audience ID'),
      },
      async ({ audience_id }) => {
        return handleToolCall(() => this.mcp.courier.audiences.retrieve(audience_id));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      AudienceTools.tools[1],
      'List all members of an audience.',
      {
        audience_id: z.string().describe('The audience ID'),
        cursor: z.string().optional().describe('Pagination cursor'),
      },
      async ({ audience_id, cursor }) => {
        return handleToolCall(() => this.mcp.courier.audiences.listMembers(audience_id, cursor ? { cursor } : {}));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      AudienceTools.tools[2],
      'List all audiences in the workspace.',
      {
        cursor: z.string().optional().describe('Pagination cursor'),
      },
      async ({ cursor }) => {
        return handleToolCall(() => this.mcp.courier.audiences.list(cursor ? { cursor } : {}));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      AudienceTools.tools[3],
      'Create or update an audience with a filter definition.',
      {
        audience_id: z.string().describe('The audience ID'),
        name: z.string().optional().describe('Display name'),
        description: z.string().optional().describe('Description'),
        filter: z.any().optional().describe('Filter definition object (operator, rules)'),
      },
      async ({ audience_id, name, description, filter }) => {
        return handleToolCall(() => {
          const body: Record<string, any> = {};
          if (name !== undefined) body.name = name;
          if (description !== undefined) body.description = description;
          if (filter !== undefined) body.filter = filter;
          return this.mcp.courier.audiences.update(audience_id, body);
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      AudienceTools.tools[4],
      'Delete an audience by its ID.',
      {
        audience_id: z.string().describe('The audience ID to delete'),
      },
      async ({ audience_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.audiences.delete(audience_id);
          return { success: true, message: `Audience ${audience_id} deleted` };
        });
      },
      { destructiveHint: true, idempotentHint: true }
    );
  }
}
