import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { createTestClient, createMockCourier } from './helpers.js';

describe('MessagesTools', () => {
  let client: Client;
  let mockCourier: ReturnType<typeof createMockCourier>;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    ({ client, mockCourier, cleanup } = await createTestClient());
  });

  afterEach(async () => { await cleanup(); });

  it('list_messages passes query params', async () => {
    await client.callTool({
      name: 'list_messages',
      arguments: { recipient: 'user-1', status: ['DELIVERED', 'SENT'] },
    });

    expect(mockCourier.messages.list).toHaveBeenCalledWith(
      expect.objectContaining({ recipient: 'user-1', status: ['DELIVERED', 'SENT'] })
    );
  });

  it('get_message retrieves by ID', async () => {
    const result = await client.callTool({
      name: 'get_message',
      arguments: { message_id: 'msg-1' },
    });

    expect(mockCourier.messages.retrieve).toHaveBeenCalledWith('msg-1');
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed.id).toBe('msg-1');
  });

  it('get_message_content retrieves rendered content', async () => {
    await client.callTool({ name: 'get_message_content', arguments: { message_id: 'msg-1' } });
    expect(mockCourier.messages.content).toHaveBeenCalledWith('msg-1');
  });

  it('get_message_history retrieves event history', async () => {
    await client.callTool({ name: 'get_message_history', arguments: { message_id: 'msg-1', type: 'DELIVERED' } });
    expect(mockCourier.messages.history).toHaveBeenCalledWith('msg-1', { type: 'DELIVERED' });
  });

  it('cancel_message cancels a message', async () => {
    const result = await client.callTool({ name: 'cancel_message', arguments: { message_id: 'msg-1' } });
    expect(mockCourier.messages.cancel).toHaveBeenCalledWith('msg-1');
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed.status).toBe('CANCELED');
  });
});
