import { CourierClient } from '@trycourier/courier';
import { getCourierConfig } from './utils.js';

export function getCourierClient(): CourierClient {
  const config = getCourierConfig();
  if (!config?.API_KEY) {
    throw new Error('No Courier API_KEY found in config. Please set it in MCP config.');
  }
  return new CourierClient({
    authorizationToken: config?.API_KEY,
    baseUrl: config?.BASE_URL,
  });
}
