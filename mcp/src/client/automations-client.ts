import { BaseClient } from "./base-client.js";

export class AutomationsClient extends BaseClient {

  async invokeAutomationTemplate(templateId: string, request: any) {
    const res = await this.request('POST', `/automations/${templateId}/invoke`, request);
    return await this.toJson(res);
  }

  async invokeAdHocAutomation(request: any) {
    const res = await this.request('POST', `/automations/invoke`, request);
    return await this.toJson(res);
  }
} 