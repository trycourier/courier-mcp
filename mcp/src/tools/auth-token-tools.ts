import z from "zod";
import { CourierMcpTools } from "./tools.js";

export class AuthTokenTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'generate_jwt_for_user',
  ];

  public register() {
    this.registerToolIfNeeded(
      AuthTokenTools.tools[0],
      'Generate a JWT authentication token for a user.',
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