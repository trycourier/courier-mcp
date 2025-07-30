import z from "zod";
import { CourierMcpTools } from "./tools.js";

export class ListsTools extends CourierMcpTools {
  public register() {
    // List all lists
    this.mcp.tool(
      "list_lists",
      "Returns all of the lists, with the ability to filter based on a pattern.",
      {
        pattern: z.string().optional(),
        cursor: z.string().optional(),
        limit: z.number().optional(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ pattern, cursor, limit }) => {
        const request: any = {};
        if (pattern !== undefined) request.pattern = pattern;
        if (cursor !== undefined) request.cursor = cursor;
        if (limit !== undefined) request.limit = limit;

        return await this.mcp.client.lists.list(request);
      }
    );

    // Get a list by ID
    this.mcp.tool(
      "get_list",
      "Returns a list based on the list ID provided.",
      {
        list_id: z.string(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ list_id }) => {
        return await this.mcp.client.lists.get(list_id);
      }
    );

    // Get list subscribers
    this.mcp.tool(
      "get_list_subscribers",
      "Get the list's subscriptions.",
      {
        list_id: z.string(),
        cursor: z.string().optional(),
        limit: z.number().optional(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ list_id, cursor, limit }) => {
        const request: any = {};
        if (cursor !== undefined) request.cursor = cursor;
        if (limit !== undefined) request.limit = limit;

        return await this.mcp.client.lists.getSubscribers(list_id, request);
      }
    );

    // // Subscribe a user to a list
    // this.mcp.tool(
    //   "subscribe_user_to_list",
    //   "Subscribe a user to an existing list (note: if the List does not exist, it will be automatically created).",
    //   {
    //     list_id: z.string(),
    //     user_id: z.string(),
    //     preferences: z.record(z.any()).optional(),
    //     timeout_in_seconds: z.number().optional(),
    //     max_retries: z.number().optional(),
    //   },
    //   async ({ list_id, user_id, preferences }) => {
    //     const request: any = {};
    //     if (preferences !== undefined) request.preferences = preferences;

    //     return await this.mcp.client.lists.subscribe(list_id, user_id, request);
    //   }
    // );

    // // Unsubscribe a user from a list
    // this.mcp.tool(
    //   "unsubscribe_user_from_list",
    //   "Delete a subscription to a list by list ID and user ID.",
    //   {
    //     list_id: z.string(),
    //     user_id: z.string(),
    //     timeout_in_seconds: z.number().optional(),
    //     max_retries: z.number().optional(),
    //   },
    //   async ({ list_id, user_id }) => {
    //     return await this.mcp.client.lists.unsubscribe(list_id, user_id);
    //   }
    // );
  }
}
