import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class AuthTokenTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'generate_jwt_for_user',
  ];

  public register() {
    this.registerToolIfNeeded(
      AuthTokenTools.tools[0],
      'Generate a JWT authentication token for a user. Used for client-side SDK auth (Inbox, Preferences, etc.).',
      {
        user_id: z.string().describe('The user ID to scope the token to'),
        scopes: z.array(z.string()).default([
          'write:user-tokens',
          'inbox:read:messages',
          'inbox:write:events',
          'read:preferences',
          'write:preferences',
          'read:brands',
        ]).describe('Permission scopes for the token'),
        expires_in: z.string().default('1h').describe('Token expiry duration (e.g. "1h", "2 days")'),
      },
      async ({ user_id, scopes, expires_in }) => {
        return handleToolCall(() =>
          this.mcp.courier.auth.issueToken({
            scope: `user_id:${user_id} ${scopes.join(' ')}`,
            expires_in,
          })
        );
      }
    );
  }
}
