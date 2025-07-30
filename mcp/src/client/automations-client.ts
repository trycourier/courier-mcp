import Http from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class AutomationsClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  async invokeAutomationTemplate(templateId: string, request: any) {
    return await Http.post({
      url: `${this.options.baseUrl}/automations/${templateId}/invoke`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
      body: request,
    });
  }

  async invokeAdHocAutomation(request: any) {
    return await Http.post({
      url: `${this.options.baseUrl}/automations/invoke`,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
      },
      body: request,
    });
  }
} 