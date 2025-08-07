import dotenv from 'dotenv';
import OpenAI from 'openai';

// Load environment variables
dotenv.config();

// Log environment variables
console.log({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  COURIER_URL: process.env.COURIER_MCP_URL,
  COURIER_API_KEY: process.env.COURIER_API_KEY,
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  try {
    // Create a chat completion
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: "Send inbox message to mike. Make up the title and body.",
      tools: [
        {
          type: "mcp",
          server_label: "Courier",
          server_url: process.env.COURIER_MCP_URL!, // Must use HTTPS
          headers: {
            API_KEY: process.env.COURIER_API_KEY!,
          },
          allowed_tools: ["send_message"],
          require_approval: "never",
        },
      ],
    });

    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Error creating chat completion:', error);
  }
}

main();