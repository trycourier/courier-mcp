import { APIError, APIConnectionError } from '@trycourier/courier/core/error';

export interface McpToolResult {
  [key: string]: unknown;
  content: { type: 'text'; text: string }[];
  isError?: boolean;
}

export function formatSuccess(data: unknown): McpToolResult {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
  };
}

export function formatError(err: unknown): McpToolResult {
  if (err instanceof APIConnectionError) {
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({ error: true, message: `Connection error: ${err.message}` }, null, 2),
        },
      ],
      isError: true,
    };
  }

  if (err instanceof APIError) {
    const status = err.status;
    const body = err.error;
    const message =
      typeof body === 'object' && body !== null && 'message' in body
        ? (body as Record<string, unknown>).message
        : err.message;

    return {
      content: [{ type: 'text' as const, text: JSON.stringify({ error: true, status, message }, null, 2) }],
      isError: true,
    };
  }

  const message = err instanceof Error ? err.message : String(err);
  return {
    content: [{ type: 'text' as const, text: JSON.stringify({ error: true, message }, null, 2) }],
    isError: true,
  };
}

export async function handleToolCall<T>(fn: () => Promise<T>): Promise<McpToolResult> {
  try {
    const result = await fn();
    return formatSuccess(result);
  } catch (err) {
    return formatError(err);
  }
}
