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
        try {
          const response = await this.mcp.courierClient.audiences.get(audience_id);
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

    // // Create or update an audience
    // this.server.tool(
    //   'update_audience',
    //   'Create or update an audience by its ID',
    //   {
    //     audience_id: z.string(),
    //     name: z.string().optional(),
    //     description: z.string().optional(),
    //     filter: z.any().optional(),
    //   },
    //   async ({ audience_id, name, description, filter }) => {
    //     try {
    //       const request: any = {};
    //       if (name !== undefined) request.name = name;
    //       if (description !== undefined) request.description = description;
    //       if (filter !== undefined) request.filter = filter;
    //       const response = await this.server.courierClient.audiences.update(audience_id, request);
    //       return {
    //         content: [
    //           {
    //             type: 'text',
    //             text: JSON.stringify(response, null, 2),
    //           },
    //         ],
    //       };
    //     } catch (err: any) {
    //       return {
    //         content: [
    //           {
    //             type: 'text',
    //             text: JSON.stringify(err, null, 2),
    //           },
    //         ],
    //       };
    //     }
    //   }
    // );

    // // Delete an audience by audience_id
    // this.server.tool(
    //   'delete_audience',
    //   'Delete an audience by its ID',
    //   {
    //     audience_id: z.string(),
    //   },
    //   async ({ audience_id }) => {
    //     try {
    //       const response = await this.server.courierClient.audiences.delete(audience_id);
    //       return {
    //         content: [
    //           {
    //             type: 'text',
    //             text: JSON.stringify(response, null, 2),
    //           },
    //         ],
    //       };
    //     } catch (err: any) {
    //       return {
    //         content: [
    //           {
    //             type: 'text',
    //             text: JSON.stringify(err, null, 2),
    //           },
    //         ],
    //       };
    //     }
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
        try {
          const request: any = {};
          if (cursor !== undefined) request.cursor = cursor;
          if (limit !== undefined) request.limit = limit;
          const response = await this.mcp.courierClient.audiences.listMembers(audience_id, request);
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

    // List all audiences
    this.mcp.tool(
      'list_audiences',
      'List all audiences associated with the authorization token',
      {
        cursor: z.string().optional(),
        limit: z.number().optional(),
      },
      async ({ cursor, limit }) => {
        try {
          const request: any = {};
          if (cursor !== undefined) request.cursor = cursor;
          if (limit !== undefined) request.limit = limit;
          const response = await this.mcp.courierClient.audiences.listAudiences(request);
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