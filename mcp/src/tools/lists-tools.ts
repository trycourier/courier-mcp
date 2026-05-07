import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class ListsTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'list_lists',
    'get_list',
    'get_list_subscribers',
    'create_list',
    'subscribe_user_to_list',
    'unsubscribe_user_from_list',
    'delete_list',
    'restore_list',
    'bulk_subscribe_to_list',
    'add_subscribers_to_list',
  ];

  public register() {

    this.registerToolIfNeeded(
      ListsTools.tools[0],
      "Get all lists. Optionally filter by pattern (e.g. 'example.list.*').",
      {
        pattern: z.string().optional().describe("Filter pattern (e.g. 'example.list.*')"),
        cursor: z.string().optional().describe('Pagination cursor'),
      },
      async ({ pattern, cursor }) => {
        return handleToolCall(() => {
          const query: Record<string, any> = {};
          if (pattern) query.pattern = pattern;
          if (cursor) query.cursor = cursor;
          return this.mcp.courier.lists.list(query);
        });
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      ListsTools.tools[1],
      "Get a list by its ID.",
      {
        list_id: z.string().describe('The list ID'),
      },
      async ({ list_id }) => {
        return handleToolCall(() => this.mcp.courier.lists.retrieve(list_id));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      ListsTools.tools[2],
      "Get all subscribers of a list.",
      {
        list_id: z.string().describe('The list ID'),
        cursor: z.string().optional().describe('Pagination cursor'),
      },
      async ({ list_id, cursor }) => {
        return handleToolCall(() => this.mcp.courier.lists.subscriptions.list(list_id, cursor ? { cursor } : {}));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      ListsTools.tools[3],
      "Create or update a list by list ID.",
      {
        list_id: z.string().describe('The list ID'),
        name: z.string().describe('Display name for the list'),
      },
      async ({ list_id, name }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.lists.update(list_id, { name });
          return { success: true, list_id, name };
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      ListsTools.tools[4],
      "Subscribe a user to a list. Creates the list if it doesn't exist.",
      {
        list_id: z.string().describe('The list ID'),
        user_id: z.string().describe('The user ID to subscribe'),
        preferences: z.object({
          categories: z.record(z.any()).optional(),
          notifications: z.record(z.any()).optional(),
        }).optional().describe('Optional notification preferences'),
      },
      async ({ list_id, user_id, preferences }) => {
        return handleToolCall(async () => {
          const params: Record<string, any> = { list_id };
          if (preferences) {
            params.preferences = {
              categories: preferences.categories ?? {},
              notifications: preferences.notifications ?? {},
            };
          }
          await this.mcp.courier.lists.subscriptions.subscribeUser(user_id, params as any);
          return { success: true, list_id, user_id };
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      ListsTools.tools[5],
      "Unsubscribe a user from a list.",
      {
        list_id: z.string().describe('The list ID'),
        user_id: z.string().describe('The user ID to unsubscribe'),
      },
      async ({ list_id, user_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.lists.subscriptions.unsubscribeUser(user_id, { list_id });
          return { success: true, message: `${user_id} unsubscribed from ${list_id}` };
        });
      },
      { destructiveHint: true, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      ListsTools.tools[6],
      "Delete a list by its ID.",
      {
        list_id: z.string().describe('The list ID'),
      },
      async ({ list_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.lists.delete(list_id);
          return { success: true, message: `List ${list_id} deleted` };
        });
      },
      { destructiveHint: true, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      ListsTools.tools[7],
      "Restore a previously deleted list.",
      {
        list_id: z.string().describe('The list ID'),
      },
      async ({ list_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.lists.restore(list_id, {});
          return { success: true, message: `List ${list_id} restored` };
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    const listRecipientsSchema = z.array(
      z.object({
        recipientId: z.string().describe('Recipient ID'),
      })
    ).describe('Recipients to set on the list');

    this.registerToolIfNeeded(
      ListsTools.tools[8],
      "Replace all subscribers on a list with the given recipients.",
      {
        list_id: z.string().describe('The list ID'),
        recipients: listRecipientsSchema,
      },
      async ({ list_id, recipients }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.lists.subscriptions.subscribe(list_id, { recipients });
          return { success: true, message: `Replaced subscribers on list ${list_id}` };
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      ListsTools.tools[9],
      "Append subscribers to a list without removing existing subscribers.",
      {
        list_id: z.string().describe('The list ID'),
        recipients: listRecipientsSchema,
      },
      async ({ list_id, recipients }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.lists.subscriptions.add(list_id, { recipients });
          return { success: true, message: `Added ${recipients.length} subscriber(s) to list ${list_id}` };
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );
  }
}
