import Http, { toJson } from "../utils/http.js";
import { BaseClient } from "./base-client.js";

export class AutomationsClient extends BaseClient {

  async invokeAutomationTemplate(templateId: string, request: any) {
    const res = await Http.post({
      client: this.client,
      route: `/automations/${templateId}/invoke`,
      body: request,
    });
    return await toJson(this.client, res);
  }

  async invokeAdHocAutomation(request: any) {
    const res = await Http.post({
      client: this.client,
      route: `/automations/invoke`,
      body: request,
    });
    return await toJson(this.client, res);
  }
} 