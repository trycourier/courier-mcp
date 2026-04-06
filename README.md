# Courier MCP Server

The official [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) server for the [Courier](https://www.courier.com) notification API. It gives AI agents full access to the Courier API — send messages, manage profiles, debug deliveries, configure lists, and more — through 60 tools backed by the [`@trycourier/courier`](https://www.npmjs.com/package/@trycourier/courier) Node SDK.

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

59 default tools organized by API resource, plus 1 diagnostic tool available in local installs.

### Default tools

| Category | Tools |
|----------|-------|
| **Send** | `send_message`, `send_message_template`, `send_message_to_list`, `send_message_to_list_template` |
| **Messages** | `list_messages`, `get_message`, `get_message_content`, `get_message_history`, `cancel_message` |
| **Profiles** | `get_user_profile_by_id`, `create_or_merge_user`, `replace_profile`, `delete_profile`, `get_user_list_subscriptions`, `subscribe_user_to_lists`, `delete_user_list_subscriptions` |
| **Lists** | `list_lists`, `get_list`, `get_list_subscribers`, `create_list`, `subscribe_user_to_list`, `unsubscribe_user_from_list` |
| **Audiences** | `get_audience`, `list_audience_members`, `list_audiences`, `update_audience`, `delete_audience` |
| **Notifications** | `list_notifications`, `get_notification_content`, `get_notification_draft_content` |
| **Brands** | `create_brand`, `get_brand`, `list_brands` |
| **Auth** | `generate_jwt_for_user` |
| **User Tokens** | `list_user_push_tokens`, `get_user_push_token`, `create_or_replace_user_push_token` |
| **Docs** | `courier_installation_guide` |
| **Automations** | `invoke_automation_template`, `invoke_ad_hoc_automation` |
| **Bulk** | `create_bulk_job`, `add_bulk_users`, `run_bulk_job`, `get_bulk_job`, `list_bulk_users` |
| **Audit Events** | `get_audit_event`, `list_audit_events` |
| **Inbound** | `track_inbound_event` |
| **Tenants** | `get_tenant`, `create_or_update_tenant`, `list_tenants`, `delete_tenant` |
| **Users** | `get_user_preferences`, `update_user_preference_topic`, `list_user_tenants`, `add_user_to_tenant`, `remove_user_from_tenant` |
| **Translations** | `get_translation`, `update_translation` |

### Diagnostic tools (local only)

| Category | Tools |
|----------|-------|
| **Config** | `get_environment_config` — check which API key, base URL, and package version the MCP session is using |

## Architecture

```
courier-mcp/
├── mcp/                    # MCP package (@trycourier/courier-mcp on npm)
│   └── src/
│       ├── index.ts        # CourierMcp server class
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
