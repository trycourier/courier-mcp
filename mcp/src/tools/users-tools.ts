import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class UsersTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'get_user_preferences',
    'get_user_preference_topic',
    'update_user_preference_topic',
    'list_user_tenants',
    'add_user_to_tenant',
    'remove_user_from_tenant',
    'bulk_add_user_tenants',
    'remove_all_user_tenants',
  ];

  public register() {

    this.registerToolIfNeeded(
      UsersTools.tools[0],
      "Get a user's notification preferences (subscriptions, opt-outs, channel preferences).",
      {
        user_id: z.string().describe('The user ID'),
        tenant_id: z.string().optional().describe('Scope preferences to a specific tenant'),
      },
      async ({ user_id, tenant_id }) => {
        return handleToolCall(() =>
          this.mcp.courier.users.preferences.retrieve(user_id, tenant_id ? { tenant_id } : {})
        );
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      UsersTools.tools[1],
      "Get a user's preference for a specific subscription topic.",
      {
        user_id: z.string().describe('The user ID'),
        topic_id: z.string().describe('The subscription topic ID'),
        tenant_id: z.string().optional().describe('Scope to a specific tenant'),
      },
      async ({ user_id, topic_id, tenant_id }) => {
        return handleToolCall(() => {
          const params: Record<string, any> = { user_id };
          if (tenant_id) params.tenant_id = tenant_id;
          return this.mcp.courier.users.preferences.retrieveTopic(topic_id, params as any);
        });
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      UsersTools.tools[2],
      "Update a user's preference for a specific subscription topic (opt in, opt out, or set channel preferences).",
      {
        user_id: z.string().describe('The user ID'),
        topic_id: z.string().describe('The subscription topic ID'),
        status: z.enum(['OPTED_IN', 'OPTED_OUT', 'REQUIRED']).describe('Preference status'),
        has_custom_routing: z.boolean().optional().describe('Whether custom channel routing is set'),
        custom_routing: z.array(z.string()).optional().describe('Custom channel routing order'),
      },
      async ({ user_id, topic_id, status, has_custom_routing, custom_routing }) => {
        return handleToolCall(() => {
          const topic: Record<string, any> = { status };
          if (has_custom_routing !== undefined) topic.has_custom_routing = has_custom_routing;
          if (custom_routing) topic.custom_routing = custom_routing;
          return this.mcp.courier.users.preferences.updateOrCreateTopic(topic_id, {
            user_id,
            topic,
          } as any);
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      UsersTools.tools[3],
      "List all tenants a user belongs to.",
      {
        user_id: z.string().describe('The user ID'),
        cursor: z.string().optional().describe('Pagination cursor'),
        limit: z.number().optional().describe('Max results per page'),
      },
      async ({ user_id, cursor, limit }) => {
        return handleToolCall(() => {
          const query: Record<string, any> = {};
          if (cursor) query.cursor = cursor;
          if (limit) query.limit = limit;
          return this.mcp.courier.users.tenants.list(user_id, query);
        });
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      UsersTools.tools[4],
      'Add a user to a tenant.',
      {
        user_id: z.string().describe('The user ID'),
        tenant_id: z.string().describe('The tenant ID'),
        profile: z.record(z.any()).optional().describe('Tenant-scoped profile overrides'),
      },
      async ({ user_id, tenant_id, profile }) => {
        return handleToolCall(async () => {
          const params: any = { user_id };
          if (profile) params.profile = profile;
          await this.mcp.courier.users.tenants.addSingle(tenant_id, params);
          return { success: true, user_id, tenant_id };
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      UsersTools.tools[5],
      'Remove a user from a tenant.',
      {
        user_id: z.string().describe('The user ID'),
        tenant_id: z.string().describe('The tenant ID'),
      },
      async ({ user_id, tenant_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.users.tenants.removeSingle(tenant_id, { user_id });
          return { success: true, message: `User ${user_id} removed from tenant ${tenant_id}` };
        });
      },
      { destructiveHint: true, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      UsersTools.tools[6],
      'Add a user to multiple tenants at once. A custom profile can be supplied per tenant.',
      {
        user_id: z.string().describe('The user ID'),
        tenants: z.array(z.object({
          tenant_id: z.string().describe('Tenant ID'),
          profile: z.record(z.any()).optional().describe('Tenant-scoped profile overrides'),
        })).describe('Array of tenant associations'),
      },
      async ({ user_id, tenants }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.users.tenants.addMultiple(user_id, { tenants } as any);
          return { success: true, message: `User ${user_id} added to ${tenants.length} tenants` };
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      UsersTools.tools[7],
      'Remove a user from all tenants.',
      {
        user_id: z.string().describe('The user ID'),
      },
      async ({ user_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.users.tenants.removeAll(user_id);
          return { success: true, message: `User ${user_id} removed from all tenants` };
        });
      },
      { destructiveHint: true, idempotentHint: true }
    );
  }
}
