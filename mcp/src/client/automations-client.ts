import Http from "../utils/http.js";
import { CourierClientOptions } from "./courier-client.js";

export class AutomationsClient {

  private readonly options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  async invokeAutomationTemplate(templateId: string, request: any) {
    return await Http.post({
      options: this.options,
      route: `/automations/${templateId}/invoke`,
      body: request,
    });
  }

  async invokeAdHocAutomation(request: any) {
    return await Http.post({
      options: this.options,
      route: `/automations/invoke`,
      body: request,
    });
  }
} 