import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { createTestClient, createMockCourier } from './helpers.js';

describe('Tool coverage - one call per tool', () => {
  let client: Client;
  let mockCourier: ReturnType<typeof createMockCourier>;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    ({ client, mockCourier, cleanup } = await createTestClient());
  });

  afterEach(async () => { await cleanup(); });

  // --- Audiences ---

  it('get_audience', async () => {
    await client.callTool({ name: 'get_audience', arguments: { audience_id: 'aud-1' } });
    expect(mockCourier.audiences.retrieve).toHaveBeenCalledWith('aud-1');
  });

  it('list_audience_members', async () => {
    await client.callTool({ name: 'list_audience_members', arguments: { audience_id: 'aud-1' } });
    expect(mockCourier.audiences.listMembers).toHaveBeenCalledWith('aud-1', {});
  });

  it('list_audiences', async () => {
    await client.callTool({ name: 'list_audiences', arguments: {} });
    expect(mockCourier.audiences.list).toHaveBeenCalled();
  });

  it('update_audience', async () => {
    await client.callTool({ name: 'update_audience', arguments: { audience_id: 'aud-1', name: 'VIP' } });
    expect(mockCourier.audiences.update).toHaveBeenCalledWith('aud-1', expect.objectContaining({ name: 'VIP' }));
  });

  it('delete_audience', async () => {
    await client.callTool({ name: 'delete_audience', arguments: { audience_id: 'aud-1' } });
    expect(mockCourier.audiences.delete).toHaveBeenCalledWith('aud-1');
  });

  // --- Notifications ---

  it('list_notifications', async () => {
    await client.callTool({ name: 'list_notifications', arguments: {} });
    expect(mockCourier.notifications.list).toHaveBeenCalled();
  });

  it('get_notification_content', async () => {
    await client.callTool({ name: 'get_notification_content', arguments: { notification_id: 'n-1' } });
    expect(mockCourier.notifications.retrieveContent).toHaveBeenCalledWith('n-1');
  });

  it('get_notification_draft_content', async () => {
    await client.callTool({ name: 'get_notification_draft_content', arguments: { notification_id: 'n-1' } });
    expect(mockCourier.notifications.draft.retrieveContent).toHaveBeenCalledWith('n-1');
  });

  // --- Brands ---

  it('create_brand', async () => {
    await client.callTool({ name: 'create_brand', arguments: { name: 'Acme' } });
    expect(mockCourier.brands.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Acme' }));
  });

  it('get_brand', async () => {
    await client.callTool({ name: 'get_brand', arguments: { brand_id: 'b-1' } });
    expect(mockCourier.brands.retrieve).toHaveBeenCalledWith('b-1');
  });

  it('list_brands', async () => {
    await client.callTool({ name: 'list_brands', arguments: {} });
    expect(mockCourier.brands.list).toHaveBeenCalled();
  });

  // --- Auth ---

  it('generate_jwt_for_user', async () => {
    const result = await client.callTool({ name: 'generate_jwt_for_user', arguments: { user_id: 'user-1' } });
    expect(mockCourier.auth.issueToken).toHaveBeenCalled();
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed.token).toBe('jwt-token-123');
  });

  // --- User Tokens ---

  it('list_user_push_tokens', async () => {
    await client.callTool({ name: 'list_user_push_tokens', arguments: { user_id: 'user-1' } });
    expect(mockCourier.users.tokens.list).toHaveBeenCalledWith('user-1');
  });

  it('get_user_push_token', async () => {
    await client.callTool({ name: 'get_user_push_token', arguments: { user_id: 'user-1', token: 'tok-1' } });
    expect(mockCourier.users.tokens.retrieve).toHaveBeenCalledWith('tok-1', { user_id: 'user-1' });
  });

  it('create_or_replace_user_push_token', async () => {
    await client.callTool({ name: 'create_or_replace_user_push_token', arguments: {
      user_id: 'user-1', token: 'fcm-token-abc', provider_key: 'firebase-fcm'
    }});
    expect(mockCourier.users.tokens.addSingle).toHaveBeenCalledWith('fcm-token-abc', expect.objectContaining({
      user_id: 'user-1', provider_key: 'firebase-fcm', token: 'fcm-token-abc'
    }));
  });

  // --- Docs ---

  it('courier_installation_guide returns guide for server-side SDK', async () => {
    const result = await client.callTool({ name: 'courier_installation_guide', arguments: { platform: 'nodejs' } });
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed.guide).toContain('Node.js');
    expect(parsed.sample_jwt).toBeUndefined();
  });

  it('courier_installation_guide returns guide + JWT for client-side SDK', async () => {
    const result = await client.callTool({ name: 'courier_installation_guide', arguments: { platform: 'react', user_id: 'u-1' } });
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed.guide).toContain('React');
    expect(parsed.sample_jwt.token).toBe('jwt-token-123');
    expect(parsed.sample_jwt.user_id).toBe('u-1');
    expect(mockCourier.auth.issueToken).toHaveBeenCalled();
  });

  // --- Automations ---

  it('invoke_automation_template', async () => {
    await client.callTool({ name: 'invoke_automation_template', arguments: { template_id: 'tpl-1', recipient: 'user-1' } });
    expect(mockCourier.automations.invoke.invokeByTemplate).toHaveBeenCalledWith('tpl-1', expect.objectContaining({ recipient: 'user-1' }));
  });

  it('invoke_ad_hoc_automation', async () => {
    await client.callTool({ name: 'invoke_ad_hoc_automation', arguments: { automation: { steps: [{ action: 'send', template: 't-1' }] } } });
    expect(mockCourier.automations.invoke.invokeAdHoc).toHaveBeenCalled();
  });

  // --- Bulk ---

  it('create_bulk_job', async () => {
    await client.callTool({ name: 'create_bulk_job', arguments: { message: { event: 'evt' } } });
    expect(mockCourier.bulk.createJob).toHaveBeenCalled();
  });

  it('add_bulk_users', async () => {
    await client.callTool({ name: 'add_bulk_users', arguments: { job_id: 'job-1', users: [{ user_id: 'u-1' }] } });
    expect(mockCourier.bulk.addUsers).toHaveBeenCalledWith('job-1', expect.objectContaining({ users: [{ user_id: 'u-1' }] }));
  });

  it('run_bulk_job', async () => {
    await client.callTool({ name: 'run_bulk_job', arguments: { job_id: 'job-1' } });
    expect(mockCourier.bulk.runJob).toHaveBeenCalledWith('job-1');
  });

  it('get_bulk_job', async () => {
    await client.callTool({ name: 'get_bulk_job', arguments: { job_id: 'job-1' } });
    expect(mockCourier.bulk.retrieveJob).toHaveBeenCalledWith('job-1');
  });

  it('list_bulk_users', async () => {
    await client.callTool({ name: 'list_bulk_users', arguments: { job_id: 'job-1' } });
    expect(mockCourier.bulk.listUsers).toHaveBeenCalledWith('job-1', {});
  });

  // --- Inbound ---

  it('track_inbound_event', async () => {
    await client.callTool({ name: 'track_inbound_event', arguments: { event: 'order_placed', messageId: 'uuid-1', properties: { orderId: 1 } } });
    expect(mockCourier.inbound.trackEvent).toHaveBeenCalled();
  });

  // --- Audit Events ---

  it('get_audit_event', async () => {
    await client.callTool({ name: 'get_audit_event', arguments: { audit_event_id: 'ae-1' } });
    expect(mockCourier.auditEvents.retrieve).toHaveBeenCalledWith('ae-1');
  });

  it('list_audit_events', async () => {
    await client.callTool({ name: 'list_audit_events', arguments: {} });
    expect(mockCourier.auditEvents.list).toHaveBeenCalled();
  });

  // --- Tenants ---

  it('get_tenant', async () => {
    const result = await client.callTool({ name: 'get_tenant', arguments: { tenant_id: 't-1' } });
    expect(mockCourier.tenants.retrieve).toHaveBeenCalledWith('t-1');
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed.name).toBe('Acme');
  });

  it('create_or_update_tenant', async () => {
    await client.callTool({ name: 'create_or_update_tenant', arguments: { tenant_id: 't-1', name: 'Acme Corp' } });
    expect(mockCourier.tenants.update).toHaveBeenCalledWith('t-1', expect.objectContaining({ name: 'Acme Corp' }));
  });

  it('list_tenants', async () => {
    await client.callTool({ name: 'list_tenants', arguments: {} });
    expect(mockCourier.tenants.list).toHaveBeenCalled();
  });

  it('delete_tenant', async () => {
    await client.callTool({ name: 'delete_tenant', arguments: { tenant_id: 't-1' } });
    expect(mockCourier.tenants.delete).toHaveBeenCalledWith('t-1');
  });

  // --- Translations ---

  it('get_translation', async () => {
    await client.callTool({ name: 'get_translation', arguments: { locale: 'fr_FR' } });
    expect(mockCourier.translations.retrieve).toHaveBeenCalledWith('fr_FR', expect.objectContaining({ domain: 'default' }));
  });

  it('update_translation', async () => {
    await client.callTool({ name: 'update_translation', arguments: { locale: 'fr_FR', body: 'msgid "hi"\nmsgstr "salut"' } });
    expect(mockCourier.translations.update).toHaveBeenCalledWith('fr_FR', expect.objectContaining({ body: 'msgid "hi"\nmsgstr "salut"' }));
  });

  // --- Users ---

  it('get_user_preferences', async () => {
    await client.callTool({ name: 'get_user_preferences', arguments: { user_id: 'user-1' } });
    expect(mockCourier.users.preferences.retrieve).toHaveBeenCalledWith('user-1', {});
  });

  it('update_user_preference_topic', async () => {
    await client.callTool({ name: 'update_user_preference_topic', arguments: {
      user_id: 'user-1', topic_id: 'topic-1', status: 'OPTED_OUT'
    }});
    expect(mockCourier.users.preferences.updateOrCreateTopic).toHaveBeenCalledWith('topic-1', expect.objectContaining({
      user_id: 'user-1', topic: expect.objectContaining({ status: 'OPTED_OUT' })
    }));
  });

  it('list_user_tenants', async () => {
    await client.callTool({ name: 'list_user_tenants', arguments: { user_id: 'user-1' } });
    expect(mockCourier.users.tenants.list).toHaveBeenCalledWith('user-1', {});
  });

  it('add_user_to_tenant', async () => {
    await client.callTool({ name: 'add_user_to_tenant', arguments: { user_id: 'user-1', tenant_id: 't-1' } });
    expect(mockCourier.users.tenants.addSingle).toHaveBeenCalledWith('t-1', expect.objectContaining({ user_id: 'user-1' }));
  });

  it('remove_user_from_tenant', async () => {
    await client.callTool({ name: 'remove_user_from_tenant', arguments: { user_id: 'user-1', tenant_id: 't-1' } });
    expect(mockCourier.users.tenants.removeSingle).toHaveBeenCalledWith('t-1', { user_id: 'user-1' });
  });

  // --- Lists ---

  it('list_lists', async () => {
    await client.callTool({ name: 'list_lists', arguments: {} });
    expect(mockCourier.lists.list).toHaveBeenCalled();
  });

  it('get_list', async () => {
    await client.callTool({ name: 'get_list', arguments: { list_id: 'list-1' } });
    expect(mockCourier.lists.retrieve).toHaveBeenCalledWith('list-1');
  });

  it('get_list_subscribers', async () => {
    await client.callTool({ name: 'get_list_subscribers', arguments: { list_id: 'list-1' } });
    expect(mockCourier.lists.subscriptions.list).toHaveBeenCalledWith('list-1', {});
  });

  it('create_list', async () => {
    await client.callTool({ name: 'create_list', arguments: { list_id: 'list-2', name: 'VIP' } });
    expect(mockCourier.lists.update).toHaveBeenCalledWith('list-2', { name: 'VIP' });
  });

  it('subscribe_user_to_list', async () => {
    await client.callTool({ name: 'subscribe_user_to_list', arguments: { list_id: 'list-1', user_id: 'user-1' } });
    expect(mockCourier.lists.subscriptions.subscribeUser).toHaveBeenCalledWith('user-1', expect.objectContaining({ list_id: 'list-1' }));
  });

  it('unsubscribe_user_from_list', async () => {
    await client.callTool({ name: 'unsubscribe_user_from_list', arguments: { list_id: 'list-1', user_id: 'user-1' } });
    expect(mockCourier.lists.subscriptions.unsubscribeUser).toHaveBeenCalledWith('user-1', { list_id: 'list-1' });
  });

  // --- Profiles ---

  it('get_user_list_subscriptions', async () => {
    await client.callTool({ name: 'get_user_list_subscriptions', arguments: { user_id: 'user-1' } });
    expect(mockCourier.profiles.lists.retrieve).toHaveBeenCalledWith('user-1', {});
  });

  it('delete_user_list_subscriptions', async () => {
    await client.callTool({ name: 'delete_user_list_subscriptions', arguments: { user_id: 'user-1' } });
    expect(mockCourier.profiles.lists.delete).toHaveBeenCalledWith('user-1');
  });

  // --- Config (diagnostic, not in defaultTools) ---

  it('get_environment_config returns masked key and session info', async () => {
    const result = await client.callTool({ name: 'get_environment_config', arguments: {} });
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed.apiKey).toBe('***');
    expect(parsed.baseUrl).toBeDefined();
    expect(parsed.version).toBeDefined();
    expect(parsed.toolCount).toBeGreaterThan(0);
  });
});

