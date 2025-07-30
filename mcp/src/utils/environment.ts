import { CourierClientOptions } from "../client/courier-client.js";

export class CourierMcpConfig {

  readonly apiKey: string;
  readonly baseUrl: string;
  readonly showLogs: boolean;

  constructor(headers?: Record<string, any>) {
    this.apiKey = headers?.['API_KEY'] || headers?.['api_key'] || '';
    this.baseUrl = headers?.['BASE_URL'] || headers?.['base_url'] || 'https://api.courier.com';
    this.showLogs = headers?.['SHOW_LOGS'] || headers?.['show_logs'] || true;
  }

  public toCourierClientOptions(): CourierClientOptions {
    return {
      apiKey: this.apiKey,
      baseUrl: this.baseUrl,
      showLogs: this.showLogs,
    };
  }

}