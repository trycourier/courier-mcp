import z from "zod";
import { CourierMcpTools } from "./tools.js";

export class AudienceTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'get_audience',
    'list_audience_members',
    'list_audiences',
  ];

  public register() {

    // Get an audience by audience_id
    this.registerToolIfNeeded(
      AudienceTools.tools[0],
      'Get an audience by its ID',
      {
        audience_id: z.string(),
      },
      async ({ audience_id }) => {
        return await this.mcp.client.audiences.get(audience_id);
      }
    );

    // List members of an audience
    this.registerToolIfNeeded(
      AudienceTools.tools[1],
      'List members of an audience by its ID',
      {
        audience_id: z.string(),
        cursor: z.string().optional(),
        limit: z.number().optional(),
      },
      async ({ audience_id, cursor, limit }) => {
        const request: any = {};
        if (cursor !== undefined) request.cursor = cursor;
        if (limit !== undefined) request.limit = limit;
        return await this.mcp.client.audiences.listMembers(audience_id, request);
      }
    );

    // List all audiences
    this.registerToolIfNeeded(
      AudienceTools.tools[2],
      'List all audiences associated with the authorization token',
      {
        cursor: z.string().optional(),
        limit: z.number().optional(),
      },
      async ({ cursor, limit }) => {
        const request: any = {};
        if (cursor !== undefined) request.cursor = cursor;
        if (limit !== undefined) request.limit = limit;
        return await this.mcp.client.audiences.listAudiences(request);
      }
    );
  }
}