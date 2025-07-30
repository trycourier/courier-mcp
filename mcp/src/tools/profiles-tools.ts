import z from "zod";
import { CourierMcpTools } from "./tools.js";
export class ProfilesTools extends CourierMcpTools {

  public register() {

    // Get a user profile by user_id using HTTP utility
    this.mcp.tool(
      'get_user_profile_by_id',
      'Get a user profile by their ID',
      {
        user_id: z.string(),
      },
      async ({ user_id }) => {
        return await this.mcp.client.profiles.getProfile(user_id);
      }
    );

    // Create or merge a user profile
    this.mcp.tool(
      'create_or_merge_user',
      'Create or merge a user profile by user ID. Merges supplied values with an existing profile or creates a new one.',
      {
        user_id: z.string(),
        profile: z.record(z.any()),
      },
      async ({ user_id, profile }) => {
        return await this.mcp.client.profiles.create(user_id, profile);
      }
    );

    // // Replace a user profile (PUT)
    // this.mcp.tool(
    //   'replace_user',
    //   'Replace a user profile by user ID. This is a full replacement (PUT).',
    //   {
    //     user_id: z.string(),
    //     profile: z.record(z.any()),
    //   },
    //   async ({ user_id, profile }) => {
    //     return await this.mcp.client.profiles.replace(user_id, profile);
    //   }
    // );

    // // Patch/merge a user profile (PATCH)
    // this.mcp.tool(
    //   'patch_user',
    //   'Patch/merge a user profile by user ID. Use JSON Patch operations.',
    //   {
    //     user_id: z.string(),
    //     patch: z.array(
    //       z.object({
    //         op: z.string(),
    //         path: z.string(),
    //         value: z.any().optional(),
    //       })
    //     ),
    //   },
    //   async ({ user_id, patch }) => {
    //     return await this.mcp.client.profiles.mergeProfile(user_id, { patch });
    //   }
    // );

    // // Delete a user profile
    // this.mcp.tool(
    //   'delete_user',
    //   'Delete a user profile by user ID.',
    //   {
    //     user_id: z.string(),
    //   },
    //   async ({ user_id }) => {
    //     return await this.mcp.client.profiles.delete(user_id);
    //   }
    // );

    // Get a user's list subscriptions by user_id
    this.mcp.tool(
      'get_user_list_subscriptions',
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
    this.mcp.tool(
      'subscribe_user_to_lists',
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
    this.mcp.tool(
      'delete_user_list_subscriptions',
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