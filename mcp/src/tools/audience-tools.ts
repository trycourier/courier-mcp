import z from "zod";
import { CourierMcpTools } from "./tools.js";

export class AudienceTools extends CourierMcpTools {

  public register() {
    // Get an audience by audience_id
    this.mcp.tool(
      'get_audience',
      'Get an audience by its ID',
      {
        audience_id: z.string(),
      },
      async ({ audience_id }) => {
        return await this.mcp.client.audiences.get(audience_id);
      }
    );

    // // Create or update an audience
    // this.mcp.tool(
    //   'update_audience',
    //   'Create or update an audience by its ID',
    //   {
    //     audience_id: z.string(),
    //     name: z.string().optional(),
    //     description: z.string().optional(),
    //     filter: z.any().optional(),
    //   },
    //   async ({ audience_id, name, description, filter }) => {
    //     const request: any = {};
    //     if (name !== undefined) request.name = name;
    //     if (description !== undefined) request.description = description;
    //     if (filter !== undefined) request.filter = filter;
    //     return await this.mcp.client.audiences.update(audience_id, request);
    //   }
    // );

    // // Delete an audience by audience_id
    // this.mcp.tool(
    //   'delete_audience',
    //   'Delete an audience by its ID',
    //   {
    //     audience_id: z.string(),
    //   },
    //   async ({ audience_id }) => {
    //     return await this.mcp.client.audiences.delete(audience_id);
    //   }
    // );

    // List members of an audience
    this.mcp.tool(
      'list_audience_members',
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
    this.mcp.tool(
      'list_audiences',
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