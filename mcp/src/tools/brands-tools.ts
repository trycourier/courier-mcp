import z from "zod";
import { CourierMcpTools } from "./tools.js";

export class BrandsTools extends CourierMcpTools {

  public register() {
    // Create a brand
    this.mcp.tool(
      'create_brand',
      'Create a new brand.',
      {
        id: z.string().optional(),
        name: z.string(),
        settings: z.object({
          colors: z.record(z.any()).optional(),
          inapp: z.record(z.any()).optional(),
          email: z.record(z.any()).optional(),
        }).optional(),
        snippets: z.record(z.any()).optional(),
      },
      async ({ id, name, settings, snippets }) => {
        const request: any = { id, name, settings, snippets };
        if (id === undefined) delete request.id;
        if (settings === undefined) delete request.settings;
        if (snippets === undefined) delete request.snippets;

        return await this.mcp.client.brands.create(request);
      }
    );

    // Get a brand by ID
    this.mcp.tool(
      'get_brand',
      'Fetch a specific brand by brand ID.',
      {
        brand_id: z.string(),
      },
      async ({ brand_id }) => {
        return await this.mcp.client.brands.get(brand_id);
      }
    );

    // List brands
    this.mcp.tool(
      'list_brands',
      'Get the list of brands.',
      {
        cursor: z.string().optional(),
        limit: z.number().optional(),
      },
      async ({ cursor, limit }) => {
        const request: any = {};
        if (cursor !== undefined) request.cursor = cursor;
        if (limit !== undefined) request.limit = limit;

        return await this.mcp.client.brands.list(request);
      }
    );
  }
}
