import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class ProfilesTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'get_user_profile_by_id',
    'create_or_merge_user',
    'replace_profile',
    'patch_profile',
    'delete_profile',
    'get_user_list_subscriptions',
    'subscribe_user_to_lists',
    'delete_user_list_subscriptions',
  ];

  public register() {

    this.registerToolIfNeeded(
      ProfilesTools.tools[0],
      'Get a user profile by their ID. Returns profile data including email, phone, and custom properties.',
      {
        user_id: z.string().describe('The user ID to look up'),
      },
      async ({ user_id }) => {
        return handleToolCall(() => this.mcp.courier.profiles.retrieve(user_id));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      ProfilesTools.tools[1],
      'Create a new user profile or merge supplied values into an existing profile (POST). Existing fields not included are preserved.',
      {
        user_id: z.string().describe('The user ID'),
        profile: z.record(z.any()).default({}).describe('Profile data to create or merge (e.g. { email: "...", phone_number: "..." })'),
      },
      async ({ user_id, profile }) => {
        return handleToolCall(() => this.mcp.courier.profiles.create(user_id, { profile }));
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      ProfilesTools.tools[2],
      'Fully replace a user profile (PUT). All existing data is overwritten; include every field you want to keep.',
      {
        user_id: z.string().describe('The user ID'),
        profile: z.record(z.any()).describe('Complete profile data to replace with'),
      },
      async ({ user_id, profile }) => {
        return handleToolCall(() => this.mcp.courier.profiles.replace(user_id, { profile }));
      },
      { readOnlyHint: false, destructiveHint: true, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      ProfilesTools.tools[3],
      'Partially update a user profile via JSON Patch (RFC 6902). Use add/replace/remove operations on specific profile paths.',
      {
        user_id: z.string().describe('The user ID'),
        patch: z.array(z.object({
          op: z.string().describe('Patch operation (add, remove, replace, move, copy, test)'),
          path: z.string().describe('JSON pointer path (e.g. /email, /phone_number)'),
          value: z.string().optional().describe('Value for the operation'),
        })).describe('Array of JSON Patch operations to apply to the profile'),
      },
      async ({ user_id, patch }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.profiles.update(user_id, { patch } as any);
          return { success: true, message: `Profile ${user_id} patched` };
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      ProfilesTools.tools[4],
      'Delete a user profile permanently.',
      {
        user_id: z.string().describe('The user ID to delete'),
      },
      async ({ user_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.profiles.delete(user_id);
          return { success: true, message: `Profile ${user_id} deleted` };
        });
      },
      { destructiveHint: true, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      ProfilesTools.tools[5],
      'Get all list subscriptions for a user.',
      {
        user_id: z.string().describe('The user ID'),
        cursor: z.string().optional().describe('Pagination cursor'),
      },
      async ({ user_id, cursor }) => {
        return handleToolCall(() => this.mcp.courier.profiles.lists.retrieve(user_id, cursor ? { cursor } : {}));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      ProfilesTools.tools[6],
      'Subscribe a user to one or more lists. Creates lists that do not exist.',
      {
        user_id: z.string().describe('The user ID'),
        lists: z.array(
          z.object({
            listId: z.string().describe('List ID to subscribe to'),
            preferences: z.any().optional().describe('Optional notification preferences for this list'),
          })
        ).describe('Array of lists to subscribe to'),
      },
      async ({ user_id, lists }) => {
        return handleToolCall(() => this.mcp.courier.profiles.lists.subscribe(user_id, { lists }));
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      ProfilesTools.tools[7],
      'Delete all list subscriptions for a user.',
      {
        user_id: z.string().describe('The user ID'),
      },
      async ({ user_id }) => {
        return handleToolCall(() => this.mcp.courier.profiles.lists.delete(user_id));
      },
      { destructiveHint: true, idempotentHint: true }
    );
  }
}
