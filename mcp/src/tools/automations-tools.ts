import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

const automationStepSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('send'),
    template: z.string().optional().describe('Notification template ID or key'),
    brand: z.string().optional(),
    data: z.record(z.any()).optional(),
    profile: z.record(z.any()).optional(),
    recipient: z.string().optional(),
    if: z.string().optional().describe('Condition expression'),
  }),
  z.object({
    action: z.literal('send-list'),
    list: z.string().describe('List ID to send to'),
    template: z.string().optional(),
    brand: z.string().optional(),
    data: z.record(z.any()).optional(),
    if: z.string().optional(),
  }),
  z.object({
    action: z.literal('delay'),
    duration: z.string().optional().describe('ISO 8601 duration (e.g. "PT1H" for 1 hour)'),
    until: z.string().optional().describe('ISO 8601 timestamp to wait until'),
    if: z.string().optional(),
  }),
  z.object({
    action: z.literal('cancel'),
    cancelation_token: z.string().describe('The token set when the original automation was invoked (single "l" spelling)'),
    if: z.string().optional(),
  }),
  z.object({
    action: z.literal('update-profile'),
    recipient_id: z.string().optional(),
    merge: z.enum(['none', 'overwrite', 'soft-merge', 'replace']).optional(),
    profile: z.record(z.any()).optional(),
    if: z.string().optional(),
  }),
  z.object({
    action: z.literal('invoke'),
    template: z.string().describe('Automation template ID to invoke'),
    if: z.string().optional(),
  }),
  z.object({
    action: z.literal('fetch-data'),
    webhook: z.object({
      url: z.string(),
      method: z.enum(['GET', 'POST', 'PUT', 'PATCH']).optional(),
      headers: z.record(z.string()).optional(),
      body: z.record(z.any()).optional(),
    }).describe('HTTP request configuration'),
    merge_strategy: z.enum(['replace', 'overwrite', 'soft-merge']).optional(),
    if: z.string().optional(),
  }),
]);

export class AutomationsTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'invoke_automation_template',
    'invoke_ad_hoc_automation',
    'list_automations',
    'cancel_automation',
  ];

  public register() {

    this.registerToolIfNeeded(
      AutomationsTools.tools[0],
      'Invoke an automation run from an existing automation template. Call list_automations first to get the template_id. Example: { template_id: "auto-onboarding", recipient: "user-123", data: { plan: "pro" } }.',
      {
        template_id: z.string().describe('The automation template ID'),
        recipient: z.string().describe('Recipient user ID'),
        brand: z.string().optional().describe('Brand ID override'),
        data: z.record(z.any()).optional().describe('Data to pass to the automation'),
        profile: z.record(z.any()).optional().describe('Profile data for the recipient'),
        template: z.string().optional().describe('Notification template override'),
      },
      async ({ template_id, recipient, brand, data, profile, template }) => {
        return handleToolCall(() => {
          const body: Record<string, any> = { recipient };
          if (brand) body.brand = brand;
          if (data) body.data = data;
          if (profile) body.profile = profile;
          if (template) body.template = template;
          return this.mcp.courier.automations.invoke.invokeByTemplate(template_id, body as any);
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      AutomationsTools.tools[1],
      'Invoke an ad-hoc automation with inline steps. Valid step actions: send, send-list, delay, cancel, update-profile, invoke, fetch-data. To cancel a previously started automation, use the cancel_automation tool instead.',
      {
        automation: z.object({
          steps: z.array(automationStepSchema).describe('Ordered array of automation steps'),
          cancelation_token: z.string().optional().describe('Token for cancelling this automation later (single "l" spelling)'),
        }).describe('The automation definition with typed steps'),
        brand: z.string().optional(),
        data: z.record(z.any()).optional(),
        profile: z.record(z.any()).optional(),
        recipient: z.string().optional(),
        template: z.string().optional(),
      },
      async ({ automation, brand, data, profile, recipient, template }) => {
        return handleToolCall(() => {
          const body: Record<string, any> = { automation };
          if (brand) body.brand = brand;
          if (data) body.data = data;
          if (profile) body.profile = profile;
          if (recipient) body.recipient = recipient;
          if (template) body.template = template;
          return this.mcp.courier.automations.invoke.invokeAdHoc(body as any);
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      AutomationsTools.tools[2],
      'List automation templates in the workspace. Always call this first to discover template_id values before calling invoke_automation_template. Optionally filter by version.',
      {
        cursor: z.string().optional().describe('Pagination cursor'),
        version: z.enum(['published', 'draft']).optional().describe('Filter by version state'),
      },
      async ({ cursor, version }) => {
        return handleToolCall(() => {
          const query: Record<string, any> = {};
          if (cursor) query.cursor = cursor;
          if (version) query.version = version;
          return this.mcp.courier.automations.list(query);
        });
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      AutomationsTools.tools[3],
      'Cancel a running automation by its cancelation_token. This invokes a second ad-hoc automation with a single cancel step. The token must match the cancelation_token set when the original automation was started. Note: spelling is "cancelation_token" (single "l").',
      {
        cancelation_token: z.string().describe('The cancelation_token that was set when the automation was originally invoked'),
      },
      async ({ cancelation_token }) => {
        return handleToolCall(() => {
          return this.mcp.courier.automations.invoke.invokeAdHoc({
            automation: {
              steps: [{ action: 'cancel', cancelation_token }],
            },
          } as any);
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );
  }
}
