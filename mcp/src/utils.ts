import fs from 'fs';
import path from 'path';

// /**
//  * Attempts to load just the Courier "config" part from mcp.json from several possible locations,
//  * including Claude Desktop config locations.
//  * Returns the config object, or undefined if not found.
//  */
// export function getCourierConfig(headers?: Record<string, any>): CourierMcpConfig {

//   // TODO: Something is up with the headers... they dont get passed in correctly.

//   if (headers && (headers['Authorization'] || headers['authorization'])) {
//     const authHeader = headers['Authorization'] || headers['authorization'];
//     let token: string | undefined = undefined;
//     if (typeof authHeader === 'string') {
//       const match = authHeader.match(/^Bearer\s+(.+)$/i);
//       token = match ? match[1] : authHeader;
//     }
//     return {
//       API_KEY: token,
//       BASE_URL: undefined, // TODO: add base url
//     };
//   }

//   // // Add Claude Desktop config locations
//   // const home = process.env.HOME || '';
//   // const claudeDesktopConfigPaths = [
//   //   path.resolve(home, '.claude_desktop_config', 'mcp.json'),
//   //   path.resolve(home, '.claude_desktop_config', 'config', 'mcp.json'),
//   //   path.resolve(home, '.claude_desktop_config', 'config.json'),
//   // ];

//   // const possiblePaths = [
//   //   path.resolve(process.cwd(), 'mcp.json'),
//   //   path.resolve(process.cwd(), '.cursor', 'mcp.json'),
//   //   path.resolve(home, '.cursor', 'mcp.json'),
//   //   ...claudeDesktopConfigPaths,
//   // ];

//   // for (const configPath of possiblePaths) {
//   //   try {
//   //     if (fs.existsSync(configPath)) {
//   //       const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
//   //       // Try standard mcpServers.Courier.config
//   //       if (
//   //         config &&
//   //         config.mcpServers &&
//   //         (
//   //           (config.mcpServers.Courier && config.mcpServers.Courier.config) ||
//   //           (config.mcpServers.courier && config.mcpServers.courier.config)
//   //         )
//   //       ) {
//   //         // Support both "Courier" and "courier" keys
//   //         const courierConfig =
//   //           (config.mcpServers.Courier && config.mcpServers.Courier.config) ||
//   //           (config.mcpServers.courier && config.mcpServers.courier.config);
//   //         return courierConfig as CourierMcpConfig;
//   //       }
//   //       // Try top-level "courier" or "Courier" config for Claude Desktop
//   //       if (config.courier && typeof config.courier === 'object') {
//   //         return config.courier as CourierMcpConfig;
//   //       }
//   //       if (config.Courier && typeof config.Courier === 'object') {
//   //         return config.Courier as CourierMcpConfig;
//   //       }
//   //     }
//   //   } catch (err) {
//   //     console.error(err);
//   //   }
//   // }
//   return {
//     API_KEY: undefined,
//     BASE_URL: undefined,
//   };
// }