describe('Custom response shapes', () => {
  let client: Client;
  let mockCourier: ReturnType<typeof createMockCourier>;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    ({ client, mockCourier, cleanup } = await createTestClient());
  });

  afterEach(async () => { await cleanup(); });

  it('delete_audience returns success shape', async () => {
    const result = await client.callTool({ name: 'delete_audience', arguments: { audience_id: 'aud-1' } });
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.message).toContain('aud-1');
  });

  it('create_list returns success with list_id and name', async () => {
    const result = await client.callTool({ name: 'create_list', arguments: { list_id: 'list-new', name: 'New List' } });
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed).toEqual({ success: true, list_id: 'list-new', name: 'New List' });
  });

  it('subscribe_user_to_list returns success with IDs', async () => {
    const result = await client.callTool({ name: 'subscribe_user_to_list', arguments: { list_id: 'l-1', user_id: 'u-1' } });
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed).toEqual({ success: true, list_id: 'l-1', user_id: 'u-1' });
  });

  it('unsubscribe_user_from_list returns success message', async () => {
    const result = await client.callTool({ name: 'unsubscribe_user_from_list', arguments: { list_id: 'l-1', user_id: 'u-1' } });
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.message).toContain('u-1');
  });

  it('create_or_replace_user_push_token returns success with token', async () => {
    const result = await client.callTool({ name: 'create_or_replace_user_push_token', arguments: {
      user_id: 'u-1', token: 'tok-abc', provider_key: 'apn'
    }});
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed).toEqual({ success: true, user_id: 'u-1', token: 'tok-abc' });
  });

  it('add_user_to_tenant returns success with IDs', async () => {
    const result = await client.callTool({ name: 'add_user_to_tenant', arguments: { user_id: 'u-1', tenant_id: 't-1' } });
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed).toEqual({ success: true, user_id: 'u-1', tenant_id: 't-1' });
  });

  it('remove_user_from_tenant returns success message', async () => {
    const result = await client.callTool({ name: 'remove_user_from_tenant', arguments: { user_id: 'u-1', tenant_id: 't-1' } });
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.message).toContain('u-1');
  });

  it('delete_profile returns success message', async () => {
    const result = await client.callTool({ name: 'delete_profile', arguments: { user_id: 'u-1' } });
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.message).toContain('u-1');
  });

  it('run_bulk_job returns success with job_id', async () => {
    const result = await client.callTool({ name: 'run_bulk_job', arguments: { job_id: 'job-1' } });
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed).toEqual({ success: true, job_id: 'job-1', message: 'Bulk job started' });
  });

  it('add_bulk_users returns success with count', async () => {
    const result = await client.callTool({ name: 'add_bulk_users', arguments: { job_id: 'job-1', users: [{ user_id: 'a' }, { user_id: 'b' }] } });
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed).toEqual({ success: true, job_id: 'job-1', users_added: 2 });
  });

  it('update_translation returns success with locale', async () => {
    const result = await client.callTool({ name: 'update_translation', arguments: { locale: 'de_DE', body: 'msgid "hi"\nmsgstr "hallo"' } });
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed).toEqual({ success: true, locale: 'de_DE' });
  });
});

