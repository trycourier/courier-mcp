# Courier MCP Server

The official [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) server for the [Courier](https://www.courier.com) notification API. It gives AI agents full access to the Courier API — send messages, manage profiles, debug deliveries, configure lists, and more — through 124 tools backed by the [`@trycourier/courier`](https://www.npmjs.com/package/@trycourier/courier) Node SDK.

## Install

### Hosted (recommended)

Courier runs a hosted MCP server at `https://mcp.courier.com`. No local setup required.

<a href="https://cursor.com/en/install-mcp?name=Courier&config=eyJ1cmwiOiAiaHR0cHM6Ly9tY3AuY291cmllci5jb20iLCAiaGVhZGVycyI6IHsiYXBpX2tleSI6ICJZb3VyIEFQSSBLZXkifX0="><img src="https://cursor.com/deeplink/mcp-install-dark.svg" alt="Install in Cursor" height="32" /></a>

**Cursor** — add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "Courier": {
      "url": "https://mcp.courier.com",
      "headers": {
        "api_key": "YOUR_COURIER_API_KEY"
      }
    }
  }
}
```

**Claude Code:**

```bash
claude mcp add Courier --transport http --url https://mcp.courier.com --header "api_key: YOUR_COURIER_API_KEY"
```

**Claude Desktop** — add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "Courier": {
      "url": "https://mcp.courier.com",
      "headers": {
        "api_key": "YOUR_COURIER_API_KEY"
      }
    }
  }
}
```

### Local development

```bash
git clone https://github.com/trycourier/courier-mcp.git
cd courier-mcp
sh dev.sh
```

Then point your IDE at `http://localhost:3000` with the same config format above.

## Tools

123 default tools organized by API resource, plus 1 diagnostic tool available in local installs.

### Default tools

| Category | Tools |
|----------|-------|
| **Send** | `send_message`, `send_message_template`, `send_message_to_list`, `send_message_to_list_template` |
| **Messages** | `list_messages`, `get_message`, `get_message_content`, `get_message_history`, `cancel_message` |
| **Profiles** | `get_user_profile_by_id`, `create_or_merge_user`, `replace_profile`, `patch_profile`, `delete_profile`, `get_user_list_subscriptions`, `subscribe_user_to_lists`, `delete_user_list_subscriptions` |
| **Lists** | `list_lists`, `get_list`, `get_list_subscribers`, `create_list`, `delete_list`, `restore_list`, `subscribe_user_to_list`, `unsubscribe_user_from_list`, `bulk_subscribe_to_list`, `add_subscribers_to_list` |
| **Audiences** | `get_audience`, `list_audience_members`, `list_audiences`, `update_audience`, `delete_audience` |
| **Notifications** | `list_notifications`, `get_notification`, `get_notification_content`, `get_notification_draft_content`, `create_notification`, `replace_notification`, `archive_notification`, `publish_notification`, `list_notification_versions`, `list_notification_checks`, `update_notification_checks`, `put_notification_content`, `put_notification_element`, `put_notification_locale`, `cancel_notification_submission` |
| **Brands** | `create_brand`, `get_brand`, `list_brands`, `update_brand`, `delete_brand` |
| **Auth** | `generate_jwt_for_user` |
| **Device Tokens** | `list_user_push_tokens`, `get_user_push_token`, `create_or_replace_user_push_token`, `bulk_add_user_tokens`, `patch_user_token`, `delete_user_token` |
| **Docs** | `courier_installation_guide` |
| **Automations** | `invoke_automation_template`, `invoke_ad_hoc_automation`, `list_automations`, `cancel_automation` |
| **Bulk** | `create_bulk_job`, `add_bulk_users`, `run_bulk_job`, `get_bulk_job`, `list_bulk_users` |
| **Audit Events** | `get_audit_event`, `list_audit_events` |
| **Inbound** | `track_inbound_event` |
| **Tenants** | `get_tenant`, `create_or_update_tenant`, `list_tenants`, `delete_tenant`, `list_tenant_users`, `update_tenant_preference`, `delete_tenant_preference`, `list_tenant_templates`, `get_tenant_template`, `replace_tenant_template`, `publish_tenant_template`, `get_tenant_template_version`, `delete_tenant_template` |
| **Users** | `get_user_preferences`, `get_user_preference_topic`, `update_user_preference_topic`, `list_user_tenants`, `add_user_to_tenant`, `remove_user_from_tenant`, `bulk_add_user_tenants`, `remove_all_user_tenants` |
| **Routing Strategies** | `create_routing_strategy`, `get_routing_strategy`, `replace_routing_strategy`, `archive_routing_strategy`, `list_routing_strategies`, `list_routing_strategy_notifications` |
| **Journeys** | `list_journeys`, `invoke_journey`, `create_journey`, `get_journey`, `replace_journey`, `publish_journey`, `archive_journey`, `list_journey_versions`, `list_journey_templates`, `create_journey_template`, `get_journey_template`, `replace_journey_template`, `archive_journey_template`, `publish_journey_template`, `list_journey_template_versions` |
| **Requests** | `archive_request` |
| **Providers** | `list_providers`, `get_provider`, `list_provider_catalog`, `create_provider`, `update_provider`, `delete_provider` |
| **Translations** | `get_translation`, `update_translation` |

