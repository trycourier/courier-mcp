import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class BrandsTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'create_brand',
    'get_brand',
    'list_brands',
    'update_brand',
    'delete_brand',
  ];

  public register() {

    this.registerToolIfNeeded(
      BrandsTools.tools[0],
      'Create a new brand. The API requires settings — omitting it returns a 400. If you do not have specific brand colors, omit settings and a safe default will be used automatically (black primary, white secondary). Example: { name: "Acme", settings: { colors: { primary: "#1a73e8", secondary: "#ffffff" } } }.',
      {
        name: z.string().describe('Brand display name'),
        id: z.string().optional().describe('Optional brand ID; auto-generated if omitted'),
        settings: z.object({
          colors: z.object({
            primary: z.string().describe('Primary brand color (hex, e.g. "#1a73e8")'),
            secondary: z.string().describe('Secondary brand color (hex, e.g. "#ffffff")'),
            tertiary: z.string().optional().describe('Tertiary brand color (hex)'),
          }).optional().describe('Brand colors'),
          inapp: z.record(z.any()).optional().describe('In-app notification settings'),
          email: z.record(z.any()).optional().describe('Email template settings (header, footer)'),
        }).optional().describe('Brand appearance settings. If omitted, defaults to { colors: { primary: "#000000", secondary: "#ffffff" } }.'),
        snippets: z.record(z.any()).optional().describe('Brand snippets'),
      },
      async ({ name, id, settings, snippets }) => {
        return handleToolCall(() => {
          const effectiveSettings = settings ?? { colors: { primary: '#000000', secondary: '#ffffff' }, inapp: {}, email: {} };
          const body: any = { name, settings: effectiveSettings };
          if (id) body.id = id;
          if (snippets) body.snippets = snippets;
          return this.mcp.courier.brands.create(body);
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      BrandsTools.tools[1],
      'Get a brand by its ID.',
      {
        brand_id: z.string().describe('The brand ID'),
      },
      async ({ brand_id }) => {
        return handleToolCall(() => this.mcp.courier.brands.retrieve(brand_id));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      BrandsTools.tools[2],
      'List all brands in the workspace.',
      {
        cursor: z.string().optional().describe('Pagination cursor'),
      },
      async ({ cursor }) => {
        return handleToolCall(() => this.mcp.courier.brands.list(cursor ? { cursor } : {}));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      BrandsTools.tools[3],
      'Replace an existing brand with new values.',
      {
        brand_id: z.string().describe('The brand ID to update'),
        name: z.string().describe('Brand display name'),
        settings: z.object({
          colors: z.record(z.any()).optional(),
          inapp: z.record(z.any()).optional(),
          email: z.record(z.any()).optional(),
        }).optional().describe('Brand settings (colors, email, inapp)'),
        snippets: z.record(z.any()).optional().describe('Brand snippets'),
      },
      async ({ brand_id, name, settings, snippets }) => {
        return handleToolCall(() => {
          const body: any = { name };
          if (settings) body.settings = settings;
          if (snippets) body.snippets = snippets;
          return this.mcp.courier.brands.update(brand_id, body);
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      BrandsTools.tools[4],
      'Delete a brand by its ID.',
      {
        brand_id: z.string().describe('The brand ID to delete'),
      },
      async ({ brand_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.brands.delete(brand_id);
          return { success: true, message: `Brand ${brand_id} deleted` };
        });
      },
      { destructiveHint: true, idempotentHint: true }
    );
  }
}
