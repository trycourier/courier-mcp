# Use Node.js 20 LTS as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy everything needed for local package resolution
COPY mcp ./mcp
COPY server ./server

# Build mcp package first
WORKDIR /app/mcp
RUN npm install --ignore-scripts
RUN npm run build

# Install server dependencies (will use local mcp)
WORKDIR /app/server
RUN npm install --ignore-scripts

# Build server
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]