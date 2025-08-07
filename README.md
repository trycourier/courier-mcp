# Install Courier MCP

To get your `api_key`, go to the [Courier API Key settings page](https://app.courier.com/settings/api-keys).

## Cursor

In Cursor, go to:
1. Cursor > Cursor Settings > Tools & Integrations > MCP Tools > New MCP Server
2. Add the following to your `mcp.json`

```json
{
  "mcpServers": {
    "courier": {
      "url": "TODO/mcp",
      "headers": {
        "api_key": "XXXX"
      }
    }
  }
}
```

## Claude Code

In a terminal, type the following command:

```bash
claude mcp add --transport http Courier TODO/mcp --header api_key:XXXX
```

## Claude Desktop

In Claude Desktop, go to:
1. Claude > Settings > Developer > Edit Config
2. Open `claude_desktop_condig.json`
3. Add the following to your `claude_desktop_condig.json`

```json
{
  "mcpServers": {
    "courier": {
		"command": "npx",
        "args": ["-y", "mcp-remote", "TODO/mcp"],
        "headers": {
        	"api_key": "XXXX"
        }
    }
  }
}
```

## Windsurf

In Windsurf, go to:
1. Windsurf > Windsurf Settings > Manage MCP Servers > View Raw Config
2. Add the following to your `mcp_config.json`

```json
{
  "mcpServers": {
    "courier": {
      "serverUrl": "TODO/mcp",
      "headers": {
        "api_key": "XXXX"
      },
      "disabled": false,
      "disabledTools": []
    }
  }
}
```

## VSCode

In a VSCode project:
1. Create the file `.vscode/mcp.json` if you don't already have one
2. Add the snippet below

VSCode works best when starting questions with `"#"` in the chat. For example, try getting a user from Courier with `#get_user_profile_by_id example_user_id`.

```json
{
	"inputs": [
		{
			"type": "promptString",
			"id": "courier-api-key",
			"description": "API key for Courier service",
			"password": true
		}
	],
	"servers": {
		"courier": {
			"url": "TODO/mcp",
			"type": "http",
			"headers": {
				"api_key": "${input:courier-api-key}"
			}
		}
	}
}
```

3. Open the chat window on the right
4. Click the Gear icon in the top right, then click MCP Servers
5. In the bottom right, click the gear next to "courier", then click "Start Server"

## OpenAI API

```ts
const response = await your_open_ai_client.responses.create({
  model: 'gpt-4o-mini',
  input: 'Get user mike from courier',
  tools: [
	{
	  type: 'mcp',
	  server_label: 'courier',
	  server_url: 'TODO',
	  headers: {
		api_key: 'XXXX',
	  },
	  allowed_tools: ['get_user_profile_by_id'],
	  require_approval: 'never',
	},
  ],
});
```

## Available Tools

## Available Tools by Category

### 📤 Message Sending
<table>
<tr>
<th width="320px" align="left">Tool ID</th>
<th width="900px" align="left">Description</th>
</tr>
<tr>
<td width="500px" align="left"><a href="https://www.courier.com/docs/reference/send/message/"><code>send_message</code></a></td>
<td align="left">Send a message using title and body (no template)</td>
</tr>
<tr>
<td width="500px" align="left"><a href="https://www.courier.com/docs/reference/send/message/"><code>send_message_template</code></a></td>
<td align="left">Send a message using a predefined template</td>
</tr>
</table>

### 👤 Profile Management
<table>
<tr>
<th width="320px" align="left">Tool ID</th>
<th width="900px" align="left">Description</th>
</tr>
<tr>
<td width="500px" align="left"><a href="https://www.courier.com/docs/reference/profiles/by-id"><code>get_user_profile_by_id</code></a></td>
<td align="left">Get a user profile by their ID</td>
</tr>
<tr>
<td width="500px" align="left"><a href="https://www.courier.com/docs/reference/profiles/create"><code>create_or_merge_user</code></a></td>
<td align="left">Create or merge a user profile by user ID</td>
</tr>
<tr>
<td width="500px" align="left"><a href="https://www.courier.com/docs/reference/profiles/subscribed-list"><code>get_user_list_subscriptions</code></a></td>
<td align="left">Get the list subscriptions for a user by their ID</td>
</tr>
<tr>
<td width="500px" align="left"><a href="https://www.courier.com/docs/reference/profiles/subscribe-to-list"><code>subscribe_user_to_lists</code></a></td>
<td align="left">Subscribe a user to one or more lists</td>
</tr>
<tr>
<td width="500px" align="left"><a href="https://www.courier.com/docs/reference/profiles/remove-subscription"><code>delete_user_list_subscriptions</code></a></td>
<td align="left">Delete all list subscriptions for a user by their ID</td>
</tr>
</table>

### 📋 List Management
<table>
<tr>
<th width="400px" align="left">Tool ID</th>
<th width="900px" align="left">Description</th>
</tr>
<tr>
<td align="left"><a href="https://www.courier.com/docs/reference/lists/list"><code>list_lists</code></a></td>
<td align="left">Returns all lists with optional pattern filtering</td>
</tr>
<tr>
<td align="left"><a href="https://www.courier.com/docs/reference/lists/by-id"><code>get_list</code></a></td>
<td align="left">Returns a list based on the list ID provided</td>
</tr>
<tr>
<td align="left"><a href="https://www.courier.com/docs/reference/lists/subscriptions"><code>get_list_subscribers</code></a></td>
<td align="left">Get the list's subscriptions</td>
</tr>
</table>

### 👥 Audience Management
<table>
<tr>
<th width="400px" align="left">Tool ID</th>
<th width="900px" align="left">Description</th>
</tr>
<tr>
<td align="left"><a href="https://www.courier.com/docs/reference/audiences/by-id"><code>get_audience</code></a></td>
<td align="left">Get an audience by its ID</td>
</tr>
<tr>
<td align="left"><a href="https://www.courier.com/docs/reference/audiences/list-audience-members"><code>list_audience_members</code></a></td>
<td align="left">List members of an audience by its ID</td>
</tr>
<tr>
<td align="left"><a href="https://www.courier.com/docs/reference/audiences/list-audiences"><code>list_audiences</code></a></td>
<td align="left">List all audiences associated with the authorization token</td>
</tr>
</table>

### 🔐 Authentication
<table>
<tr>
<th width="400px" align="left">Tool ID</th>
<th width="900px" align="left">Description</th>
</tr>
<tr>
<td align="left"><a href="https://www.courier.com/docs/reference/auth/issue-token"><code>issue_token</code></a></td>
<td align="left">Generate a JWT authentication token for Courier</td>
</tr>
</table>

### 🔑 User Token Management
<table>
<tr>
<th width="400px" align="left">Tool ID</th>
<th width="900px" align="left">Description</th>
</tr>
<tr>
<td align="left"><a href="https://www.courier.com/docs/reference/token-management/get-tokens"><code>list_user_tokens</code></a></td>
<td align="left">List all tokens for a given user</td>
</tr>
<tr>
<td align="left"><a href="https://www.courier.com/docs/reference/token-management/get-token"><code>get_user_token</code></a></td>
<td align="left">Get a specific token for a given user</td>
</tr>
<tr>
<td align="left"><a href="https://www.courier.com/docs/reference/token-management/put-token"><code>create_or_replace_user_token</code></a></td>
<td align="left">Create or replace a specific token for a given user</td>
</tr>
</table>

### ⚡ Automation
<table>
<tr>
<th width="400px" align="left">Tool ID</th>
<th width="900px" align="left">Description</th>
</tr>
<tr>
<td align="left"><a href="https://www.courier.com/docs/reference/automation/invoke-template"><code>invoke_automation_template</code></a></td>
<td align="left">Invoke an automation run from an automation template</td>
</tr>
</table>

### 🎨 Brand Management
<table>
<tr>
<th width="400px" align="left">Tool ID</th>
<th width="900px" align="left">Description</th>
</tr>
<tr>
<td align="left"><a href="https://www.courier.com/docs/reference/brands/create-a-brand"><code>create_brand</code></a></td>
<td align="left">Create a new brand</td>
</tr>
<tr>
<td align="left"><a href="https://www.courier.com/docs/reference/brands/get-a-brand"><code>get_brand</code></a></td>
<td align="left">Fetch a specific brand by brand ID</td>
</tr>
<tr>
<td align="left"><a href="https://www.courier.com/docs/reference/brands/list-brands"><code>list_brands</code></a></td>
<td align="left">Get the list of brands</td>
</tr>
</table>

### 📥 Inbound Events
<table>
<tr>
<th width="400px" align="left">Tool ID</th>
<th width="900px" align="left">Description</th>
</tr>
<tr>
<td align="left"><a href="hhttps://www.courier.com/docs/reference/inbound/courier-track-event"><code>track_inbound_event</code></a></td>
<td align="left">Track an inbound event</td>
</tr>
</table>

### 💬 Message Management
<table>
<tr>
<th width="400px" align="left">Tool ID</th>
<th width="900px" align="left">Description</th>
</tr>
<tr>
<td align="left"><a href="https://www.courier.com/docs/reference/logs/list"><code>list_messages</code></a></td>
<td align="left">Fetch the statuses of messages you've previously sent</td>
</tr>
<tr>
<td align="left"><a href="https://www.courier.com/docs/reference/logs/by-id"><code>get_message</code></a></td>
<td align="left">Fetch the status of a message you've previously sent</td>
</tr>
<tr>
<td align="left"><a href="https://www.courier.com/docs/reference/logs/output-by-id"><code>get_message_content</code></a></td>
<td align="left">Fetch the rendered content of a message you've previously sent</td>
</tr>
</table>

### 🔔 Notification Management
<table>
<tr>
<th width="400px" align="left">Tool ID</th>
<th width="900px" align="left">Description</th>
</tr>
<tr>
<td align="left"><a href="https://www.courier.com/docs/reference/notifications/get-notifications"><code>list_notifications</code></a></td>
<td align="left">List notifications with optional filtering</td>
</tr>
<tr>
<td align="left"><a href="https://www.courier.com/docs/reference/notifications/get-notifications-content"><code>get_notification_content</code></a></td>
<td align="left">Get the content of a notification by its ID</td>
</tr>
<tr>
<td align="left"><a href="https://www.courier.com/docs/reference/notifications/get-notifications-draftcontent"><code>get_notification_draft_content</code></a></td>
<td align="left">Get the draft content of a notification by its ID</td>
</tr>
</table>

### 📚 Documentation & Installation Guides
<table>
<tr>
<th width="400px" align="left">Tool ID</th>
<th width="900px" align="left">Description</th>
</tr>
<tr>
<td align="left"><code>flutter_installation_guide</code></a></td>
<td align="left">Flutter SDK integration instructions</td>
</tr>
<tr>
<td align="left"><code>react_native_installation_guide</code></a></td>
<td align="left">React Native SDK integration instructions</td>
</tr>
<tr>
<td align="left"><code>android_installation_guide</code></a></td>
<td align="left">Native Android SDK integration instructions</td>
</tr>
<tr>
<td align="left"><code>ios_installation_guide</code></a></td>
<td align="left">Native iOS SDK integration instructions</td>
</tr>
<tr>
<td align="left"><code>react_installation_guide</code></a></td>
<td align="left">React web SDK integration instructions</td>
</tr>
<tr>
<td align="left"><code>node_installation_guide</code></a></td>
<td align="left">Node.js backend SDK instructions</td>
</tr>
<tr>
<td align="left"><code>python_installation_guide</code></a></td>
<td align="left">Python backend SDK instructions</td>
</tr>
</table>

### ⚙️ Configuration
<table>
<tr>
<th width="400px" align="left">Tool ID</th>
<th width="900px" align="left">Description</th>
</tr>
<tr>
<td align="left"><code>get_environment_config</code></a></td>
<td align="left">Get the Courier environment configuration</td>
</tr>
</table>

# MCP Server Container

1. **Build the Docker image:**

   ```sh
   docker build -t courier-mcp-server .
   ```

2. **Run the Docker container:**

   ```sh
   docker run --rm -p 3000:3000 courier-mcp-server
   ```

The service will be available at [http://localhost:3000](http://localhost:3000).

## Development

For local development, you can use the provided scripts:

- `npm run dev` — Start the development server.

You can also use the launcher actions for these functions as well:

<img width="245" height="222" alt="Screenshot 2025-08-01 at 2 36 46 PM" src="https://github.com/user-attachments/assets/d9c06cae-9b2b-4e30-90bc-441e11ef633e" />

# Deploying to AWS

This project is using its own standalone Stack and is currently not part of any other stacks at 
Courier (will probably change). The stack just consists of a simple ECS Fargate deployment, bundling
the MCP server in a docker container.

## Pre-requisites

Ensure that you have your AWS `aws_access_key_id` and `aws_secret_access_key` defined and pointing to your
dev account.

## Bootstrap

The very first time, you have to bootstrap your CDK app.

`npx cdk bootstrap`

You only need to do this once.

## Deploy

`npx cdk deploy`

## Destroy your stack

If you don't intend to use it, please destroy your stack as it cost us money.

`npx cdk destroy`




