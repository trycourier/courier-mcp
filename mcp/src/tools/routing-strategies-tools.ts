import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class RoutingStrategiesTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'create_routing_strategy',
    'get_routing_strategy',
    'replace_routing_strategy',
    'archive_routing_strategy',
    'list_routing_strategies',
    'list_routing_strategy_notifications',
  ];

  public register() {

    this.registerToolIfNeeded(
      RoutingStrategiesTools.tools[0],
      'Create a routing strategy defining how notifications are delivered across channels and providers.',
      {
        name: z.string().describe('Human-readable name for the routing strategy'),
        routing: z.object({
          method: z.enum(['all', 'single']).describe('Deliver to all channels or stop after first success'),
          channels: z.array(z.string()).describe('Ordered list of channel names'),
        }).describe('Routing tree defining channel selection method and order'),
        channels: z.record(z.any()).optional().describe('Per-channel delivery configuration'),
        providers: z.record(z.any()).optional().describe('Per-provider delivery configuration'),
        description: z.string().optional().describe('Description of the routing strategy'),
        tags: z.array(z.string()).optional().describe('Tags for categorization'),
      },
      async ({ name, routing, channels, providers, description, tags }) => {
        return handleToolCall(() => {
          const body: Record<string, any> = { name, routing };
          if (channels) body.channels = channels;
          if (providers) body.providers = providers;
          if (description !== undefined) body.description = description;
          if (tags !== undefined) body.tags = tags;
          return this.mcp.courier.routingStrategies.create(body as any);
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      RoutingStrategiesTools.tools[1],
      'Retrieve a routing strategy by ID. Returns the full entity including routing, channels, and providers.',
      {
        routing_strategy_id: z.string().describe('The routing strategy ID (rs_ prefix)'),
      },
      async ({ routing_strategy_id }) => {
        return handleToolCall(() => this.mcp.courier.routingStrategies.retrieve(routing_strategy_id));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      RoutingStrategiesTools.tools[2],
      'Replace a routing strategy. Full document replacement; missing optional fields are cleared.',
      {
        routing_strategy_id: z.string().describe('The routing strategy ID'),
        name: z.string().describe('Human-readable name'),
        routing: z.object({
          method: z.enum(['all', 'single']).describe('Deliver to all channels or stop after first success'),
          channels: z.array(z.string()).describe('Ordered list of channel names'),
        }).describe('Routing tree'),
        channels: z.record(z.any()).optional().describe('Per-channel delivery configuration. Omit to clear.'),
        providers: z.record(z.any()).optional().describe('Per-provider delivery configuration. Omit to clear.'),
        description: z.string().optional().describe('Description. Omit to clear.'),
        tags: z.array(z.string()).optional().describe('Tags. Omit to clear.'),
      },
      async ({ routing_strategy_id, name, routing, channels, providers, description, tags }) => {
        return handleToolCall(() => {
          const body: Record<string, any> = { name, routing };
          if (channels) body.channels = channels;
          if (providers) body.providers = providers;
          if (description !== undefined) body.description = description;
          if (tags !== undefined) body.tags = tags;
          return this.mcp.courier.routingStrategies.replace(routing_strategy_id, body as any);
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      RoutingStrategiesTools.tools[3],
      'Archive a routing strategy. The strategy must not have associated notification templates; unlink all templates before archiving.',
      {
        routing_strategy_id: z.string().describe('The routing strategy ID to archive'),
      },
      async ({ routing_strategy_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.routingStrategies.archive(routing_strategy_id);
          return { success: true, message: `Routing strategy ${routing_strategy_id} archived` };
        });
      },
      { destructiveHint: true, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      RoutingStrategiesTools.tools[4],
      'List routing strategies in the workspace. Returns metadata only; use get for full details.',
      {
        cursor: z.string().optional().describe('Pagination cursor'),
        limit: z.number().optional().describe('Max results per page (default 20, max 100)'),
      },
      async ({ cursor, limit }) => {
        return handleToolCall(() => {
          const query: Record<string, any> = {};
          if (cursor) query.cursor = cursor;
          if (limit) query.limit = limit;
          return this.mcp.courier.routingStrategies.list(query);
        });
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      RoutingStrategiesTools.tools[5],
      'List notification templates associated with a routing strategy. Useful for checking linked templates before archiving.',
      {
        routing_strategy_id: z.string().describe('The routing strategy ID (rs_ prefix)'),
        cursor: z.string().optional().describe('Pagination cursor'),
        limit: z.number().optional().describe('Max results per page (default 20, max 100)'),
      },
      async ({ routing_strategy_id, cursor, limit }) => {
        return handleToolCall(() => {
          const query: Record<string, any> = {};
          if (cursor) query.cursor = cursor;
          if (limit) query.limit = limit;
          return this.mcp.courier.routingStrategies.listNotifications(routing_strategy_id, query);
        });
      },
      { readOnlyHint: true }
    );
  }
}
