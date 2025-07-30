import { z } from "zod";
import { CourierMcpTools } from "./tools.js";

export class UserTokensTools extends CourierMcpTools {
  public register() {
    // List tokens for a user
    this.mcp.tool(
      "list_user_tokens",
      "List all tokens for a given user.",
      {
        user_id: z.string(),
      },
      async ({ user_id }) => {
        return await this.mcp.client.userTokens.listTokens(user_id);
      }
    );

    // Get a specific token for a user
    this.mcp.tool(
      "get_user_token",
      "Get a specific token for a given user.",
      {
        user_id: z.string(),
        token: z.string(),
      },
      async ({ user_id, token }) => {
        return await this.mcp.client.userTokens.getToken(user_id, token);
      }
    );

    // Create or replace a specific token for a user
    this.mcp.tool(
      "put_user_token",
      "Create or replace a specific token for a given user.",
      {
        user_id: z.string(),
        token: z.string(),
        body: z.any(),
      },
      async ({ user_id, token, body }) => {
        return await this.mcp.client.userTokens.putToken(user_id, token, body);
      }
    );

    // // Create or replace multiple tokens for a user
    // this.mcp.tool(
    //   "put_user_tokens",
    //   "Create or replace multiple tokens for a given user.",
    //   {
    //     user_id: z.string(),
    //     body: z.any(),
    //   },
    //   async ({ user_id, body }) => {
    //     return await this.mcp.client.userTokens.putTokens(user_id, body);
    //   }
    // );

    // // Patch a specific token for a user
    // this.mcp.tool(
    //   "patch_user_token",
    //   "Patch (partially update) a specific token for a given user.",
    //   {
    //     user_id: z.string(),
    //     token: z.string(),
    //     body: z.any(),
    //   },
    //   async ({ user_id, token, body }) => {
    //     return await this.mcp.client.userTokens.patchToken(user_id, token, body);
    //   }
    // );

    // // Delete a specific token for a user
    // this.mcp.tool(
    //   "delete_user_token",
    //   "Delete a specific token for a given user.",
    //   {
    //     user_id: z.string(),
    //     token: z.string(),
    //   },
    //   async ({ user_id, token }) => {
    //     return await this.mcp.client.userTokens.deleteToken(user_id, token);
    //   }
    // );
  }
}
