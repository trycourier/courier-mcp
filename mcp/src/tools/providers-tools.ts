import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class ProvidersTools extends CourierMcpTools {

  /** Included in defaultTools (read-only). */
  static readonly tools: string[] = [
    'list_providers',
    'get_provider',
    'list_provider_catalog',
  ];

  /** Opt-in only; merged into allAvailableTools with ConfigTools. */
  static readonly optInTools: string[] = [
    'create_provider',
    'update_provider',
    'delete_provider',
  ];

  public register() {

    this.registerToolIfNeeded(
      ProvidersTools.tools[0],
      'List configured provider integrations for the workspace.',
      {
        cursor: z.string().optional().describe('Pagination cursor'),
      },
      async ({ cursor }) => {
        return handleToolCall(() => {
          const query: Record<string, any> = {};
          if (cursor) query.cursor = cursor;
          return this.mcp.courier.providers.list(query);
        });
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      ProvidersTools.tools[1],
      'Fetch a single provider configuration by ID.',
      {
        provider_id: z.string().describe('The provider configuration ID'),
      },
      async ({ provider_id }) => {
        return handleToolCall(() => this.mcp.courier.providers.retrieve(provider_id));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      ProvidersTools.tools[2],
      'List available provider types from the catalog with their configuration schemas.',
      {
        keys: z.string().optional().describe('Comma-separated provider keys to filter by'),
        name: z.string().optional().describe('Substring match on provider name'),
        channel: z.string().optional().describe('Filter by channel type (email, sms, push, etc.)'),
      },
      async ({ keys, name, channel }) => {
        return handleToolCall(() => {
          const query: Record<string, any> = {};
          if (keys) query.keys = keys;
          if (name) query.name = name;
          if (channel) query.channel = channel;
          return this.mcp.courier.providers.catalog.list(query);
        });
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      ProvidersTools.optInTools[0],
      'Create a new provider configuration. The provider field must be a known Courier provider key (see catalog).',
      {
        provider: z.string().describe('Provider key from the catalog (e.g. sendgrid, twilio, firebase-fcm)'),
        title: z.string().optional().describe('Display name for this provider configuration'),
        alias: z.string().optional().describe('Short alias for referencing this provider'),
        settings: z.record(z.any()).optional().describe('Provider-specific settings (API keys, credentials, etc.)'),
      },
      async ({ provider, title, alias, settings }) => {
        return handleToolCall(() => {
          const body: Record<string, any> = { provider };
          if (title !== undefined) body.title = title;
          if (alias !== undefined) body.alias = alias;
          if (settings) body.settings = settings;
          return this.mcp.courier.providers.create(body as any);
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      ProvidersTools.optInTools[1],
      'Replace an existing provider configuration. Full replacement — retrieve current config with get_provider first; omitted optional fields are cleared. Changing API keys or settings affects live delivery if this integration is in use.',
      {
        provider_id: z.string().describe('The provider configuration ID'),
        provider: z.string().describe('Provider key (must match existing; changing provider type is not supported)'),
        title: z.string().optional().describe('Display name'),
        alias: z.string().optional().describe('Short alias'),
        settings: z.record(z.any()).optional().describe('Provider-specific settings'),
      },
      async ({ provider_id, provider, title, alias, settings }) => {
        return handleToolCall(() => {
          const body: Record<string, any> = { provider };
          if (title !== undefined) body.title = title;
          if (alias !== undefined) body.alias = alias;
          if (settings) body.settings = settings;
          return this.mcp.courier.providers.update(provider_id, body as any);
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      ProvidersTools.optInTools[2],
      'Delete a provider configuration. Returns 409 if the provider is still referenced by routing or notifications.',
      {
        provider_id: z.string().describe('The provider configuration ID to delete'),
      },
      async ({ provider_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.providers.delete(provider_id);
          return { success: true, message: `Provider ${provider_id} deleted` };
        });
      },
      { destructiveHint: true, idempotentHint: true }
    );
  }
}
