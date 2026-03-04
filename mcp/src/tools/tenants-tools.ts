import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class TenantsTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'get_tenant',
    'create_or_update_tenant',
    'list_tenants',
    'delete_tenant',
  ];

  public register() {

    this.registerToolIfNeeded(
      TenantsTools.tools[0],
      'Get a tenant by its ID.',
      {
        tenant_id: z.string().describe('The tenant ID'),
      },
      async ({ tenant_id }) => {
        return handleToolCall(() => this.mcp.courier.tenants.retrieve(tenant_id));
      }
    );

    this.registerToolIfNeeded(
      TenantsTools.tools[1],
      'Create or replace a tenant. Tenants represent organizations or groups that users belong to.',
      {
        tenant_id: z.string().describe('The tenant ID'),
        name: z.string().describe('Display name for the tenant'),
        parent_tenant_id: z.string().optional().describe('Parent tenant ID for hierarchical tenants'),
        default_preferences: z.any().optional().describe('Default notification preferences for users in this tenant'),
        properties: z.record(z.any()).optional().describe('Custom properties for the tenant'),
        user_profile: z.record(z.any()).optional().describe('Default profile data for users in this tenant'),
        brand_id: z.string().optional().describe('Brand ID to associate with this tenant'),
      },
      async ({ tenant_id, name, parent_tenant_id, default_preferences, properties, user_profile, brand_id }) => {
        return handleToolCall(() => {
          const body: any = { name };
          if (parent_tenant_id) body.parent_tenant_id = parent_tenant_id;
          if (default_preferences) body.default_preferences = default_preferences;
          if (properties) body.properties = properties;
          if (user_profile) body.user_profile = user_profile;
          if (brand_id) body.brand_id = brand_id;
          return this.mcp.courier.tenants.update(tenant_id, body);
        });
      }
    );

    this.registerToolIfNeeded(
      TenantsTools.tools[2],
      'List all tenants in the workspace.',
      {
        cursor: z.string().optional().describe('Pagination cursor'),
        limit: z.number().optional().describe('Max results per page'),
      },
      async ({ cursor, limit }) => {
        return handleToolCall(() => {
          const query: Record<string, any> = {};
          if (cursor) query.cursor = cursor;
          if (limit) query.limit = limit;
          return this.mcp.courier.tenants.list(query);
        });
      }
    );

    this.registerToolIfNeeded(
      TenantsTools.tools[3],
      'Delete a tenant by its ID.',
      {
        tenant_id: z.string().describe('The tenant ID to delete'),
      },
      async ({ tenant_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.tenants.delete(tenant_id);
          return { success: true, message: `Tenant ${tenant_id} deleted` };
        });
      }
    );
  }
}
