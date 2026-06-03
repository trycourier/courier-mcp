import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class TenantsTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'get_tenant',
    'create_or_update_tenant',
    'list_tenants',
    'delete_tenant',
    'list_tenant_users',
    'update_tenant_preference',
    'delete_tenant_preference',
    'list_tenant_templates',
    'get_tenant_template',
    'replace_tenant_template',
    'publish_tenant_template',
    'get_tenant_template_version',
  ];

  private static readonly channelClassification = z.enum([
    'direct_message',
    'email',
    'push',
    'sms',
    'webhook',
    'inbox',
  ]);

  public register() {

    this.registerToolIfNeeded(
      TenantsTools.tools[0],
      'Get a tenant by its ID.',
      {
        tenant_id: z.string().describe('The tenant ID'),
      },
      async ({ tenant_id }) => {
        return handleToolCall(() => this.mcp.courier.tenants.retrieve(tenant_id));
      },
      { readOnlyHint: true }
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
      },
      { readOnlyHint: false, idempotentHint: true }
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
      },
      { readOnlyHint: true }
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
      },
      { destructiveHint: true, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      TenantsTools.tools[4],
      'List users associated with a tenant.',
      {
        tenant_id: z.string().describe('The tenant ID'),
        cursor: z.string().optional().describe('Pagination cursor'),
        limit: z.number().optional().describe('Max results per page (default 20, max 100)'),
      },
      async ({ tenant_id, cursor, limit }) => {
        return handleToolCall(() => {
          const query: Record<string, unknown> = {};
          if (cursor) query.cursor = cursor;
          if (limit != null) query.limit = limit;
          return this.mcp.courier.tenants.listUsers(tenant_id, query);
        });
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      TenantsTools.tools[5],
      'Set the default notification preference for a subscription topic on a tenant. This controls tenant-level defaults — it does NOT set per-user preferences (use the user preferences API for that). The topic_id must already exist as a subscription topic in the workspace; a 404 means the topic has not been created yet. Example: { tenant_id: "acme", topic_id: "marketing-updates", status: "OPTED_IN", has_custom_routing: true, custom_routing: ["email", "push"] }.',
      {
        tenant_id: z.string().describe('The tenant ID'),
        topic_id: z.string().describe('The subscription topic ID — must already exist in the workspace. A 404 response means the topic does not exist; create it in the Preferences Editor first.'),
        status: z.enum(['OPTED_IN', 'OPTED_OUT', 'REQUIRED']).describe('Subscription status for the topic'),
        custom_routing: z
          .array(TenantsTools.channelClassification)
          .optional()
          .describe('Default channels when has_custom_routing is enabled'),
        has_custom_routing: z
          .boolean()
          .optional()
          .describe('When true, use custom_routing instead of template defaults'),
      },
      async ({ tenant_id, topic_id, status, custom_routing, has_custom_routing }) => {
        return handleToolCall(() => {
          const body: {
            tenant_id: string;
            status: 'OPTED_IN' | 'OPTED_OUT' | 'REQUIRED';
            custom_routing?: Array<
              'direct_message' | 'email' | 'push' | 'sms' | 'webhook' | 'inbox'
            > | null;
            has_custom_routing?: boolean | null;
          } = { tenant_id, status };
          if (custom_routing !== undefined) body.custom_routing = custom_routing;
          if (has_custom_routing !== undefined) body.has_custom_routing = has_custom_routing;
          return this.mcp.courier.tenants.preferences.items.update(topic_id, body);
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      TenantsTools.tools[6],
      'Remove default notification preference for a topic from a tenant.',
      {
        tenant_id: z.string().describe('The tenant ID'),
        topic_id: z.string().describe('The subscription topic ID'),
      },
      async ({ tenant_id, topic_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.tenants.preferences.items.delete(topic_id, { tenant_id });
          return { success: true, message: `Removed preference for topic ${topic_id} on tenant ${tenant_id}` };
        });
      },
      { destructiveHint: true, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      TenantsTools.tools[7],
      'List notification templates configured for a tenant.',
      {
        tenant_id: z.string().describe('The tenant ID'),
        cursor: z.string().optional().describe('Pagination cursor'),
        limit: z.number().optional().describe('Max results per page (default 20, max 100)'),
      },
      async ({ tenant_id, cursor, limit }) => {
        return handleToolCall(() => {
          const query: Record<string, unknown> = {};
          if (cursor) query.cursor = cursor;
          if (limit != null) query.limit = limit;
          return this.mcp.courier.tenants.templates.list(tenant_id, query);
        });
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      TenantsTools.tools[8],
      'Get a tenant notification template association by template ID.',
      {
        tenant_id: z.string().describe('The tenant ID'),
        template_id: z.string().describe('The template ID'),
      },
      async ({ tenant_id, template_id }) => {
        return handleToolCall(() =>
          this.mcp.courier.tenants.templates.retrieve(template_id, { tenant_id })
        );
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      TenantsTools.tools[9],
      'Create or replace a tenant notification template (draft unless published is true).',
      {
        tenant_id: z.string().describe('The tenant ID'),
        template_id: z.string().describe('The template ID'),
        title: z.string().optional().describe('Optional title merged into template content when provided'),
        content: z
          .any()
          .describe('Elemental content object (e.g. elements and version per Courier Elemental schema)'),
        channels: z.any().optional().describe('Channel-specific delivery configuration'),
        providers: z.any().optional().describe('Provider-specific routing configuration'),
        routing: z.any().optional().describe('Message routing configuration'),
        published: z
          .boolean()
          .optional()
          .describe('When true, publish immediately after save'),
      },
      async ({ tenant_id, template_id, title, content, channels, providers, routing, published }) => {
        return handleToolCall(() => {
          const templateContent =
            title !== undefined ? { ...(content as Record<string, unknown>), title } : content;
          const template: any = { content: templateContent };
          if (channels !== undefined) template.channels = channels;
          if (providers !== undefined) template.providers = providers;
          if (routing !== undefined) template.routing = routing;
          const params: any = { tenant_id, template };
          if (published !== undefined) params.published = published;
          return this.mcp.courier.tenants.templates.replace(template_id, params);
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      TenantsTools.tools[10],
      'Publish a version of a tenant notification template.',
      {
        tenant_id: z.string().describe('The tenant ID'),
        template_id: z.string().describe('The template ID'),
        version: z
          .string()
          .optional()
          .describe('Version to publish (e.g. v1, latest); defaults to latest if omitted'),
      },
      async ({ tenant_id, template_id, version }) => {
        return handleToolCall(() => {
          const params: { tenant_id: string; version?: string } = { tenant_id };
          if (version !== undefined) params.version = version;
          return this.mcp.courier.tenants.templates.publish(template_id, params);
        });
      },
      { readOnlyHint: false }
    );

    this.registerToolIfNeeded(
      TenantsTools.tools[11],
      'Get a specific version of a tenant notification template (e.g. latest, published, or v1).',
      {
        tenant_id: z.string().describe('The tenant ID'),
        template_id: z.string().describe('The template ID'),
        version: z.string().describe('Version identifier (latest, published, or v-prefixed)'),
      },
      async ({ tenant_id, template_id, version }) => {
        return handleToolCall(() =>
          this.mcp.courier.tenants.templates.versions.retrieve(version, {
            tenant_id,
            template_id,
          })
        );
      },
      { readOnlyHint: true }
    );
  }
}
