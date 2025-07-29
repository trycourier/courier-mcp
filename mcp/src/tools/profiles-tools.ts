import z from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";

export class ProfilesTools extends CourierMcpTools {

  public register() {
    // Get a user profile by user_id
    this.server.tool(
      'get_user',
      'Get a user by their ID',
      {
        user_id: z.string(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ user_id, timeout_in_seconds, max_retries }) => {
        try {
          const requestOptions: any = {};
          if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
          if (max_retries !== undefined) requestOptions.maxRetries = max_retries;
          const response = await this.server.courierClient.profiles.get(user_id, requestOptions);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response, null, 2),
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(err, null, 2),
              },
            ],
          };
        }
      }
    );

    // Create or merge a user profile
    this.server.tool(
      'create_or_merge_user',
      'Create or merge a user profile by user ID. Merges supplied values with an existing profile or creates a new one.',
      {
        user_id: z.string(),
        profile: z.record(z.any()),
        idempotency_key: z.string().optional(),
        idempotency_expiry: z.string().optional(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ user_id, profile, idempotency_key, idempotency_expiry, timeout_in_seconds, max_retries }) => {
        try {
          const request = { profile };
          const requestOptions: any = {};
          if (idempotency_key !== undefined) requestOptions.idempotencyKey = idempotency_key;
          if (idempotency_expiry !== undefined) requestOptions.idempotencyExpiry = idempotency_expiry;
          if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
          if (max_retries !== undefined) requestOptions.maxRetries = max_retries;
          const response = await this.server.courierClient.profiles.create(user_id, request, requestOptions);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response, null, 2),
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(err, null, 2),
              },
            ],
          };
        }
      }
    );

    // // Replace a user profile (PUT)
    // this.server.tool(
    //   'replace_user',
    //   'Replace a user profile by user ID. This is a full replacement (PUT).',
    //   {
    //     user_id: z.string(),
    //     profile: z.record(z.any()),
    //     timeout_in_seconds: z.number().optional(),
    //     max_retries: z.number().optional(),
    //   },
    //   async ({ user_id, profile, timeout_in_seconds, max_retries }) => {
    //     try {
    //       const request = { profile };
    //       const requestOptions: any = {};
    //       if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
    //       if (max_retries !== undefined) requestOptions.maxRetries = max_retries;
    //       const response = await this.server.courierClient.profiles.replace(user_id, request, requestOptions);
    //       return {
    //         content: [
    //           {
    //             type: 'text',
    //             text: JSON.stringify(response, null, 2),
    //           },
    //         ],
    //       };
    //     } catch (err: any) {
    //       return {
    //         content: [
    //           {
    //             type: 'text',
    //             text: JSON.stringify(err, null, 2),
    //           },
    //         ],
    //       };
    //     }
    //   }
    // );

    // // Patch/merge a user profile (PATCH)
    // this.server.tool(
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
    //     timeout_in_seconds: z.number().optional(),
    //     max_retries: z.number().optional(),
    //   },
    //   async ({ user_id, patch, timeout_in_seconds, max_retries }) => {
    //     try {
    //       const request = { patch };
    //       const requestOptions: any = {};
    //       if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
    //       if (max_retries !== undefined) requestOptions.maxRetries = max_retries;
    //       const response = await this.server.courierClient.profiles.mergeProfile(user_id, request, requestOptions);
    //       return {
    //         content: [
    //           {
    //             type: 'text',
    //             text: JSON.stringify(response, null, 2),
    //           },
    //         ],
    //       };
    //     } catch (err: any) {
    //       return {
    //         content: [
    //           {
    //             type: 'text',
    //             text: JSON.stringify(err, null, 2),
    //           },
    //         ],
    //       };
    //     }
    //   }
    // );

    // // Delete a user profile
    // this.server.tool(
    //   'delete_user',
    //   'Delete a user profile by user ID.',
    //   {
    //     user_id: z.string(),
    //     timeout_in_seconds: z.number().optional(),
    //     max_retries: z.number().optional(),
    //   },
    //   async ({ user_id, timeout_in_seconds, max_retries }) => {
    //     try {
    //       const requestOptions: any = {};
    //       if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
    //       if (max_retries !== undefined) requestOptions.maxRetries = max_retries;
    //       await this.server.courierClient.profiles.delete(user_id, requestOptions);
    //       return {
    //         content: [
    //           {
    //             type: 'text',
    //             text: `User '${user_id}' deleted successfully.`,
    //           },
    //         ],
    //       };
    //     } catch (err: any) {
    //       return {
    //         content: [
    //           {
    //             type: 'text',
    //             text: JSON.stringify(err, null, 2),
    //           },
    //         ],
    //       };
    //     }
    //   }
    // );

    // Get a user's list subscriptions by user_id
    this.server.tool(
      'get_user_list_subscriptions',
      'Get the list subscriptions for a user by their ID',
      {
        user_id: z.string(),
        request: z.object({
          cursor: z.string().optional(),
          limit: z.number().optional(),
        }).optional(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ user_id, request, timeout_in_seconds, max_retries }) => {
        try {
          const requestOptions: any = {};
          if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
          if (max_retries !== undefined) requestOptions.maxRetries = max_retries;
          const response = await this.server.courierClient.profiles.getListSubscriptions(user_id, request, requestOptions);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response, null, 2),
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(err, null, 2),
              },
            ],
          };
        }
      }
    );

    // // Subscribe a user to lists
    // this.server.tool(
    //   'subscribe_user_to_lists',
    //   'Subscribe a user to one or more lists. If the list does not exist, it will be created.',
    //   {
    //     user_id: z.string(),
    //     lists: z.array(
    //       z.object({
    //         listId: z.string(),
    //         preferences: z.any().optional(),
    //       })
    //     ),
    //     idempotency_key: z.string().optional(),
    //     idempotency_expiry: z.string().optional(),
    //     timeout_in_seconds: z.number().optional(),
    //     max_retries: z.number().optional(),
    //   },
    //   async ({ user_id, lists, idempotency_key, idempotency_expiry, timeout_in_seconds, max_retries }) => {
    //     try {
    //       const request = { lists };
    //       const requestOptions: any = {};
    //       if (idempotency_key !== undefined) requestOptions.idempotencyKey = idempotency_key;
    //       if (idempotency_expiry !== undefined) requestOptions.idempotencyExpiry = idempotency_expiry;
    //       if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
    //       if (max_retries !== undefined) requestOptions.maxRetries = max_retries;
    //       const response = await this.server.courierClient.profiles.subscribeToLists(user_id, request, requestOptions);
    //       return {
    //         content: [
    //           {
    //             type: 'text',
    //             text: JSON.stringify(response, null, 2),
    //           },
    //         ],
    //       };
    //     } catch (err: any) {
    //       return {
    //         content: [
    //           {
    //             type: 'text',
    //             text: JSON.stringify(err, null, 2),
    //           },
    //         ],
    //       };
    //     }
    //   }
    // );

    // // Delete all list subscriptions for a user
    // this.server.tool(
    //   'delete_user_list_subscriptions',
    //   'Delete all list subscriptions for a user by their ID.',
    //   {
    //     user_id: z.string(),
    //     timeout_in_seconds: z.number().optional(),
    //     max_retries: z.number().optional(),
    //   },
    //   async ({ user_id, timeout_in_seconds, max_retries }) => {
    //     try {
    //       const requestOptions: any = {};
    //       if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
    //       if (max_retries !== undefined) requestOptions.maxRetries = max_retries;
    //       const response = await this.server.courierClient.profiles.deleteListSubscription(user_id, requestOptions);
    //       return {
    //         content: [
    //           {
    //             type: 'text',
    //             text: JSON.stringify(response, null, 2),
    //           },
    //         ],
    //       };
    //     } catch (err: any) {
    //       return {
    //         content: [
    //           {
    //             type: 'text',
    //             text: JSON.stringify(err, null, 2),
    //           },
    //         ],
    //       };
    //     }
    //   }
    // );
  }
}