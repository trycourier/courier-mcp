import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { NotFoundError } from '@trycourier/courier/core/error';
import { createTestClient, createMockCourier } from './helpers.js';
import { PACKAGE_NAME, PACKAGE_VERSION } from '../utils/version.js';

describe('Error propagation through tools', () => {
  let client: Client;
  let mockCourier: ReturnType<typeof createMockCourier>;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    ({ client, mockCourier, cleanup } = await createTestClient());
  });

  afterEach(async () => { await cleanup(); });

  it('SDK NotFoundError returns structured error, not a crash', async () => {
    mockCourier.profiles.retrieve.mockRejectedValueOnce(
      new NotFoundError(404, { message: 'Profile not found' }, 'Profile not found', new Headers())
    );

    const result = await client.callTool({ name: 'get_user_profile_by_id', arguments: { user_id: 'missing' } });
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(result.isError).toBe(true);
    expect(parsed.status).toBe(404);
    expect(parsed.message).toBe('Profile not found');
  });

  it('generic Error returns structured error', async () => {
    mockCourier.messages.list.mockRejectedValueOnce(new Error('Network timeout'));

    const result = await client.callTool({ name: 'list_messages', arguments: {} });
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(result.isError).toBe(true);
    expect(parsed.message).toBe('Network timeout');
  });

  it('SDK error on send returns structured error', async () => {
    mockCourier.send.message.mockRejectedValueOnce(
      new NotFoundError(404, { message: 'Template not found' }, 'Template not found', new Headers())
    );

    const result = await client.callTool({
      name: 'send_message_template',
      arguments: { user_id: 'user-1', template: 'NONEXISTENT' },
    });
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(result.isError).toBe(true);
    expect(parsed.status).toBe(404);
  });
});

describe('Zod validation', () => {
  let client: Client;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    ({ client, cleanup } = await createTestClient());
  });

  afterEach(async () => { await cleanup(); });

  it('rejects missing required params', async () => {
    await expect(
      client.callTool({ name: 'get_message', arguments: {} })
    ).rejects.toThrow(/invalid/i);
  });

  it('rejects wrong param types', async () => {
    await expect(
      client.callTool({ name: 'get_audience', arguments: { audience_id: 123 } })
    ).rejects.toThrow(/invalid/i);
  });

  it('rejects invalid enum value', async () => {
    await expect(
      client.callTool({ name: 'courier_installation_guide', arguments: { platform: 'cobol' } })
    ).rejects.toThrow(/invalid/i);
  });
});

describe('MCP protocol', () => {
  let client: Client;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    ({ client, cleanup } = await createTestClient());
  });

  afterEach(async () => { await cleanup(); });

  it('server reports correct name and version', async () => {
    const info = client.getServerVersion();
    expect(info?.name).toBe(PACKAGE_NAME);
    expect(info?.version).toBe(PACKAGE_VERSION);
  });

  it('listTools returns all tools with descriptions', async () => {
    const { tools } = await client.listTools();
    expect(tools.length).toBe(60);
    for (const tool of tools) {
      expect(tool.name).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.description.length).toBeGreaterThan(10);
    }
  });

  it('calling nonexistent tool throws', async () => {
    await expect(
      client.callTool({ name: 'totally_fake_tool', arguments: {} })
    ).rejects.toThrow();
  });
});
