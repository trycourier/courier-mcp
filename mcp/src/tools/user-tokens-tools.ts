import { z } from "zod";
import { CourierMcpTools } from "./tools.js";

export class UserTokensTools extends CourierMcpTools {
  public register() {
    // List tokens for a user
    this.mcp.tool(
      "list_user_push_tokens",
      "List all push tokens for a given user.",
      {
        user_id: z.string(),
      },
      async ({ user_id }) => {
        return await this.mcp.client.userTokens.listTokens(user_id);
      }
    );

    // Get a specific token for a user
    this.mcp.tool(
      "get_user_push_token",
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
    this.mcp.tool(
      "create_or_replace_user_push_token",
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
