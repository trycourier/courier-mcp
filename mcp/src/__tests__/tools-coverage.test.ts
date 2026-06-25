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
    expect(mockCourier.notifications.retrieveContent).toHaveBeenCalledWith('n-1', { version: 'draft' });
  });

  // --- Brands ---

  it('create_brand', async () => {
    await client.callTool({ name: 'create_brand', arguments: { name: 'Acme', settings: { colors: { primary: '#000000', secondary: '#ffffff' } } } });
    expect(mockCourier.brands.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Acme', settings: { colors: { primary: '#000000', secondary: '#ffffff' } } }));
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

  // --- Notifications (new in PR #26 + #26b) ---

  it('create_notification', async () => {
    await client.callTool({ name: 'create_notification', arguments: {
      notification: { name: 'Test', tags: [], brand: null, subscription: null, routing: null, content: {} }
    }});
    expect(mockCourier.notifications.create).toHaveBeenCalled();
  });

  it('get_notification', async () => {
    await client.callTool({ name: 'get_notification', arguments: { notification_id: 'nt-1' } });
    expect(mockCourier.notifications.retrieve).toHaveBeenCalledWith('nt-1', undefined);
  });

  it('replace_notification', async () => {
    await client.callTool({ name: 'replace_notification', arguments: {
      notification_id: 'nt-1',
      notification: { name: 'Updated', tags: [], brand: null, subscription: null, routing: null, content: {} }
    }});
    expect(mockCourier.notifications.replace).toHaveBeenCalledWith('nt-1', expect.objectContaining({ notification: expect.any(Object) }));
  });

  it('archive_notification', async () => {
    await client.callTool({ name: 'archive_notification', arguments: { notification_id: 'nt-1' } });
    expect(mockCourier.notifications.archive).toHaveBeenCalledWith('nt-1');
  });

  it('list_notification_versions', async () => {
    await client.callTool({ name: 'list_notification_versions', arguments: { notification_id: 'nt-1' } });
    expect(mockCourier.notifications.listVersions).toHaveBeenCalledWith('nt-1', {});
  });

  it('publish_notification', async () => {
    await client.callTool({ name: 'publish_notification', arguments: { notification_id: 'nt-1' } });
    expect(mockCourier.notifications.publish).toHaveBeenCalledWith('nt-1', {});
  });

  it('list_notification_checks', async () => {
    await client.callTool({ name: 'list_notification_checks', arguments: { notification_id: 'nt-1', submission_id: 'sub-1' } });
    expect(mockCourier.notifications.checks.list).toHaveBeenCalledWith('sub-1', { id: 'nt-1' });
  });

  it('update_notification_checks', async () => {
    await client.callTool({ name: 'update_notification_checks', arguments: {
      notification_id: 'nt-1', submission_id: 'sub-1',
      checks: [{ id: 'chk-1', status: 'RESOLVED', type: 'custom' }]
    }});
    expect(mockCourier.notifications.checks.update).toHaveBeenCalledWith('sub-1', expect.objectContaining({ id: 'nt-1' }));
  });

  it('put_notification_content', async () => {
    await client.callTool({ name: 'put_notification_content', arguments: {
      notification_id: 'nt-1', elements: [{ type: 'text', content: 'Hello' }]
    }});
    expect(mockCourier.notifications.putContent).toHaveBeenCalledWith('nt-1', expect.objectContaining({ content: { elements: [{ type: 'text', content: 'Hello' }] } }));
  });

  it('put_notification_element', async () => {
    await client.callTool({ name: 'put_notification_element', arguments: {
      notification_id: 'nt-1', element_id: 'el-1', type: 'text'
    }});
    expect(mockCourier.notifications.putElement).toHaveBeenCalledWith('el-1', expect.objectContaining({ id: 'nt-1', type: 'text' }));
  });

  it('put_notification_locale', async () => {
    await client.callTool({ name: 'put_notification_locale', arguments: {
      notification_id: 'nt-1', locale_id: 'es', elements: [{ id: 'el-1', content: 'Hola' }]
    }});
    expect(mockCourier.notifications.putLocale).toHaveBeenCalledWith('es', expect.objectContaining({ id: 'nt-1', elements: [{ id: 'el-1', content: 'Hola' }] }));
  });

  it('cancel_notification_submission', async () => {
    await client.callTool({ name: 'cancel_notification_submission', arguments: { notification_id: 'nt-1', submission_id: 'sub-1' } });
    expect(mockCourier.notifications.checks.delete).toHaveBeenCalledWith('sub-1', { id: 'nt-1' });
  });

  // --- Brands (new in PR #26) ---

  it('update_brand', async () => {
    await client.callTool({ name: 'update_brand', arguments: { brand_id: 'b-1', name: 'Updated' } });
    expect(mockCourier.brands.update).toHaveBeenCalledWith('b-1', expect.objectContaining({ name: 'Updated' }));
  });

  it('delete_brand', async () => {
    await client.callTool({ name: 'delete_brand', arguments: { brand_id: 'b-1' } });
    expect(mockCourier.brands.delete).toHaveBeenCalledWith('b-1');
  });

  // --- Lists (new in PR #26) ---

  it('delete_list', async () => {
    await client.callTool({ name: 'delete_list', arguments: { list_id: 'list-1' } });
    expect(mockCourier.lists.delete).toHaveBeenCalledWith('list-1');
  });

  it('restore_list', async () => {
    await client.callTool({ name: 'restore_list', arguments: { list_id: 'list-1' } });
    expect(mockCourier.lists.restore).toHaveBeenCalledWith('list-1', {});
  });

  it('bulk_subscribe_to_list', async () => {
    await client.callTool({ name: 'bulk_subscribe_to_list', arguments: { list_id: 'l-1', recipients: [{ recipientId: 'u-1' }] } });
    expect(mockCourier.lists.subscriptions.subscribe).toHaveBeenCalledWith('l-1', { recipients: [{ recipientId: 'u-1' }] });
  });

  it('add_subscribers_to_list', async () => {
    await client.callTool({ name: 'add_subscribers_to_list', arguments: { list_id: 'l-1', recipients: [{ recipientId: 'u-1' }] } });
    expect(mockCourier.lists.subscriptions.add).toHaveBeenCalledWith('l-1', { recipients: [{ recipientId: 'u-1' }] });
  });

  // --- Profiles (new in PR #26) ---

  it('patch_profile', async () => {
    await client.callTool({ name: 'patch_profile', arguments: {
      user_id: 'u-1', patch: [{ op: 'replace', path: '/email', value: 'new@test.com' }]
    }});
    expect(mockCourier.profiles.update).toHaveBeenCalledWith('u-1', expect.objectContaining({ patch: expect.any(Array) }));
  });

  // --- User Tokens (new in PR #26) ---

  it('patch_user_token', async () => {
    await client.callTool({ name: 'patch_user_token', arguments: {
      user_id: 'u-1', token: 'tok-1', patch: [{ op: 'replace', path: '/status', value: 'active' }]
    }});
    expect(mockCourier.users.tokens.update).toHaveBeenCalledWith('tok-1', expect.objectContaining({ user_id: 'u-1' }));
  });

  it('delete_user_token', async () => {
    await client.callTool({ name: 'delete_user_token', arguments: { user_id: 'u-1', token: 'tok-1' } });
    expect(mockCourier.users.tokens.delete).toHaveBeenCalledWith('tok-1', { user_id: 'u-1' });
  });

  it('bulk_add_user_tokens', async () => {
    await client.callTool({ name: 'bulk_add_user_tokens', arguments: {
      user_id: 'u-1',
      tokens: [
        { token: 'tok-a', provider_key: 'firebase-fcm' },
        { token: 'tok-b', provider_key: 'apn' },
      ],
    }});
    expect(mockCourier.users.tokens.addMultiple).toHaveBeenCalledWith('u-1', {
      body: {
        tokens: [
          { token: 'tok-a', provider_key: 'firebase-fcm' },
          { token: 'tok-b', provider_key: 'apn' },
        ],
      },
    });
  });

  // --- Users (new in PR #26) ---

  it('get_user_preference_topic', async () => {
    await client.callTool({ name: 'get_user_preference_topic', arguments: { user_id: 'u-1', topic_id: 'topic-1' } });
    expect(mockCourier.users.preferences.retrieveTopic).toHaveBeenCalledWith('topic-1', expect.objectContaining({ user_id: 'u-1' }));
  });

  it('bulk_add_user_tenants', async () => {
    await client.callTool({ name: 'bulk_add_user_tenants', arguments: {
      user_id: 'u-1', tenants: [{ tenant_id: 't-1' }, { tenant_id: 't-2' }]
    }});
    expect(mockCourier.users.tenants.addMultiple).toHaveBeenCalledWith('u-1', expect.objectContaining({ tenants: expect.any(Array) }));
  });

  it('remove_all_user_tenants', async () => {
    await client.callTool({ name: 'remove_all_user_tenants', arguments: { user_id: 'u-1' } });
    expect(mockCourier.users.tenants.removeAll).toHaveBeenCalledWith('u-1');
  });

  // --- Tenants (new in PR #26) ---

  it('list_tenant_users', async () => {
    await client.callTool({ name: 'list_tenant_users', arguments: { tenant_id: 't-1' } });
    expect(mockCourier.tenants.listUsers).toHaveBeenCalledWith('t-1', {});
  });

  it('update_tenant_preference', async () => {
    await client.callTool({ name: 'update_tenant_preference', arguments: {
      tenant_id: 't-1', topic_id: 'topic-1', status: 'OPTED_IN'
    }});
    expect(mockCourier.tenants.preferences.items.update).toHaveBeenCalledWith('topic-1', expect.objectContaining({ tenant_id: 't-1', status: 'OPTED_IN' }));
  });

  it('delete_tenant_preference', async () => {
    await client.callTool({ name: 'delete_tenant_preference', arguments: { tenant_id: 't-1', topic_id: 'topic-1' } });
    expect(mockCourier.tenants.preferences.items.delete).toHaveBeenCalledWith('topic-1', { tenant_id: 't-1' });
  });

  it('list_tenant_templates', async () => {
    await client.callTool({ name: 'list_tenant_templates', arguments: { tenant_id: 't-1' } });
    expect(mockCourier.tenants.templates.list).toHaveBeenCalledWith('t-1', {});
  });

  it('get_tenant_template', async () => {
    await client.callTool({ name: 'get_tenant_template', arguments: { tenant_id: 't-1', template_id: 'tmpl-1' } });
    expect(mockCourier.tenants.templates.retrieve).toHaveBeenCalledWith('tmpl-1', { tenant_id: 't-1' });
  });

  it('replace_tenant_template', async () => {
    await client.callTool({ name: 'replace_tenant_template', arguments: {
      tenant_id: 't-1', template_id: 'tmpl-1', content: { elements: [], version: '1' }
    }});
    expect(mockCourier.tenants.templates.replace).toHaveBeenCalledWith('tmpl-1', expect.objectContaining({ tenant_id: 't-1' }));
  });

  it('publish_tenant_template', async () => {
    await client.callTool({ name: 'publish_tenant_template', arguments: { tenant_id: 't-1', template_id: 'tmpl-1' } });
    expect(mockCourier.tenants.templates.publish).toHaveBeenCalledWith('tmpl-1', expect.objectContaining({ tenant_id: 't-1' }));
  });

  it('get_tenant_template_version', async () => {
    await client.callTool({ name: 'get_tenant_template_version', arguments: { tenant_id: 't-1', template_id: 'tmpl-1', version: 'v1' } });
    expect(mockCourier.tenants.templates.versions.retrieve).toHaveBeenCalledWith('v1', { tenant_id: 't-1', template_id: 'tmpl-1' });
  });

  it('delete_tenant_template', async () => {
    await client.callTool({ name: 'delete_tenant_template', arguments: { tenant_id: 't-1', template_id: 'tmpl-1' } });
    expect(mockCourier.tenants.templates.delete).toHaveBeenCalledWith('tmpl-1', { tenant_id: 't-1' });
  });

  // --- Automations (new in PR #26) ---

  it('list_automations', async () => {
    await client.callTool({ name: 'list_automations', arguments: {} });
    expect(mockCourier.automations.list).toHaveBeenCalled();
  });

  // --- Routing Strategies (new in PR #26 + #26b) ---

  it('create_routing_strategy', async () => {
    await client.callTool({ name: 'create_routing_strategy', arguments: {
      name: 'Default', routing: { method: 'single', channels: ['email'] }
    }});
    expect(mockCourier.routingStrategies.create).toHaveBeenCalled();
  });

  it('get_routing_strategy', async () => {
    await client.callTool({ name: 'get_routing_strategy', arguments: { routing_strategy_id: 'rs-1' } });
    expect(mockCourier.routingStrategies.retrieve).toHaveBeenCalledWith('rs-1');
  });

  it('replace_routing_strategy', async () => {
    await client.callTool({ name: 'replace_routing_strategy', arguments: {
      routing_strategy_id: 'rs-1', name: 'Updated', routing: { method: 'all', channels: ['email', 'sms'] }
    }});
    expect(mockCourier.routingStrategies.replace).toHaveBeenCalledWith('rs-1', expect.objectContaining({ name: 'Updated' }));
  });

  it('archive_routing_strategy', async () => {
    await client.callTool({ name: 'archive_routing_strategy', arguments: { routing_strategy_id: 'rs-1' } });
    expect(mockCourier.routingStrategies.archive).toHaveBeenCalledWith('rs-1');
  });

  it('list_routing_strategies', async () => {
    await client.callTool({ name: 'list_routing_strategies', arguments: {} });
    expect(mockCourier.routingStrategies.list).toHaveBeenCalled();
  });

  it('list_routing_strategy_notifications', async () => {
    await client.callTool({ name: 'list_routing_strategy_notifications', arguments: { routing_strategy_id: 'rs-1' } });
    expect(mockCourier.routingStrategies.listNotifications).toHaveBeenCalledWith('rs-1', {});
  });

  // --- Journeys (new in PR #26) ---

  it('list_journeys', async () => {
    await client.callTool({ name: 'list_journeys', arguments: {} });
    expect(mockCourier.journeys.list).toHaveBeenCalled();
  });

  it('invoke_journey', async () => {
    await client.callTool({ name: 'invoke_journey', arguments: { template_id: 'j-1' } });
    expect(mockCourier.journeys.invoke).toHaveBeenCalledWith('j-1', {});
  });

  it('create_journey', async () => {
    await client.callTool({ name: 'create_journey', arguments: { name: 'Test Journey', nodes: [{ id: 'trigger-1', type: 'trigger', trigger_type: 'api' }] } });
    expect(mockCourier.journeys.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Test Journey' }));
  });

  it('get_journey', async () => {
    await client.callTool({ name: 'get_journey', arguments: { journey_id: 'j-1' } });
    expect(mockCourier.journeys.retrieve).toHaveBeenCalledWith('j-1', undefined);
  });

  it('replace_journey', async () => {
    await client.callTool({ name: 'replace_journey', arguments: { journey_id: 'j-1', name: 'Updated Journey', nodes: [] } });
    expect(mockCourier.journeys.replace).toHaveBeenCalledWith('j-1', expect.objectContaining({ name: 'Updated Journey' }));
  });

  it('publish_journey', async () => {
    await client.callTool({ name: 'publish_journey', arguments: { journey_id: 'j-1' } });
    expect(mockCourier.journeys.publish).toHaveBeenCalledWith('j-1', undefined);
  });

  it('archive_journey', async () => {
    await client.callTool({ name: 'archive_journey', arguments: { journey_id: 'j-1' } });
    expect(mockCourier.journeys.archive).toHaveBeenCalledWith('j-1');
  });

  it('list_journey_versions', async () => {
    await client.callTool({ name: 'list_journey_versions', arguments: { journey_id: 'j-1' } });
    expect(mockCourier.journeys.listVersions).toHaveBeenCalledWith('j-1');
  });

  it('list_journey_templates', async () => {
    await client.callTool({ name: 'list_journey_templates', arguments: { journey_id: 'j-1' } });
    expect(mockCourier.journeys.templates.list).toHaveBeenCalledWith('j-1', {});
  });

  it('create_journey_template', async () => {
    await client.callTool({
      name: 'create_journey_template',
      arguments: {
        journey_id: 'j-1',
        channel: 'email',
        notification: {
          name: 'Welcome',
          tags: [],
          brand: null,
          subscription: null,
          content: { version: '2022-01-01', elements: [{ type: 'text', content: 'Hi!' }] },
        },
      },
    });
    expect(mockCourier.journeys.templates.create).toHaveBeenCalledWith('j-1', expect.objectContaining({ channel: 'email' }));
  });

  it('get_journey_template', async () => {
    await client.callTool({ name: 'get_journey_template', arguments: { notification_id: 'jt-1', journey_id: 'j-1' } });
    expect(mockCourier.journeys.templates.retrieve).toHaveBeenCalledWith('jt-1', expect.objectContaining({ templateId: 'j-1' }), undefined);
  });

  it('replace_journey_template', async () => {
    await client.callTool({
      name: 'replace_journey_template',
      arguments: {
        notification_id: 'jt-1',
        journey_id: 'j-1',
        notification: {
          name: 'Welcome v2',
          tags: [],
          brand: null,
          subscription: null,
          content: { version: '2022-01-01', elements: [] },
        },
      },
    });
    expect(mockCourier.journeys.templates.replace).toHaveBeenCalledWith('jt-1', expect.objectContaining({ templateId: 'j-1' }));
  });

  it('archive_journey_template', async () => {
    await client.callTool({ name: 'archive_journey_template', arguments: { notification_id: 'jt-1', journey_id: 'j-1' } });
    expect(mockCourier.journeys.templates.archive).toHaveBeenCalledWith('jt-1', { templateId: 'j-1' });
  });

  it('publish_journey_template', async () => {
    await client.callTool({ name: 'publish_journey_template', arguments: { notification_id: 'jt-1', journey_id: 'j-1' } });
    expect(mockCourier.journeys.templates.publish).toHaveBeenCalledWith('jt-1', expect.objectContaining({ templateId: 'j-1' }));
  });

  it('list_journey_template_versions', async () => {
    await client.callTool({ name: 'list_journey_template_versions', arguments: { notification_id: 'jt-1', journey_id: 'j-1' } });
    expect(mockCourier.journeys.templates.listVersions).toHaveBeenCalledWith('jt-1', { templateId: 'j-1' });
  });

  // --- Requests (new in PR #26) ---

  it('archive_request', async () => {
    await client.callTool({ name: 'archive_request', arguments: { request_id: 'req-1' } });
    expect(mockCourier.requests.archive).toHaveBeenCalledWith('req-1');
  });

  // --- Providers (new) ---

  it('list_providers', async () => {
    await client.callTool({ name: 'list_providers', arguments: {} });
    expect(mockCourier.providers.list).toHaveBeenCalled();
  });

  it('create_provider', async () => {
    await client.callTool({ name: 'create_provider', arguments: { provider: 'sendgrid' } });
    expect(mockCourier.providers.create).toHaveBeenCalledWith(expect.objectContaining({ provider: 'sendgrid' }));
  });

  it('get_provider', async () => {
    await client.callTool({ name: 'get_provider', arguments: { provider_id: 'prov-1' } });
    expect(mockCourier.providers.retrieve).toHaveBeenCalledWith('prov-1');
  });

  it('update_provider', async () => {
    await client.callTool({ name: 'update_provider', arguments: { provider_id: 'prov-1', provider: 'sendgrid', title: 'SG' } });
    expect(mockCourier.providers.update).toHaveBeenCalledWith('prov-1', expect.objectContaining({ provider: 'sendgrid', title: 'SG' }));
  });

  it('delete_provider', async () => {
    await client.callTool({ name: 'delete_provider', arguments: { provider_id: 'prov-1' } });
    expect(mockCourier.providers.delete).toHaveBeenCalledWith('prov-1');
  });

  it('list_provider_catalog', async () => {
    await client.callTool({ name: 'list_provider_catalog', arguments: {} });
    expect(mockCourier.providers.catalog.list).toHaveBeenCalled();
  });

  // --- Preference Sections (raw HTTP escape hatch) ---

  it('list_preference_sections', async () => {
    await client.callTool({ name: 'list_preference_sections', arguments: {} });
    expect(mockCourier.get).toHaveBeenCalledWith('/preferences/sections');
  });

  it('create_preference_section', async () => {
    await client.callTool({ name: 'create_preference_section', arguments: { name: 'Account', routing_options: ['email'] } });
    expect(mockCourier.post).toHaveBeenCalledWith('/preferences/sections', { body: expect.objectContaining({ name: 'Account', routing_options: ['email'] }) });
  });

  it('get_preference_section', async () => {
    await client.callTool({ name: 'get_preference_section', arguments: { section_id: 'sec-1' } });
    expect(mockCourier.get).toHaveBeenCalledWith('/preferences/sections/sec-1');
  });

  it('replace_preference_section', async () => {
    await client.callTool({ name: 'replace_preference_section', arguments: { section_id: 'sec-1', name: 'Renamed' } });
    expect(mockCourier.put).toHaveBeenCalledWith('/preferences/sections/sec-1', { body: expect.objectContaining({ name: 'Renamed' }) });
  });

  it('archive_preference_section', async () => {
    await client.callTool({ name: 'archive_preference_section', arguments: { section_id: 'sec-1' } });
    expect(mockCourier.delete).toHaveBeenCalledWith('/preferences/sections/sec-1');
  });

  it('publish_preferences', async () => {
    await client.callTool({ name: 'publish_preferences', arguments: {} });
    expect(mockCourier.post).toHaveBeenCalledWith('/preferences/publish');
  });

  it('list_preference_topics', async () => {
    await client.callTool({ name: 'list_preference_topics', arguments: { section_id: 'sec-1' } });
    expect(mockCourier.get).toHaveBeenCalledWith('/preferences/sections/sec-1/topics');
  });

  it('create_preference_topic', async () => {
    await client.callTool({ name: 'create_preference_topic', arguments: { section_id: 'sec-1', name: 'Marketing', default_status: 'OPTED_OUT' } });
    expect(mockCourier.post).toHaveBeenCalledWith('/preferences/sections/sec-1/topics', { body: expect.objectContaining({ name: 'Marketing', default_status: 'OPTED_OUT' }) });
  });

  it('get_preference_topic', async () => {
    await client.callTool({ name: 'get_preference_topic', arguments: { section_id: 'sec-1', topic_id: 'top-1' } });
    expect(mockCourier.get).toHaveBeenCalledWith('/preferences/sections/sec-1/topics/top-1');
  });

  it('replace_preference_topic', async () => {
    await client.callTool({ name: 'replace_preference_topic', arguments: { section_id: 'sec-1', topic_id: 'top-1', name: 'Updates', default_status: 'OPTED_IN' } });
    expect(mockCourier.put).toHaveBeenCalledWith('/preferences/sections/sec-1/topics/top-1', { body: expect.objectContaining({ name: 'Updates', default_status: 'OPTED_IN' }) });
  });

  it('archive_preference_topic', async () => {
    await client.callTool({ name: 'archive_preference_topic', arguments: { section_id: 'sec-1', topic_id: 'top-1' } });
    expect(mockCourier.delete).toHaveBeenCalledWith('/preferences/sections/sec-1/topics/top-1');
  });

  // --- Digests (raw HTTP escape hatch) ---

  it('release_digest', async () => {
    await client.callTool({ name: 'release_digest', arguments: { schedule_id: 'sch/abc' } });
    expect(mockCourier.post).toHaveBeenCalledWith('/digests/schedules/sch%2Fabc/trigger');
  });

  it('list_digest_instances', async () => {
    await client.callTool({ name: 'list_digest_instances', arguments: { schedule_id: 'sch/abc', limit: 50 } });
    expect(mockCourier.get).toHaveBeenCalledWith('/digests/schedules/sch%2Fabc/instances', { query: expect.objectContaining({ limit: 50 }) });
  });

  // --- Journey template content (raw HTTP escape hatch) ---

  it('get_journey_template_content', async () => {
    await client.callTool({ name: 'get_journey_template_content', arguments: { journey_id: 'j-1', notification_id: 'n-1', version: 'draft' } });
    expect(mockCourier.get).toHaveBeenCalledWith('/journeys/j-1/templates/n-1/content', { query: expect.objectContaining({ version: 'draft' }) });
  });

  it('put_journey_template_content', async () => {
    await client.callTool({ name: 'put_journey_template_content', arguments: { journey_id: 'j-1', notification_id: 'n-1', elements: [] } });
    expect(mockCourier.put).toHaveBeenCalledWith('/journeys/j-1/templates/n-1/content', { body: expect.objectContaining({ content: { elements: [] } }) });
  });

  it('put_journey_template_locale', async () => {
    await client.callTool({ name: 'put_journey_template_locale', arguments: { journey_id: 'j-1', notification_id: 'n-1', locale_id: 'es', elements: [{ id: 'e-1' }] } });
    expect(mockCourier.put).toHaveBeenCalledWith('/journeys/j-1/templates/n-1/locales/es', { body: expect.objectContaining({ elements: [{ id: 'e-1' }] }) });
  });

  // --- Users (raw HTTP escape hatch) ---

  it('delete_user_preference_topic', async () => {
    await client.callTool({ name: 'delete_user_preference_topic', arguments: { user_id: 'u-1', topic_id: 'top-1' } });
    expect(mockCourier.delete).toHaveBeenCalledWith('/users/u-1/preferences/top-1');
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
      expect(names.length).toBe(140);
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
      expect(names.length).toBe(141);
    } finally {
      await cleanup();
    }
  });
});
