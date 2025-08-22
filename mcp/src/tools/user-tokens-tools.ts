import { z } from "zod";
import { CourierMcpTools } from "./tools.js";

export class UserTokensTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'list_user_push_tokens',
    'get_user_push_token',
    'create_or_replace_user_push_token',
  ];

  public register() {

    // List tokens for a user
    this.registerToolIfNeeded(
      UserTokensTools.tools[0],
      "List all push tokens for a given user.",
      {
        user_id: z.string(),
      },
      async ({ user_id }) => {
        return await this.mcp.client.userTokens.listTokens(user_id);
      }
    );

    // Get a specific token for a user
    this.registerToolIfNeeded(
      UserTokensTools.tools[1],
      "Get a specific push token for a given user.",
      {
        user_id: z.string(),
        token: z.enum(["firebase-fcm", "apn", "expo", "onesignal"]),
      },
      async ({ user_id, token }) => {
        return await this.mcp.client.userTokens.getToken(user_id, token as string);
      }
    );

    // Create or replace a specific token for a user
    this.registerToolIfNeeded(
      UserTokensTools.tools[2],
      "Create or replace a specific push token for a given user.",
      {
        user_id: z.string(),
        token: z.string(),
        provider_key: z.enum(["firebase-fcm", "apn", "expo", "onesignal"]),
        body: z.any(),
      },
      async ({ user_id, token, provider_key, body }) => {
        return await this.mcp.client.userTokens.putToken(user_id, token, provider_key as string, body);
      }
    );
  }
}
