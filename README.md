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

# OpenAI API

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
| Tool ID | Description |
|---------|-------------|
| `send_message` | Send a message using title and body (no template) |
| `send_message_template` | Send a message using a predefined template |

### 👤 Profile Management
| Tool ID | Description |
|---------|-------------|
| `get_user_profile_by_id` | Get a user profile by their ID |
| `create_or_merge_user` | Create or merge a user profile by user ID |
| `get_user_list_subscriptions` | Get the list subscriptions for a user by their ID |
| `subscribe_user_to_lists` | Subscribe a user to one or more lists |
| `delete_user_list_subscriptions` | Delete all list subscriptions for a user by their ID |

### 📋 List Management
| Tool ID | Description |
|---------|-------------|
| `list_lists` | Returns all lists with optional pattern filtering |
| `get_list` | Returns a list based on the list ID provided |
| `get_list_subscribers` | Get the list's subscriptions |

### 🔐 Authentication
| Tool ID | Description |
|---------|-------------|
| `issue_token` | Generate a JWT authentication token for Courier |

### 🔑 User Token Management
| Tool ID | Description |
|---------|-------------|
| `list_user_tokens` | List all tokens for a given user |
| `get_user_token` | Get a specific token for a given user |
| `create_or_replace_user_token` | Create or replace a specific token for a given user |

### ⚡ Automation
| Tool ID | Description |
|---------|-------------|
| `invoke_automation_template` | Invoke an automation run from an automation template |

### 📝 Template Management
| Tool ID | Description |
|---------|-------------|
| `list_templates` | Returns a list of notification templates |

### 👥 Audience Management
| Tool ID | Description |
|---------|-------------|
| `get_audience` | Get an audience by its ID |
| `list_audience_members` | List members of an audience by its ID |
| `list_audiences` | List all audiences associated with the authorization token |

### 🎨 Brand Management
| Tool ID | Description |
|---------|-------------|
| `create_brand` | Create a new brand |
| `get_brand` | Fetch a specific brand by brand ID |
| `list_brands` | Get the list of brands |

### 📥 Inbound Events
| Tool ID | Description |
|---------|-------------|
| `track_inbound_event` | Track an inbound event |

### 💬 Message Management
| Tool ID | Description |
|---------|-------------|
| `list_messages` | Fetch the statuses of messages you've previously sent |
| `get_message` | Fetch the status of a message you've previously sent |
| `get_message_content` | Fetch the rendered content of a message you've previously sent |

### 🔔 Notification Management
| Tool ID | Description |
|---------|-------------|
| `list_notifications` | List notifications with optional filtering |
| `get_notification_content` | Get the content of a notification by its ID |
| `get_notification_draft_content` | Get the draft content of a notification by its ID |

### 📚 Documentation & Installation Guides
| Tool ID | Description |
|---------|-------------|
| `flutter_installation_guide` | Flutter SDK integration instructions |
| `react_native_installation_guide` | React Native SDK integration instructions |
| `android_installation_guide` | Native Android SDK integration instructions |
| `ios_installation_guide` | Native iOS SDK integration instructions |
| `react_installation_guide` | React web SDK integration instructions |
| `node_installation_guide` | Node.js backend SDK instructions |
| `python_installation_guide` | Python backend SDK instructions |

### ⚙️ Configuration
| Tool ID | Description |
|---------|-------------|
| `get_environment_config` | Get the Courier environment configuration |

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




