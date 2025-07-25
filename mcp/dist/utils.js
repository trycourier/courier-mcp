import fs from 'fs';
import path from 'path';
/**
 * Attempts to load just the Courier "config" part from mcp.json from several possible locations.
 * Returns the config object, or undefined if not found.
 */
export function getCourierConfig() {
    const possiblePaths = [
        path.resolve(process.cwd(), 'mcp.json'),
        path.resolve(process.cwd(), '.cursor', 'mcp.json'),
        path.resolve(process.env.HOME || '', '.cursor', 'mcp.json'),
    ];
    for (const configPath of possiblePaths) {
        try {
            if (fs.existsSync(configPath)) {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                if (config &&
                    config.mcpServers &&
                    config.mcpServers.Courier &&
                    config.mcpServers.Courier.config) {
                    return config.mcpServers.Courier.config;
                }
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    return undefined;
}
//# sourceMappingURL=utils.js.map