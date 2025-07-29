import z from "zod";
import { CourierMcpTools } from "./tools.js";

export class AutomationsTools extends CourierMcpTools {

  public register() {
    // Invoke an automation run from an automation template
    this.mcp.tool(
      'invoke_automation_template',
      'Invoke an automation run from an automation template.',
      {
        template_id: z.string(),
        brand: z.string().optional(),
        data: z.record(z.any()).optional(),
        profile: z.record(z.any()).optional(),
        recipient: z.string().optional(),
        template: z.string().optional(),
        idempotency_key: z.string().optional(),
        idempotency_expiry: z.string().optional(),
      },
      async ({ template_id, brand, data, profile, recipient, template, idempotency_key, idempotency_expiry }) => {
        try {
          const request: any = {};
          if (brand !== undefined) request.brand = brand;
          if (data !== undefined) request.data = data;
          if (profile !== undefined) request.profile = profile;
          if (recipient !== undefined) request.recipient = recipient;
          if (template !== undefined) request.template = template;

          const requestOptions: any = {};
          if (idempotency_key !== undefined) requestOptions.idempotencyKey = idempotency_key;
          if (idempotency_expiry !== undefined) requestOptions.idempotencyExpiry = idempotency_expiry;

          const response = await this.mcp.courierClient.automations.invokeAutomationTemplate(
            template_id,
            request,
            requestOptions
          );

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response, null, 2),
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(err, null, 2),
              },
            ],
          };
        }
      }
    );

    // Invoke an ad hoc automation run
    this.mcp.tool(
      'invoke_ad_hoc_automation',
      'Invoke an ad hoc automation run.',
      {
        data: z.record(z.any()).optional(),
        profile: z.record(z.any()).optional(),
        recipient: z.string().optional(),
        automation: z.object({
          cancelation_token: z.string().optional(),
          steps: z.array(z.record(z.any())),
        }),
        idempotency_key: z.string().optional(),
        idempotency_expiry: z.string().optional(),
      },
      async ({ data, profile, recipient, automation, idempotency_key, idempotency_expiry }) => {
        try {
          const request: any = {
            automation,
          };
          if (data !== undefined) request.data = data;
          if (profile !== undefined) request.profile = profile;
          if (recipient !== undefined) request.recipient = recipient;

          const requestOptions: any = {};
          if (idempotency_key !== undefined) requestOptions.idempotencyKey = idempotency_key;
          if (idempotency_expiry !== undefined) requestOptions.idempotencyExpiry = idempotency_expiry;

          const response = await this.mcp.courierClient.automations.invokeAdHocAutomation(
            request,
            requestOptions
          );

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response, null, 2),
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(err, null, 2),
              },
            ],
          };
        }
      }
    );
  }
}