describe('Optional parameter branches', () => {
  let client: Client;
  let mockCourier: ReturnType<typeof createMockCourier>;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    ({ client, mockCourier, cleanup } = await createTestClient());
  });

  afterEach(async () => { await cleanup(); });

  it('create_or_replace_user_push_token includes device metadata', async () => {
    await client.callTool({ name: 'create_or_replace_user_push_token', arguments: {
      user_id: 'u-1', token: 'tok', provider_key: 'firebase-fcm',
      device: { app_id: 'com.example', platform: 'android' }
    }});
    expect(mockCourier.users.tokens.addSingle).toHaveBeenCalledWith('tok', expect.objectContaining({
      device: { app_id: 'com.example', platform: 'android' }
    }));
  });

  it('subscribe_user_to_list passes preferences when provided', async () => {
    await client.callTool({ name: 'subscribe_user_to_list', arguments: {
      list_id: 'l-1', user_id: 'u-1',
      preferences: { categories: { marketing: { status: 'OPTED_OUT' } } }
    }});
    const call = mockCourier.lists.subscriptions.subscribeUser.mock.calls[0];
    expect(call[1].preferences).toBeDefined();
    expect(call[1].preferences.categories.marketing.status).toBe('OPTED_OUT');
  });

  it('add_user_to_tenant passes profile overrides', async () => {
    await client.callTool({ name: 'add_user_to_tenant', arguments: {
      user_id: 'u-1', tenant_id: 't-1', profile: { role: 'admin' }
    }});
    expect(mockCourier.users.tenants.addSingle).toHaveBeenCalledWith('t-1', expect.objectContaining({
      profile: { role: 'admin' }
    }));
  });

  it('courier_installation_guide uses default user_id when not provided', async () => {
    await client.callTool({ name: 'courier_installation_guide', arguments: { platform: 'ios' } });
    const call = mockCourier.auth.issueToken.mock.calls[0][0];
    expect(call.scope).toContain('user_id:example_user');
  });

  it('list_lists passes pattern filter', async () => {
    await client.callTool({ name: 'list_lists', arguments: { pattern: 'beta.*' } });
    expect(mockCourier.lists.list).toHaveBeenCalledWith(expect.objectContaining({ pattern: 'beta.*' }));
  });

  it('list_user_tenants passes cursor and limit', async () => {
    await client.callTool({ name: 'list_user_tenants', arguments: { user_id: 'u-1', cursor: 'abc', limit: 5 } });
    expect(mockCourier.users.tenants.list).toHaveBeenCalledWith('u-1', { cursor: 'abc', limit: 5 });
  });

  it('get_user_preferences scopes to tenant', async () => {
    await client.callTool({ name: 'get_user_preferences', arguments: { user_id: 'u-1', tenant_id: 't-1' } });
    expect(mockCourier.users.preferences.retrieve).toHaveBeenCalledWith('u-1', { tenant_id: 't-1' });
  });

  it('update_user_preference_topic with custom routing', async () => {
    await client.callTool({ name: 'update_user_preference_topic', arguments: {
      user_id: 'u-1', topic_id: 'topic-1', status: 'OPTED_IN',
      has_custom_routing: true, custom_routing: ['email', 'push']
    }});
    const call = mockCourier.users.preferences.updateOrCreateTopic.mock.calls[0];
    expect(call[1].topic.has_custom_routing).toBe(true);
    expect(call[1].topic.custom_routing).toEqual(['email', 'push']);
  });

  it('invoke_automation_template with all optional params', async () => {
    await client.callTool({ name: 'invoke_automation_template', arguments: {
      template_id: 'tpl-1', recipient: 'u-1',
      brand: 'brand-1', data: { key: 'val' }, profile: { email: 'a@b.com' }, template: 'override'
    }});
    const call = mockCourier.automations.invoke.invokeByTemplate.mock.calls[0];
    expect(call[1].brand).toBe('brand-1');
    expect(call[1].data).toEqual({ key: 'val' });
    expect(call[1].profile).toEqual({ email: 'a@b.com' });
    expect(call[1].template).toBe('override');
  });

  it('get_list_subscribers passes cursor', async () => {
    await client.callTool({ name: 'get_list_subscribers', arguments: { list_id: 'l-1', cursor: 'page2' } });
    expect(mockCourier.lists.subscriptions.list).toHaveBeenCalledWith('l-1', { cursor: 'page2' });
  });

  it('get_user_list_subscriptions passes cursor', async () => {
    await client.callTool({ name: 'get_user_list_subscriptions', arguments: { user_id: 'u-1', cursor: 'next' } });
    expect(mockCourier.profiles.lists.retrieve).toHaveBeenCalledWith('u-1', { cursor: 'next' });
  });
});

