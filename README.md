# Install the MCP Server

## Cursor

```json
{
  "mcpServers": {
    "Courier": {
      "url": "http://localhost:3000/mcp",
      "headers": {
        "API_KEY": "XXX"
      }
    }
  }
}
```

## Claude Desktop

```json
{
  "mcpServers": {
    "courier": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://localhost:3000/mcp"],
      "headers": {
        "API_KEY": "XXX"
      }
    }
  }
}
```

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
