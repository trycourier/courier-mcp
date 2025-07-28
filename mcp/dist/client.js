import { CourierClient } from '@trycourier/courier';
import { getCourierConfig } from './utils.js';
export function getCourierClient(headers) {
    const config = getCourierConfig(headers);
    if (!config?.API_KEY) {
        throw new Error('No Courier API_KEY found in config. Please set it in MCP config.');
    }
    return new CourierClient({
        authorizationToken: config?.API_KEY,
        baseUrl: config?.BASE_URL,
    });
}
//# sourceMappingURL=client.js.map