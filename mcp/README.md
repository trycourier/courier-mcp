# MCP Service

This project provides an MCP (Message Control Protocol) service.

## Build and Run with Docker

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
- `npm run build:docker` — Build the Docker image.
- `npm run run:docker` — Run the Docker container.

Make sure you have Docker installed before running the docker commands.

You can also use the launcher actions for these functions as well:
