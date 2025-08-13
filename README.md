# Courier MCP

### 1. Run the test server

From root:

```bash
sh dev.sh
```

Or run the launcher action "Start Development"

### 2 Install the MCP server

**Cursor**
```json
{
  "mcpServers": {
    "courier": {
      "url": "http://localhost:3000/mcp",
      "headers": {
        "base_url": "your_dev_env", // Defaults to the public api otherwise if not attached
        "api_key": "XXXX" // Your API Key. Get yours from: https://app.courier.com/settings/api-keys
      }
    }
  }
}
```