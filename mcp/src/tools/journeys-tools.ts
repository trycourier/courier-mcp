import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class JourneysTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'list_journeys',
    'invoke_journey',
    'create_journey',
    'get_journey',
    'replace_journey',
    'publish_journey',
    'archive_journey',
    'list_journey_versions',
    'list_journey_templates',
    'create_journey_template',
    'get_journey_template',
    'replace_journey_template',
    'archive_journey_template',
    'publish_journey_template',
    'list_journey_template_versions',
  ];

  public register() {

    this.registerToolIfNeeded(
      JourneysTools.tools[0],
      'List journey templates in the workspace. Call this first to discover journey IDs before calling invoke_journey, get_journey, or replace_journey. Optionally filter by version (published or draft).',
      {
        cursor: z.string().optional().describe('Pagination cursor'),
        version: z.enum(['published', 'draft']).optional().describe('Filter by version state. Defaults to published.'),
      },
      async ({ cursor, version }) => {
        return handleToolCall(() => {
          const query: Record<string, any> = {};
          if (cursor) query.cursor = cursor;
          if (version) query.version = version;
          return this.mcp.courier.journeys.list(query);
        });
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      JourneysTools.tools[1],
      'Invoke a journey run from a journey template. Call list_journeys first to find the template_id. Example: { template_id: "j-onboarding", user_id: "user-123", data: { plan: "pro" } }.',
      {
        template_id: z.string().describe('The journey template ID'),
        user_id: z.string().optional().describe('Recipient user ID. Can also be resolved from profile or data.'),
        data: z.record(z.any()).optional().describe('Data payload passed to the journey for conditions and template variables'),
        profile: z.record(z.any()).optional().describe('Profile data for the user (email, phone, custom fields)'),
      },
      async ({ template_id, user_id, data, profile }) => {
        return handleToolCall(() => {
          const body: Record<string, any> = {};
          if (user_id) body.user_id = user_id;
          if (data) body.data = data;
          if (profile) body.profile = profile;
          return this.mcp.courier.journeys.invoke(template_id, body);
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      JourneysTools.tools[2],
      'Create a new journey. Defaults to DRAFT state. Send nodes are not allowed on create — create the shell with a trigger node, then call replace_journey to add send nodes after linking notification templates. Call publish_journey to make it live. Node ids are server-generated; do NOT include an id field. Example: { name: "Welcome Journey", nodes: [{ type: "trigger", trigger_type: "api-invoke" }], enabled: true }.',
      {
        name: z.string().describe('Journey display name'),
        nodes: z.array(z.record(z.any())).describe('Array of journey node objects. Node ids are server-generated — do NOT include an id field. Trigger node example: { type: "trigger", trigger_type: "api-invoke" }. Send node example: { type: "send", template: "nt_abc" }. Delay node example: { type: "delay", mode: "duration", duration: "PT1H" }.'),
        enabled: z.boolean().optional().describe('Whether the journey is active. Defaults to true.'),
        state: z.enum(['DRAFT', 'PUBLISHED']).optional().describe('Create as DRAFT (default) or PUBLISHED immediately.'),
      },
      async ({ name, nodes, enabled, state }) => {
        return handleToolCall(() => {
          const body: Record<string, any> = { name, nodes };
          if (enabled !== undefined) body.enabled = enabled;
          if (state !== undefined) body.state = state;
          return this.mcp.courier.journeys.create(body as any);
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      JourneysTools.tools[3],
      'Get a journey by ID. Pass version=draft to retrieve the working draft, or version=vN for a historical version. Defaults to published.',
      {
        journey_id: z.string().describe('The journey template ID'),
        version: z.string().optional().describe('Version to retrieve: "draft", "published" (default), or a version string like "v001"'),
      },
      async ({ journey_id, version }) => {
        return handleToolCall(() =>
          this.mcp.courier.journeys.retrieve(journey_id, version ? { version } : undefined)
        );
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      JourneysTools.tools[4],
      'Replace (update) a journey draft. Full document replacement — include all nodes and properties in the body. Call publish_journey afterwards to make changes live, or pass state: "PUBLISHED" to publish immediately. Send node template IDs must already be scoped to this journey.',
      {
        journey_id: z.string().describe('The journey template ID to update'),
        name: z.string().describe('Journey display name'),
        nodes: z.array(z.record(z.any())).describe('Complete array of journey nodes. Use server-assigned node ids from get_journey — do NOT invent new ids. Each node requires type plus type-specific fields.'),
        enabled: z.boolean().optional().describe('Whether the journey is active.'),
        state: z.enum(['DRAFT', 'PUBLISHED']).optional().describe('Set to PUBLISHED to publish immediately after replace.'),
      },
      async ({ journey_id, name, nodes, enabled, state }) => {
        return handleToolCall(() => {
          const body: Record<string, any> = { name, nodes };
          if (enabled !== undefined) body.enabled = enabled;
          if (state !== undefined) body.state = state;
          return this.mcp.courier.journeys.replace(journey_id, body as any);
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      JourneysTools.tools[5],
      'Publish the current draft of a journey, making it live and invokable. Pass version to roll back to a prior published version instead of publishing the draft. Returns 404 if there is no draft to publish.',
      {
        journey_id: z.string().describe('The journey template ID to publish'),
        version: z.string().optional().describe('Historical version to roll back to (e.g. "v001"). Omit to publish the current draft.'),
      },
      async ({ journey_id, version }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.journeys.publish(journey_id, version ? { version } : undefined);
          return { success: true, message: `Journey ${journey_id} published` };
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      JourneysTools.tools[6],
      'Archive a journey. Archived journeys cannot be invoked but existing runs continue to completion.',
      {
        journey_id: z.string().describe('The journey template ID to archive'),
      },
      async ({ journey_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.journeys.archive(journey_id);
          return { success: true, message: `Journey ${journey_id} archived` };
        });
      },
      { destructiveHint: true, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      JourneysTools.tools[7],
      'List published versions of a journey, ordered most recent first.',
      {
        journey_id: z.string().describe('The journey template ID'),
      },
      async ({ journey_id }) => {
        return handleToolCall(() => this.mcp.courier.journeys.listVersions(journey_id));
      },
      { readOnlyHint: true }
    );

    // --- Journey template sub-resource tools ---

    this.registerToolIfNeeded(
      JourneysTools.tools[8],
      'List notification templates scoped to a journey. Journey-scoped templates can only be used by send nodes within the same journey. Call this to discover template IDs before wiring send nodes in replace_journey.',
      {
        journey_id: z.string().describe('The journey template ID'),
        cursor: z.string().optional().describe('Pagination cursor'),
        limit: z.number().optional().describe('Page size (1–100)'),
      },
      async ({ journey_id, cursor, limit }) => {
        return handleToolCall(() => {
          const query: Record<string, any> = {};
          if (cursor) query.cursor = cursor;
          if (limit) query.limit = limit;
          return this.mcp.courier.journeys.templates.list(journey_id, query);
        });
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      JourneysTools.tools[9],
      'Create a notification template scoped to a journey. Defaults to DRAFT; pass state: "PUBLISHED" to publish on create. The template can then be referenced in journey send nodes. Example: { journey_id: "j-abc", channel: "email", notification: { name: "Welcome Email", tags: [], brand: null, subscription: null, content: { version: "2022-01-01", elements: [{ type: "text", content: "Hello!" }] } } }.',
      {
        journey_id: z.string().describe('The journey template ID'),
        channel: z.string().describe('Channel for this template (e.g. "email", "push", "sms", "inbox")'),
        notification: z.object({
          name: z.string().describe('Template display name'),
          tags: z.array(z.string()).describe('Tag list (use [] if none)'),
          brand: z.object({ id: z.string() }).nullable().describe('Brand to apply, or null'),
          subscription: z.object({ topic_id: z.string() }).nullable().describe('Subscription topic, or null'),
          content: z.object({
            version: z.literal('2022-01-01'),
            elements: z.array(z.record(z.any())).describe('Elemental content nodes'),
            scope: z.enum(['default', 'strict']).optional(),
          }),
        }).describe('Notification template definition'),
        provider_key: z.string().optional().describe('Specific provider key to target'),
        state: z.string().optional().describe('Initial state: "DRAFT" (default) or "PUBLISHED"'),
      },
      async ({ journey_id, channel, notification, provider_key, state }) => {
        return handleToolCall(() => {
          const body: Record<string, any> = { channel, notification };
          if (provider_key) body.providerKey = provider_key;
          if (state) body.state = state;
          return this.mcp.courier.journeys.templates.create(journey_id, body as any);
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      JourneysTools.tools[10],
      'Get a journey-scoped notification template by notification ID. Pass version=draft to retrieve the working draft (required before the template has been published). Defaults to published.',
      {
        notification_id: z.string().describe('The notification template ID'),
        journey_id: z.string().describe('The journey template ID that owns this notification'),
        version: z.string().optional().describe('Version to retrieve: "draft", "published" (default), or "vN"'),
      },
      async ({ notification_id, journey_id, version }) => {
        return handleToolCall(() =>
          this.mcp.courier.journeys.templates.retrieve(
            notification_id,
            { templateId: journey_id },
            version ? ({ query: { version } } as any) : undefined
          )
        );
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      JourneysTools.tools[11],
      'Replace the draft of a journey-scoped notification template. Full document replacement. Call publish_journey_template afterwards to make it live.',
      {
        notification_id: z.string().describe('The notification template ID'),
        journey_id: z.string().describe('The journey template ID that owns this notification'),
        notification: z.object({
          name: z.string(),
          tags: z.array(z.string()),
          brand: z.object({ id: z.string() }).nullable(),
          subscription: z.object({ topic_id: z.string() }).nullable(),
          content: z.object({
            version: z.literal('2022-01-01'),
            elements: z.array(z.record(z.any())),
            scope: z.enum(['default', 'strict']).optional(),
          }),
        }).describe('Full notification template definition'),
        state: z.string().optional().describe('"PUBLISHED" to publish immediately after replace'),
      },
      async ({ notification_id, journey_id, notification, state }) => {
        return handleToolCall(() =>
          this.mcp.courier.journeys.templates.replace(notification_id, {
            templateId: journey_id,
            notification,
            ...(state ? { state } : {}),
          } as any)
        );
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      JourneysTools.tools[12],
      'Archive a journey-scoped notification template. Archived templates cannot be sent.',
      {
        notification_id: z.string().describe('The notification template ID'),
        journey_id: z.string().describe('The journey template ID that owns this notification'),
      },
      async ({ notification_id, journey_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.journeys.templates.archive(notification_id, { templateId: journey_id });
          return { success: true, message: `Journey template ${notification_id} archived` };
        });
      },
      { destructiveHint: true, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      JourneysTools.tools[13],
      'Publish the current draft of a journey-scoped notification template. Optionally pass version to roll back to a prior version.',
      {
        notification_id: z.string().describe('The notification template ID'),
        journey_id: z.string().describe('The journey template ID that owns this notification'),
        version: z.string().optional().describe('Version to roll back to (e.g. "v1"). Omit to publish current draft.'),
      },
      async ({ notification_id, journey_id, version }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.journeys.templates.publish(notification_id, {
            templateId: journey_id,
            ...(version ? { version } : {}),
          });
          return { success: true, message: `Journey template ${notification_id} published` };
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      JourneysTools.tools[14],
      'List published versions of a journey-scoped notification template, ordered most recent first.',
      {
        notification_id: z.string().describe('The notification template ID'),
        journey_id: z.string().describe('The journey template ID that owns this notification'),
      },
      async ({ notification_id, journey_id }) => {
        return handleToolCall(() =>
          this.mcp.courier.journeys.templates.listVersions(notification_id, { templateId: journey_id })
        );
      },
      { readOnlyHint: true }
    );
  }
}
