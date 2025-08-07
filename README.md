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

## Available Tools by Category

### 📤 Message Sending
<table>
<tr width="1200px">
<th align="left">Tool ID</th>
<th align="left">Description</th>
</tr>
<tr width="1200px">
<td><a href="https://www.courier.com/docs/reference/send/message/"><code>send_message</code></a></td>
<td>Send a message using title and body (no template)</td>
</tr>
<tr width="1200px">
<td><a href="https://www.courier.com/docs/reference/send/message/">`send_message_template`</a></td>
<td>Send a message using a predefined template</td>
</tr>
</table>

### 👤 Profile Management
<table style="width:100%">
<tr>
<th style="text-align:left">Tool ID</th>
<th style="text-align:left">Description</th>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/profiles/get-profile/">`get_user_profile_by_id`</a></td>
<td style="text-align:left">Get a user profile by their ID</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/profiles/create/">`create_or_merge_user`</a></td>
<td style="text-align:left">Create or merge a user profile by user ID</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/profiles/get-list-subscriptions/">`get_user_list_subscriptions`</a></td>
<td style="text-align:left">Get the list subscriptions for a user by their ID</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/profiles/subscribe-to-lists/">`subscribe_user_to_lists`</a></td>
<td style="text-align:left">Subscribe a user to one or more lists</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/profiles/delete-list-subscription/">`delete_user_list_subscriptions`</a></td>
<td style="text-align:left">Delete all list subscriptions for a user by their ID</td>
</tr>
</table>

### 📋 List Management
<table style="width:100%">
<tr>
<th style="text-align:left">Tool ID</th>
<th style="text-align:left">Description</th>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/lists/list/">`list_lists`</a></td>
<td style="text-align:left">Returns all lists with optional pattern filtering</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/lists/get/">`get_list`</a></td>
<td style="text-align:left">Returns a list based on the list ID provided</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/lists/get-subscribers/">`get_list_subscribers`</a></td>
<td style="text-align:left">Get the list's subscriptions</td>
</tr>
</table>

### 🔐 Authentication
<table style="width:100%">
<tr>
<th style="text-align:left">Tool ID</th>
<th style="text-align:left">Description</th>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/auth-tokens/issue-token/">`issue_token`</a></td>
<td style="text-align:left">Generate a JWT authentication token for Courier</td>
</tr>
</table>

### 🔑 User Token Management
<table style="width:100%">
<tr>
<th style="text-align:left">Tool ID</th>
<th style="text-align:left">Description</th>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/user-tokens/list/">`list_user_tokens`</a></td>
<td style="text-align:left">List all tokens for a given user</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/user-tokens/get/">`get_user_token`</a></td>
<td style="text-align:left">Get a specific token for a given user</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/user-tokens/put/">`create_or_replace_user_token`</a></td>
<td style="text-align:left">Create or replace a specific token for a given user</td>
</tr>
</table>

### ⚡ Automation
<table style="width:100%">
<tr>
<th style="text-align:left">Tool ID</th>
<th style="text-align:left">Description</th>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/automations/invoke-template/">`invoke_automation_template`</a></td>
<td style="text-align:left">Invoke an automation run from an automation template</td>
</tr>
</table>

### 📝 Template Management
<table style="width:100%">
<tr>
<th style="text-align:left">Tool ID</th>
<th style="text-align:left">Description</th>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/notifications/list/">`list_templates`</a></td>
<td style="text-align:left">Returns a list of notification templates</td>
</tr>
</table>

### 👥 Audience Management
<table style="width:100%">
<tr>
<th style="text-align:left">Tool ID</th>
<th style="text-align:left">Description</th>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/audiences/get/">`get_audience`</a></td>
<td style="text-align:left">Get an audience by its ID</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/audiences/list-members/">`list_audience_members`</a></td>
<td style="text-align:left">List members of an audience by its ID</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/audiences/list/">`list_audiences`</a></td>
<td style="text-align:left">List all audiences associated with the authorization token</td>
</tr>
</table>

### 🎨 Brand Management
<table style="width:100%">
<tr>
<th style="text-align:left">Tool ID</th>
<th style="text-align:left">Description</th>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/brands/create/">`create_brand`</a></td>
<td style="text-align:left">Create a new brand</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/brands/get/">`get_brand`</a></td>
<td style="text-align:left">Fetch a specific brand by brand ID</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/brands/list/">`list_brands`</a></td>
<td style="text-align:left">Get the list of brands</td>
</tr>
</table>

### 📥 Inbound Events
<table style="width:100%">
<tr>
<th style="text-align:left">Tool ID</th>
<th style="text-align:left">Description</th>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/inbound/track/">`track_inbound_event`</a></td>
<td style="text-align:left">Track an inbound event</td>
</tr>
</table>

### 💬 Message Management
<table style="width:100%">
<tr>
<th style="text-align:left">Tool ID</th>
<th style="text-align:left">Description</th>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/messages/list/">`list_messages`</a></td>
<td style="text-align:left">Fetch the statuses of messages you've previously sent</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/messages/get/">`get_message`</a></td>
<td style="text-align:left">Fetch the status of a message you've previously sent</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/messages/get-content/">`get_message_content`</a></td>
<td style="text-align:left">Fetch the rendered content of a message you've previously sent</td>
</tr>
</table>

### 🔔 Notification Management
<table style="width:100%">
<tr>
<th style="text-align:left">Tool ID</th>
<th style="text-align:left">Description</th>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/notifications/list/">`list_notifications`</a></td>
<td style="text-align:left">List notifications with optional filtering</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/notifications/get-content/">`get_notification_content`</a></td>
<td style="text-align:left">Get the content of a notification by its ID</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/notifications/get-draft-content/">`get_notification_draft_content`</a></td>
<td style="text-align:left">Get the draft content of a notification by its ID</td>
</tr>
</table>

### 📚 Documentation & Installation Guides
<table style="width:100%">
<tr>
<th style="text-align:left">Tool ID</th>
<th style="text-align:left">Description</th>
</tr>
<tr>
<td style="text-align:left"><a href="https://github.com/trycourier/courier-flutter">`flutter_installation_guide`</a></td>
<td style="text-align:left">Flutter SDK integration instructions</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://github.com/trycourier/courier-react-native">`react_native_installation_guide`</a></td>
<td style="text-align:left">React Native SDK integration instructions</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://github.com/trycourier/courier-android">`android_installation_guide`</a></td>
<td style="text-align:left">Native Android SDK integration instructions</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://github.com/trycourier/courier-ios">`ios_installation_guide`</a></td>
<td style="text-align:left">Native iOS SDK integration instructions</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://github.com/trycourier/courier-web/tree/main/@trycourier/courier-react">`react_installation_guide`</a></td>
<td style="text-align:left">React web SDK integration instructions</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/guides/getting-started/nodejs/">`node_installation_guide`</a></td>
<td style="text-align:left">Node.js backend SDK instructions</td>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/guides/getting-started/python/">`python_installation_guide`</a></td>
<td style="text-align:left">Python backend SDK instructions</td>
</tr>
</table>

### ⚙️ Configuration
<table style="width:100%">
<tr>
<th style="text-align:left">Tool ID</th>
<th style="text-align:left">Description</th>
</tr>
<tr>
<td style="text-align:left"><a href="https://www.courier.com/docs/reference/">`get_environment_config`</a></td>
<td style="text-align:left">Get the Courier environment configuration</td>
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




