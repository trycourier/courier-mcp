import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import CourierMcp from '../index.js';
import { createTestClient, createMockCourier } from './helpers.js';

describe('SendTools', () => {
  let client: Client;
  let mcp: CourierMcp;
  let mockCourier: ReturnType<typeof createMockCourier>;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    ({ client, mcp, mockCourier, cleanup } = await createTestClient());
  });

  afterEach(async () => { await cleanup(); });

  describe('send_message', () => {
    it('sends inline content to a user', async () => {
      const result = await client.callTool({
        name: 'send_message',
        arguments: { user_id: 'user-1', title: 'Hello', body: 'World' },
      });

      expect(mockCourier.send.message).toHaveBeenCalledWith({
        message: {
          to: { user_id: 'user-1' },
          content: { title: 'Hello', body: 'World' },
        },
      });
      const parsed = JSON.parse((result.content as any)[0].text);
      expect(parsed.requestId).toBe('req-123');
    });

    it('includes data when provided', async () => {
      await client.callTool({
        name: 'send_message',
        arguments: {
          user_id: 'user-1',
          title: 'Hello',
          body: 'World',
          data: { orderId: 123, nested: { foo: 'bar' } },
        },
      });

      const call = mockCourier.send.message.mock.calls[0][0];
      expect(call.message.data).toEqual({ orderId: 123, nested: { foo: 'bar' } });
    });

    it('omits routing when channels not provided', async () => {
      await client.callTool({
        name: 'send_message',
        arguments: { user_id: 'user-1', title: 'Hello', body: 'World' },
      });

      const call = mockCourier.send.message.mock.calls[0][0];
      expect(call.message.routing).toBeUndefined();
    });

    it('includes routing when channels provided', async () => {
      await client.callTool({
        name: 'send_message',
        arguments: {
          user_id: 'user-1',
          title: 'Hello',
          body: 'World',
          channels: ['email', 'sms'],
          method: 'single',
        },
      });

      const call = mockCourier.send.message.mock.calls[0][0];
      expect(call.message.routing).toEqual({ method: 'single', channels: ['email', 'sms'] });
    });
  });

  describe('send_message_template', () => {
    it('sends a template to a user', async () => {
      await client.callTool({
        name: 'send_message_template',
        arguments: { user_id: 'user-1', template: 'ORDER_CONFIRM' },
      });

      const call = mockCourier.send.message.mock.calls[0][0];
      expect(call.message.to).toEqual({ user_id: 'user-1' });
      expect(call.message.template).toBe('ORDER_CONFIRM');
      expect(call.message.content).toBeUndefined();
    });
  });

  describe('send_message_to_list', () => {
    it('sends inline content to a list', async () => {
      await client.callTool({
        name: 'send_message_to_list',
        arguments: { list_id: 'beta-testers', title: 'Update', body: 'New feature' },
      });

      const call = mockCourier.send.message.mock.calls[0][0];
      expect(call.message.to).toEqual({ list_id: 'beta-testers' });
      expect(call.message.content).toEqual({ title: 'Update', body: 'New feature' });
    });
  });

  describe('send_message_to_list_template', () => {
    it('sends a template to a list', async () => {
      await client.callTool({
        name: 'send_message_to_list_template',
        arguments: { list_id: 'beta-testers', template: 'WEEKLY_UPDATE' },
      });

      const call = mockCourier.send.message.mock.calls[0][0];
      expect(call.message.to).toEqual({ list_id: 'beta-testers' });
      expect(call.message.template).toBe('WEEKLY_UPDATE');
    });
  });
});
