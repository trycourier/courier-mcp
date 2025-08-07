# Install the MCP Server

## Cursor

```json
{
  "mcpServers": {
    "Courier": {
      "url": "http://courie-couri-vzqr9fnkry0j-39627219.us-east-1.elb.amazonaws.com/mcp", // TODO: Get real url
      "env": {
        "API_KEY": "XXX"
      }
    }
  }
}
```

// Claude code
claude mcp add --transport http courier http://courie-couri-vzqr9fnkry0j-39627219.us-east-1.elb.amazonaws.com/mcp --headers API_KEY=pk_prod_S9Z21QF7WW4DJSNKQBNN1X1FV15R

## Claude Desktop

```json
{
  "mcpServers": {
    "Courier": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://localhost:3000/mcp"],
      "env": {
        "API_KEY": "pk_prod_S9Z21QF7WW4DJSNKQBNN1X1FV15R"
      }
    }
  }
}
```

// VSCode
```
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
			"url": "http://courie-couri-vzqr9fnkry0j-39627219.us-east-1.elb.amazonaws.com/mcp",
			"type": "http",
			"headers": {
				"API_KEY": "${input:courier-api-key}"
			}
		}
	}
}
```

# OpenAI API


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




