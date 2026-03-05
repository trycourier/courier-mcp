import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { createTestClient, createMockCourier } from './helpers.js';

describe('Tool coverage - one call per tool group', () => {
  let client: Client;
  let mockCourier: ReturnType<typeof createMockCourier>;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    ({ client, mockCourier, cleanup } = await createTestClient());
  });

  afterEach(async () => { await cleanup(); });

  it('get_audience', async () => {
    await client.callTool({ name: 'get_audience', arguments: { audience_id: 'aud-1' } });
    expect(mockCourier.audiences.retrieve).toHaveBeenCalledWith('aud-1');
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

  it('generate_jwt_for_user', async () => {
    const result = await client.callTool({ name: 'generate_jwt_for_user', arguments: { user_id: 'user-1' } });
    expect(mockCourier.auth.issueToken).toHaveBeenCalled();
    const parsed = JSON.parse((result.content as any)[0].text);
    expect(parsed.token).toBe('jwt-token-123');
  });

  it('list_user_push_tokens', async () => {
    await client.callTool({ name: 'list_user_push_tokens', arguments: { user_id: 'user-1' } });
    expect(mockCourier.users.tokens.list).toHaveBeenCalledWith('user-1');
  });

  it('invoke_automation_template', async () => {
    await client.callTool({ name: 'invoke_automation_template', arguments: { template_id: 'tpl-1', recipient: 'user-1' } });
    expect(mockCourier.automations.invoke.invokeByTemplate).toHaveBeenCalledWith('tpl-1', expect.objectContaining({ recipient: 'user-1' }));
  });

  it('invoke_ad_hoc_automation', async () => {
    await client.callTool({ name: 'invoke_ad_hoc_automation', arguments: { automation: { steps: [{ action: 'send', template: 't-1' }] } } });
    expect(mockCourier.automations.invoke.invokeAdHoc).toHaveBeenCalled();
  });

  it('create_bulk_job', async () => {
    await client.callTool({ name: 'create_bulk_job', arguments: { message: { event: 'evt' } } });
    expect(mockCourier.bulk.createJob).toHaveBeenCalled();
  });

  it('track_inbound_event', async () => {
    await client.callTool({ name: 'track_inbound_event', arguments: { event: 'order_placed', messageId: 'uuid-1', properties: { orderId: 1 } } });
    expect(mockCourier.inbound.trackEvent).toHaveBeenCalled();
  });

  it('list_audit_events', async () => {
    await client.callTool({ name: 'list_audit_events', arguments: {} });
    expect(mockCourier.auditEvents.list).toHaveBeenCalled();
  });

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

  it('get_translation', async () => {
    await client.callTool({ name: 'get_translation', arguments: { locale: 'fr_FR' } });
    expect(mockCourier.translations.retrieve).toHaveBeenCalledWith('fr_FR', expect.objectContaining({ domain: 'default' }));
  });

  it('get_user_preferences', async () => {
    await client.callTool({ name: 'get_user_preferences', arguments: { user_id: 'user-1' } });
    expect(mockCourier.users.preferences.retrieve).toHaveBeenCalledWith('user-1', {});
  });

  it('add_user_to_tenant', async () => {
    await client.callTool({ name: 'add_user_to_tenant', arguments: { user_id: 'user-1', tenant_id: 't-1' } });
    expect(mockCourier.users.tenants.addSingle).toHaveBeenCalledWith('t-1', expect.objectContaining({ user_id: 'user-1' }));
  });

  it('list_lists', async () => {
    await client.callTool({ name: 'list_lists', arguments: {} });
    expect(mockCourier.lists.list).toHaveBeenCalled();
  });

  it('subscribe_user_to_list', async () => {
    await client.callTool({ name: 'subscribe_user_to_list', arguments: { list_id: 'list-1', user_id: 'user-1' } });
    expect(mockCourier.lists.subscriptions.subscribeUser).toHaveBeenCalledWith('user-1', expect.objectContaining({ list_id: 'list-1' }));
  });
});