### Diagnostic tools (local only)

| Category | Tools |
|----------|-------|
| **Config** | `get_environment_config` — check which API key, base URL, and package version the MCP session is using |

### Safer defaults (optional client policies)

Tools that send live traffic, carry `destructiveHint` in MCP annotations, or mutate provider integrations are listed in code as `RECOMMENDED_CLIENT_DISABLED_TOOLS` ([source](mcp/src/policy/recommended-client-disabled-tools.ts)). Export it from `@trycourier/courier-mcp` if you want to drive codegen or docs. Teams typically paste subsets into **Claude Code** (`permissions.deny` / `mcp__<serverName>__<toolName>`) or **Codex** (`[mcp_servers.<name>.disabled_tools]` in `config.toml`). This does not change hosted MCP behavior until each client applies its own policy.

## Architecture

```
courier-mcp/
├── mcp/                    # MCP package (@trycourier/courier-mcp on npm)
│   └── src/
│       ├── index.ts        # CourierMcp server class
│       ├── policy/         # Optional client policy helpers (e.g. recommended disable list)
│       ├── tools/          # Tool definitions (one file per API resource)
│       └── utils/          # Config, error handling, registry
├── server/                 # Express server (hosts the MCP package via HTTP)
│   └── src/index.ts        # Stateless HTTP handler
└── dev.sh                  # Local development launcher
```

The MCP package uses the official `@trycourier/courier` Node SDK (Stainless-generated) for all API calls. The SDK stays in sync with the Courier API spec automatically, so tool implementations are thin wrappers with proper error handling.

## Configuration

| Header | Required | Description |
|--------|----------|-------------|
| `api_key` | Yes | Your Courier API key. Get one at [app.courier.com/settings/api-keys](https://app.courier.com/settings/api-keys). |
| `base_url` | No | Override the API base URL. Defaults to `https://api.courier.com`. |

## Development

```bash
# Install dependencies
cd mcp && npm install && cd ../server && npm install && cd ..

# Start development server
sh dev.sh

# Run tests
cd mcp && npm test

# Build
cd mcp && npm run build
```

## SDK dependency updates

The `@trycourier/courier` SDK dependency in `mcp/` is updated automatically via [Dependabot](https://docs.github.com/en/code-security/dependabot). Dependabot checks npm daily and opens a PR when a new SDK version is available.

- **Patch/minor bumps**: review CI status, then merge.
- **Major bumps** (labeled `breaking-review`): check whether any tool input schemas or error handling need updates before merging.

After merging a Dependabot PR, the full pipeline runs automatically:

1. `auto-version-bump.yml` bumps the MCP package patch version and pushes to main.
2. `publish-npm.yml` publishes the new version to npm.
3. `bump-services.yml` opens a PR in `trycourier/services` to update the hosted MCP server.

**Secrets required** (set in repo Settings > Secrets and variables > Actions):

- `REPO_TOKEN` — PAT with `Contents: Read and write` on this repo. Used by `auto-version-bump.yml` to push to main and trigger downstream workflows.
- `SERVICES_REPO_TOKEN` — PAT with `Contents: Read and write` + `Pull requests: Read and write` on `trycourier/services`. Used by `bump-services.yml` to open dependency bump PRs.
- `NPM_TOKEN` — npm publish token. Used by `publish-npm.yml`.

## Links

- [Courier docs](https://www.courier.com/docs/)
- [MCP documentation page](https://www.courier.com/docs/tools/mcp/)
- [AI developer tools overview](https://www.courier.com/docs/tools/ai-onboarding/)
- [Courier Node SDK](https://github.com/trycourier/courier-node)
- [MCP protocol spec](https://modelcontextprotocol.io/)
