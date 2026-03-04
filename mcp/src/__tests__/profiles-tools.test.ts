import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { createTestClient, createMockCourier } from './helpers.js';

describe('ProfilesTools', () => {
  let client: Client;
  let mockCourier: ReturnType<typeof createMockCourier>;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    ({ client, mockCourier, cleanup } = await createTestClient());
  });

  afterEach(async () => { await cleanup(); });

  it('get_user_profile_by_id retrieves profile', async () => {
    const result = await client.callTool({ name: 'get_user_profile_by_id', arguments: { user_id: 'user-1' } });
    expect(mockCourier.profiles.retrieve).toHaveBeenCalledWith('user-1');
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed.profile.email).toBe('test@example.com');
  });

  it('create_or_merge_user creates with profile data', async () => {
    await client.callTool({
      name: 'create_or_merge_user',
      arguments: { user_id: 'user-2', profile: { email: 'new@test.com' } },
    });
    expect(mockCourier.profiles.create).toHaveBeenCalledWith('user-2', { profile: { email: 'new@test.com' } });
  });

  it('replace_profile does full replace', async () => {
    await client.callTool({
      name: 'replace_profile',
      arguments: { user_id: 'user-1', profile: { email: 'replaced@test.com' } },
    });
    expect(mockCourier.profiles.replace).toHaveBeenCalledWith('user-1', { profile: { email: 'replaced@test.com' } });
  });

  it('delete_profile deletes', async () => {
    const result = await client.callTool({ name: 'delete_profile', arguments: { user_id: 'user-1' } });
    expect(mockCourier.profiles.delete).toHaveBeenCalledWith('user-1');
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed.success).toBe(true);
  });

  it('subscribe_user_to_lists subscribes', async () => {
    await client.callTool({
      name: 'subscribe_user_to_lists',
      arguments: { user_id: 'user-1', lists: [{ listId: 'list-a' }, { listId: 'list-b' }] },
    });
    expect(mockCourier.profiles.lists.subscribe).toHaveBeenCalledWith('user-1', {
      lists: [{ listId: 'list-a' }, { listId: 'list-b' }],
    });
  });
});
