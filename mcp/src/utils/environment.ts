export class CourierMcpEnvironment {

  readonly apiKey: string;
  readonly baseUrl: string;

  constructor(headers?: Record<string, any>) {
    this.apiKey = headers?.['Authorization'] || headers?.['authorization'] || '';
    this.baseUrl = headers?.['BASE_URL'] || 'https://api.courier.com';
  }

}