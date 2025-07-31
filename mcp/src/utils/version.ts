import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json from the mcp directory
const packageJsonPath = join(__dirname, '../../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

export const PACKAGE_NAME = packageJson.name;
export const PACKAGE_VERSION = packageJson.version;
export const MCP_DETAILS = {
  name: PACKAGE_NAME,
  version: PACKAGE_VERSION,
};
export const USER_AGENT = `${PACKAGE_NAME}/${PACKAGE_VERSION}`; 