import z from "zod";
import { CourierMcpTools } from "./tools.js";

export class AutomationsTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'invoke_automation_template',
  ];

  public register() {
    // Invoke an automation run from an automation template
    this.registerToolIfNeeded(
      AutomationsTools.tools[0],
      'Invoke an automation run from an automation template.',
      {
        template_id: z.string(),
        brand: z.string().optional(),
        data: z.record(z.any()).optional(),
        profile: z.record(z.any()).optional(),
        recipient: z.string().optional(),
        template: z.string().optional(),
      },
      async ({ template_id, brand, data, profile, recipient, template }) => {
        const request: any = {};
        if (brand !== undefined) request.brand = brand;
        if (data !== undefined) request.data = data;
        if (profile !== undefined) request.profile = profile;
        if (recipient !== undefined) request.recipient = recipient;
        if (template !== undefined) request.template = template;

        return await this.mcp.client.automations.invokeAutomationTemplate(
          template_id,
          request,
        );
      }
    );
  }
}