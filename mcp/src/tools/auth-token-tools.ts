import z from "zod";
import { CourierMcpTools } from "./tools.js";

export class AuthTokenTools extends CourierMcpTools {

  public register() {
    this.mcp.tool(
      'issue_token',
      'Generate a JWT authentication token for Courier.',
      {
        user_id: z.string(),
        scopes: z.array(z.string()).default(['write:user-tokens', 'inbox:read:messages', 'inbox:write:events', 'read:preferences', 'write:preferences', 'read:brands']),
        expires_in: z.string().default('1h'),
      },
      async ({ user_id, scopes, expires_in }) => {
        return await this.mcp.client.authTokens.issueToken({
          scope: `user_id:${user_id} ${scopes.join(' ')}`,
          expires_in: expires_in,
        });
      }
    );
  }
}