describe('Tool filtering - registerToolIfNeeded respects availableTools', () => {
  it('excludes tools not in availableTools', async () => {
    const { client, cleanup } = await createTestClient(['send_message']);
    try {
      await expect(
        client.callTool({ name: 'get_audience', arguments: { audience_id: 'aud-1' } })
      ).rejects.toThrow(/not found/i);
    } finally {
      await cleanup();
    }
  });

  it('includes only specified tools', async () => {
    const { client, cleanup } = await createTestClient(['send_message', 'list_messages']);
    try {
      const tools = await client.listTools();
      const names = tools.tools.map((t: any) => t.name);
      expect(names).toContain('send_message');
      expect(names).toContain('list_messages');
      expect(names).not.toContain('get_audience');
      expect(names).not.toContain('get_environment_config');
    } finally {
      await cleanup();
    }
  });

  it('defaultTools does not include config tool', async () => {
    const { CourierMcpToolsRegistry } = await import('../utils/courier-mcp-tools-registry.js');
    const { client, cleanup } = await createTestClient(CourierMcpToolsRegistry.defaultTools);
    try {
      const tools = await client.listTools();
      const names = tools.tools.map((t: any) => t.name);
      expect(names).not.toContain('get_environment_config');
      expect(names.length).toBe(59);
    } finally {
      await cleanup();
    }
  });

  it('allAvailableTools includes config tool', async () => {
    const { CourierMcpToolsRegistry } = await import('../utils/courier-mcp-tools-registry.js');
    const { client, cleanup } = await createTestClient(CourierMcpToolsRegistry.allAvailableTools);
    try {
      const tools = await client.listTools();
      const names = tools.tools.map((t: any) => t.name);
      expect(names).toContain('get_environment_config');
      expect(names.length).toBe(60);
    } finally {
      await cleanup();
    }
  });
});
