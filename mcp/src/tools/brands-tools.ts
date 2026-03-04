import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class BrandsTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'create_brand',
    'get_brand',
    'list_brands',
  ];

  public register() {

    this.registerToolIfNeeded(
      BrandsTools.tools[0],
      'Create a new brand with name, colors, and email/inapp settings.',
      {
        name: z.string().describe('Brand display name'),
        id: z.string().optional().describe('Optional brand ID; auto-generated if omitted'),
        settings: z.object({
          colors: z.record(z.any()).optional(),
          inapp: z.record(z.any()).optional(),
          email: z.record(z.any()).optional(),
        }).optional().describe('Brand settings (colors, email, inapp)'),
        snippets: z.record(z.any()).optional().describe('Brand snippets'),
      },
      async ({ name, id, settings, snippets }) => {
        return handleToolCall(() => {
          const body: any = { name };
          if (id) body.id = id;
          if (settings) body.settings = settings;
          if (snippets) body.snippets = snippets;
          return this.mcp.courier.brands.create(body);
        });
      }
    );

    this.registerToolIfNeeded(
      BrandsTools.tools[1],
      'Get a brand by its ID.',
      {
        brand_id: z.string().describe('The brand ID'),
      },
      async ({ brand_id }) => {
        return handleToolCall(() => this.mcp.courier.brands.retrieve(brand_id));
      }
    );

    this.registerToolIfNeeded(
      BrandsTools.tools[2],
      'List all brands in the workspace.',
      {
        cursor: z.string().optional().describe('Pagination cursor'),
      },
      async ({ cursor }) => {
        return handleToolCall(() => this.mcp.courier.brands.list(cursor ? { cursor } : {}));
      }
    );
  }
}
