import z from "zod";
import { CourierMcpTools } from "./tools.js";

export class ProfilesTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'get_user_profile_by_id',
    'create_or_merge_user',
    'get_user_list_subscriptions',
    'subscribe_user_to_lists',
    'delete_user_list_subscriptions',
  ];

  public register() {

    // Get a user profile by user_id using HTTP utility
    this.registerToolIfNeeded(
      ProfilesTools.tools[0],
      'Get a user profile by their ID',
      {
        user_id: z.string(),
      },
      async ({ user_id }) => {
        return await this.mcp.client.profiles.getProfile(user_id);
      }
    );

    // Create or merge a user profile
    this.registerToolIfNeeded(
      ProfilesTools.tools[1],
      'Create or merge a user profile by user ID. Merges supplied values with an existing profile or creates a new one.',
      {
        user_id: z.string(),
        profile: z.record(z.any()).default({}),
      },
      async ({ user_id, profile }) => {
        return await this.mcp.client.profiles.create(user_id, profile);
      }
    );

    // Get a user's list subscriptions by user_id
    this.registerToolIfNeeded(
      ProfilesTools.tools[2],
      'Get the list subscriptions for a user by their ID',
      {
        user_id: z.string(),
        request: z.object({
          cursor: z.string().optional(),
          limit: z.number().optional(),
        }).optional(),
      },
      async ({ user_id, request }) => {
        return await this.mcp.client.profiles.getListSubscriptions(user_id, request);
      }
    );

    // Subscribe a user to lists
    this.registerToolIfNeeded(
      ProfilesTools.tools[3],
      'Subscribe a user to one or more lists. If the list does not exist, it will be created.',
      {
        user_id: z.string(),
        lists: z.array(
          z.object({
            listId: z.string(),
            preferences: z.any().optional(),
          })
        ),
      },
      async ({ user_id, lists }) => {
        return await this.mcp.client.profiles.subscribeToLists(user_id, { lists });
      }
    );

    // Delete all list subscriptions for a user
    this.registerToolIfNeeded(
      ProfilesTools.tools[4],
      'Delete all list subscriptions for a user by their ID.',
      {
        user_id: z.string(),
      },
      async ({ user_id }) => {
        return await this.mcp.client.profiles.deleteListSubscription(user_id);
      }
    );
  }
}