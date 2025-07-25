export type CourierMcpConfig = {
    BASE_URL?: string;
    API_KEY?: string;
};
/**
 * Attempts to load just the Courier "config" part from mcp.json from several possible locations.
 * Returns the config object, or undefined if not found.
 */
export declare function getCourierConfig(): CourierMcpConfig | undefined;
