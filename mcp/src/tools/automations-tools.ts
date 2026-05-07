import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class AutomationsTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'invoke_automation_template',
    'invoke_ad_hoc_automation',
    'list_automations',
  ];

  public register() {

    this.registerToolIfNeeded(
      AutomationsTools.tools[0],
      'Invoke an automation run from an existing automation template.',
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
      'Invoke an ad-hoc automation with inline steps (no template needed).',
      {
        automation: z.object({
          steps: z.array(z.any()).describe('Array of automation step objects'),
          cancelation_token: z.string().optional().describe('Token for cancelling the automation'),
        }).describe('The automation definition'),
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
      'List automation templates in the workspace. Optionally filter by version.',
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
  }
}
