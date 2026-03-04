import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class ProfilesTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'get_user_profile_by_id',
    'create_or_merge_user',
    'replace_profile',
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
      }
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
      }
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
      }
    );

    this.registerToolIfNeeded(
      ProfilesTools.tools[3],
      'Delete a user profile permanently.',
      {
        user_id: z.string().describe('The user ID to delete'),
      },
      async ({ user_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.profiles.delete(user_id);
          return { success: true, message: `Profile ${user_id} deleted` };
        });
      }
    );

    this.registerToolIfNeeded(
      ProfilesTools.tools[4],
      'Get all list subscriptions for a user.',
      {
        user_id: z.string().describe('The user ID'),
        cursor: z.string().optional().describe('Pagination cursor'),
      },
      async ({ user_id, cursor }) => {
        return handleToolCall(() => this.mcp.courier.profiles.lists.retrieve(user_id, cursor ? { cursor } : {}));
      }
    );

    this.registerToolIfNeeded(
      ProfilesTools.tools[5],
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
      }
    );

    this.registerToolIfNeeded(
      ProfilesTools.tools[6],
      'Delete all list subscriptions for a user.',
      {
        user_id: z.string().describe('The user ID'),
      },
      async ({ user_id }) => {
        return handleToolCall(() => this.mcp.courier.profiles.lists.delete(user_id));
      }
    );
  }
}
