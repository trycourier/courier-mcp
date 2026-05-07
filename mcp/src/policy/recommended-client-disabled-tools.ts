import { SendTools } from "../tools/send-tools.js";

/**
 * Tools that register with {@link https://modelcontextprotocol.io/docs/concepts/tools#annotations destructiveHint}
 * in this package. Keep in sync when adding or renaming tools.
 */
const DESTRUCTIVE_HINT_TOOLS: readonly string[] = [
  "archive_notification",
  "archive_request",
  "archive_routing_strategy",
  "cancel_message",
  "cancel_notification_submission",
  "delete_audience",
  "delete_brand",
  "delete_list",
  "delete_profile",
  "delete_provider",
  "delete_tenant",
  "delete_tenant_preference",
  "delete_user_list_subscriptions",
  "delete_user_token",
  "remove_all_user_tenants",
  "remove_user_from_tenant",
  "replace_profile",
  "unsubscribe_user_from_list",
];

/** Provider integration mutations (omit delete_provider — listed in {@link DESTRUCTIVE_HINT_TOOLS}). */
const PROVIDER_INTEGRATION_MUTATIONS: readonly string[] = ["create_provider", "update_provider"];

function sortedUnique(names: Iterable<string>): readonly string[] {
  return [...new Set(names)].sort((a, b) => a.localeCompare(b));
}

/**
 * Canonical list of tool names to suggest disabling in **client** MCP policies when teams want
 * stricter defaults (e.g. Claude Code `permissions.deny` with `mcp__<server>__<tool>` patterns,
 * OpenAI Codex `[mcp_servers.<name>.disabled_tools]`).
 *
 * Includes: every tool registered with `destructiveHint`, all `send_*` tools, and provider
 * create/update. It does **not** change server behavior; consumers opt in via their editor config.
 */
export const RECOMMENDED_CLIENT_DISABLED_TOOLS: readonly string[] = sortedUnique([
  ...SendTools.tools,
  ...PROVIDER_INTEGRATION_MUTATIONS,
  ...DESTRUCTIVE_HINT_TOOLS,
]);
