import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

const notificationTemplatePayload = z.object({
  name: z.string(),
  tags: z.array(z.string()),
  brand: z.any().nullable(),
  subscription: z.any().nullable(),
  routing: z.any().nullable(),
  content: z.any(),
});

export class NotificationsTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'list_notifications',
    'get_notification_content',
    'get_notification_draft_content',
    'create_notification',
    'get_notification',
    'replace_notification',
    'archive_notification',
    'list_notification_versions',
    'publish_notification',
    'list_notification_checks',
    'update_notification_checks',
    'put_notification_content',
    'put_notification_element',
    'put_notification_locale',
    'cancel_notification_submission',
  ];

  public register() {

    this.registerToolIfNeeded(
      NotificationsTools.tools[0],
      "List notification templates. Optionally filter by cursor.",
      {
        cursor: z.string().optional().describe('Pagination cursor'),
      },
      async ({ cursor }) => {
        return handleToolCall(() => this.mcp.courier.notifications.list(cursor ? { cursor } : {}));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      NotificationsTools.tools[1],
      "Get the published content blocks of a notification template.",
      {
        notification_id: z.string().describe('The notification template ID'),
      },
      async ({ notification_id }) => {
        return handleToolCall(() => this.mcp.courier.notifications.retrieveContent(notification_id));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      NotificationsTools.tools[2],
      "Get the draft (unpublished) content blocks of a notification template.",
      {
        notification_id: z.string().describe('The notification template ID'),
      },
      async ({ notification_id }) => {
        return handleToolCall(() => this.mcp.courier.notifications.retrieveContent(notification_id, { version: 'draft' }));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      NotificationsTools.tools[3],
      "Create a V2 notification template. name is required. Provide content inline or set it immediately after creation via put_notification_content. To send with this template you must publish it first via publish_notification (or pass state: 'PUBLISHED' on create). Link a routing strategy via notification.routing.strategy_id to control which channels are used. Example: { notification: { name: 'welcome-email', tags: [], brand: null, subscription: null, routing: { strategy_id: 'rs_01abc' }, content: { version: '2022-01-01', elements: [] } } }.",
      {
        notification: notificationTemplatePayload.describe('Notification template payload'),
        state: z.enum(['DRAFT', 'PUBLISHED']).optional().describe('Template state after creation (defaults to DRAFT)'),
      },
      async ({ notification, state }) => {
        return handleToolCall(() =>
          this.mcp.courier.notifications.create({
            notification: notification as any,
            ...(state !== undefined ? { state } : {}),
          })
        );
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      NotificationsTools.tools[4],
      "Retrieve a notification template by ID. Optionally request draft, published, or a version such as v001.",
      {
        notification_id: z.string().describe('The notification template ID'),
        version: z.string().optional().describe('Version to retrieve: draft, published, or a string like v001'),
      },
      async ({ notification_id, version }) => {
        return handleToolCall(() =>
          this.mcp.courier.notifications.retrieve(
            notification_id,
            version !== undefined ? { version } : undefined
          )
        );
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      NotificationsTools.tools[5],
      "Replace a notification template entirely (full document PUT).",
      {
        notification_id: z.string().describe('The notification template ID to replace'),
        notification: notificationTemplatePayload.describe('Full notification template payload'),
        state: z.enum(['DRAFT', 'PUBLISHED']).optional().describe('Template state after update (defaults to DRAFT)'),
      },
      async ({ notification_id, notification, state }) => {
        return handleToolCall(() =>
          this.mcp.courier.notifications.replace(notification_id, {
            notification: notification as any,
            ...(state !== undefined ? { state } : {}),
          })
        );
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      NotificationsTools.tools[6],
      "Archive a notification template by ID.",
      {
        notification_id: z.string().describe('The notification template ID to archive'),
      },
      async ({ notification_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.notifications.archive(notification_id);
          return { success: true, message: `Notification ${notification_id} archived` };
        });
      },
      { destructiveHint: true, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      NotificationsTools.tools[7],
      "List version history for a notification template.",
      {
        notification_id: z.string().describe('The notification template ID'),
        cursor: z.string().optional().describe('Pagination cursor from a previous response'),
        limit: z.number().optional().describe('Max versions per page (default 10, max 10)'),
      },
      async ({ notification_id, cursor, limit }) => {
        return handleToolCall(() =>
          this.mcp.courier.notifications.listVersions(notification_id, {
            ...(cursor !== undefined ? { cursor } : {}),
            ...(limit !== undefined ? { limit } : {}),
          })
        );
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      NotificationsTools.tools[8],
      "Publish a notification template, making it available for sending. Must be called before send_message_template unless the template was created with state: 'PUBLISHED'. Publishes the current draft by default; pass version (e.g. 'v001') to publish a specific historical version. Returns 204 on success.",
      {
        notification_id: z.string().describe('The notification template ID to publish'),
        version: z.string().optional().describe('Historical version to publish (e.g. v001); omit to publish current draft'),
      },
      async ({ notification_id, version }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.notifications.publish(
            notification_id,
            version !== undefined ? { version } : {}
          );
          return { success: true, message: `Notification ${notification_id} published` };
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      NotificationsTools.tools[9],
      "List checks for a notification submission.",
      {
        notification_id: z.string().describe('The notification template ID'),
        submission_id: z.string().describe('The submission ID for the checks resource'),
      },
      async ({ notification_id, submission_id }) => {
        return handleToolCall(() =>
          this.mcp.courier.notifications.checks.list(submission_id, { id: notification_id })
        );
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      NotificationsTools.tools[10],
      "Update check statuses for a notification submission.",
      {
        notification_id: z.string().describe('The notification template ID'),
        submission_id: z.string().describe('The submission ID for the checks resource'),
        checks: z
          .array(
            z.object({
              id: z.string().describe('Check ID'),
              status: z.enum(['RESOLVED', 'FAILED', 'PENDING']).describe('Check status'),
              type: z.literal('custom').describe('Check type'),
            })
          )
          .describe('Checks to update'),
      },
      async ({ notification_id, submission_id, checks }) => {
        return handleToolCall(() =>
          this.mcp.courier.notifications.checks.update(submission_id, { id: notification_id, checks })
        );
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      NotificationsTools.tools[11],
      'Replace the elemental content of a V2 notification template. Overwrites all elements. Use channel elements to target specific channels. Multi-channel example: elements: [{ type: "channel", channel: "email", elements: [{ type: "meta", title: "Hello" }, { type: "text", content: "Email body" }] }, { type: "channel", channel: "push", elements: [{ type: "meta", title: "Hello" }, { type: "text", content: "Push body" }] }, { type: "channel", channel: "inbox", elements: [{ type: "text", content: "Inbox plain text only" }] }].',
      {
        notification_id: z.string().describe('The notification template ID (nt_ prefix)'),
        elements: z.array(z.record(z.any())).describe('Array of elemental content nodes'),
        version: z.string().optional().describe('Content version string'),
        state: z.enum(['DRAFT', 'PUBLISHED']).optional().describe('Template state after update'),
      },
      async ({ notification_id, elements, version, state }) => {
        return handleToolCall(() => {
          const body: Record<string, any> = { content: { elements } };
          if (version !== undefined) body.content.version = version;
          if (state !== undefined) body.state = state;
          return this.mcp.courier.notifications.putContent(notification_id, body as any);
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      NotificationsTools.tools[12],
      'Update a single element within a V2 notification template.',
      {
        notification_id: z.string().describe('The notification template ID (nt_ prefix)'),
        element_id: z.string().describe('The element ID to update'),
        type: z.string().describe('Element type (e.g. text, action, image, divider, meta)'),
        channels: z.array(z.string()).optional().describe('Channels this element applies to'),
        data: z.record(z.any()).optional().describe('Element data payload'),
        if: z.string().optional().describe('Conditional expression for element visibility'),
        loop: z.string().optional().describe('Loop expression for repeating elements'),
        ref: z.string().optional().describe('Reference identifier'),
        state: z.enum(['DRAFT', 'PUBLISHED']).optional().describe('Template state after update'),
      },
      async (args) => {
        return handleToolCall(() => {
          const params: Record<string, any> = { id: args.notification_id, type: args.type };
          if (args.channels) params.channels = args.channels;
          if (args.data) params.data = args.data;
          if (args.if) params.if = args.if;
          if (args.loop) params.loop = args.loop;
          if (args.ref) params.ref = args.ref;
          if (args.state) params.state = args.state;
          return this.mcp.courier.notifications.putElement(args.element_id, params as any);
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      NotificationsTools.tools[13],
      'Set locale-specific content overrides for a V2 notification template. Each element override must reference an existing element by its id. Example for Spanish locale: { notification_id: "nt_01abc", locale_id: "es", elements: [{ id: "elem_meta_1", title: "Restablecer contraseña" }, { id: "elem_text_1", content: "Haga clic en el enlace para restablecer su contraseña." }] }.',
      {
        notification_id: z.string().describe('The notification template ID (nt_ prefix)'),
        locale_id: z.string().describe('Locale identifier (e.g. es, fr, pt-BR)'),
        elements: z.array(z.object({
          id: z.string().describe('Target element ID to override'),
        }).catchall(z.any())).describe('Array of element overrides with id and locale-specific content'),
        state: z.enum(['DRAFT', 'PUBLISHED']).optional().describe('Template state after update'),
      },
      async ({ notification_id, locale_id, elements, state }) => {
        return handleToolCall(() => {
          const params: Record<string, any> = { id: notification_id, elements };
          if (state !== undefined) params.state = state;
          return this.mcp.courier.notifications.putLocale(locale_id, params as any);
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      NotificationsTools.tools[14],
      'Cancel a notification template submission.',
      {
        notification_id: z.string().describe('The notification template ID'),
        submission_id: z.string().describe('The submission ID to cancel'),
      },
      async ({ notification_id, submission_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.notifications.checks.delete(submission_id, { id: notification_id });
          return { success: true, message: `Submission ${submission_id} cancelled` };
        });
      },
      { destructiveHint: true, idempotentHint: true }
    );
  }
}
