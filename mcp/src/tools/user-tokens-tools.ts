import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class UserTokensTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'list_user_push_tokens',
    'get_user_push_token',
    'create_or_replace_user_push_token',
    'patch_user_token',
    'delete_user_token',
  ];

  public register() {

    this.registerToolIfNeeded(
      UserTokensTools.tools[0],
      "List all push/device tokens for a user.",
      {
        user_id: z.string().describe('The user ID'),
      },
      async ({ user_id }) => {
        return handleToolCall(() => this.mcp.courier.users.tokens.list(user_id));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      UserTokensTools.tools[1],
      "Get a specific push/device token for a user.",
      {
        user_id: z.string().describe('The user ID'),
        token: z.string().describe('The token identifier'),
      },
      async ({ user_id, token }) => {
        return handleToolCall(() => this.mcp.courier.users.tokens.retrieve(token, { user_id }));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      UserTokensTools.tools[2],
      "Create or replace a push/device token for a user.",
      {
        user_id: z.string().describe('The user ID'),
        token: z.string().describe('The token string'),
        provider_key: z.enum(["firebase-fcm", "apn", "expo", "onesignal"]).describe('Push provider'),
        device: z.object({
          app_id: z.string().optional(),
          ad_id: z.string().optional(),
          device_id: z.string().optional(),
          platform: z.string().optional(),
          manufacturer: z.string().optional(),
          model: z.string().optional(),
        }).optional().describe('Device metadata'),
      },
      async ({ user_id, token, provider_key, device }) => {
        return handleToolCall(async () => {
          const params: any = { user_id, token, provider_key };
          if (device) params.device = device;
          await this.mcp.courier.users.tokens.addSingle(token, params);
          return { success: true, user_id, token };
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      UserTokensTools.tools[3],
      'Apply a JSON Patch (RFC 6902) to a specific push token.',
      {
        user_id: z.string().describe('The user ID'),
        token: z.string().describe('The token identifier'),
        patch: z.array(z.object({
          op: z.string().describe('Patch operation (add, remove, replace, move, copy, test)'),
          path: z.string().describe('JSON pointer path'),
          value: z.string().optional().describe('Value for the operation'),
        })).describe('Array of JSON Patch operations'),
      },
      async ({ user_id, token, patch }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.users.tokens.update(token, { user_id, patch });
          return { success: true, message: `Token ${token} patched for user ${user_id}` };
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      UserTokensTools.tools[4],
      'Delete a specific push token for a user.',
      {
        user_id: z.string().describe('The user ID'),
        token: z.string().describe('The token identifier to delete'),
      },
      async ({ user_id, token }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.users.tokens.delete(token, { user_id });
          return { success: true, message: `Token ${token} deleted for user ${user_id}` };
        });
      },
      { destructiveHint: true, idempotentHint: true }
    );
  }
}
