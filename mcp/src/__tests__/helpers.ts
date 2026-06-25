import { vi } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import CourierMcp, { CourierMcpConfig, CourierMcpLogLevel } from '../index.js';
import { CourierMcpToolsRegistry } from '../utils/courier-mcp-tools-registry.js';

export function createMockCourier() {
  return {
    // Raw HTTP escape-hatch methods used by tools whose typed SDK resource is
    // not yet published (preference sections, digests, journey template content).
    get: vi.fn().mockResolvedValue({ items: [] }),
    post: vi.fn().mockResolvedValue({ id: 'created-1' }),
    put: vi.fn().mockResolvedValue({ id: 'updated-1' }),
    delete: vi.fn().mockResolvedValue(undefined),
    send: { message: vi.fn().mockResolvedValue({ requestId: 'req-123' }) },
    messages: {
      retrieve: vi.fn().mockResolvedValue({ id: 'msg-1', status: 'DELIVERED' }),
      list: vi.fn().mockResolvedValue({ results: [], paging: {} }),
      cancel: vi.fn().mockResolvedValue({ id: 'msg-1', status: 'CANCELED' }),
      content: vi.fn().mockResolvedValue({ results: [] }),
      history: vi.fn().mockResolvedValue({ results: [] }),
    },
    profiles: {
      retrieve: vi.fn().mockResolvedValue({ profile: { email: 'test@example.com' } }),
      create: vi.fn().mockResolvedValue({ status: 'SUCCESS' }),
      replace: vi.fn().mockResolvedValue({ status: 'SUCCESS' }),
      update: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
      lists: {
        retrieve: vi.fn().mockResolvedValue({ results: [], paging: {} }),
        subscribe: vi.fn().mockResolvedValue({ status: 'SUCCESS' }),
        delete: vi.fn().mockResolvedValue({ status: 'SUCCESS' }),
      },
    },
    lists: {
      retrieve: vi.fn().mockResolvedValue({ id: 'list-1', name: 'Test' }),
      list: vi.fn().mockResolvedValue({ results: [], paging: {} }),
      update: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
      restore: vi.fn().mockResolvedValue(undefined),
      subscriptions: {
        list: vi.fn().mockResolvedValue({ items: [], paging: {} }),
        subscribeUser: vi.fn().mockResolvedValue(undefined),
        unsubscribeUser: vi.fn().mockResolvedValue(undefined),
        add: vi.fn().mockResolvedValue(undefined),
        subscribe: vi.fn().mockResolvedValue(undefined),
      },
    },
    audiences: {
      retrieve: vi.fn().mockResolvedValue({ id: 'aud-1' }),
      list: vi.fn().mockResolvedValue({ items: [] }),
      listMembers: vi.fn().mockResolvedValue({ items: [] }),
      update: vi.fn().mockResolvedValue({ id: 'aud-1' }),
      delete: vi.fn().mockResolvedValue(undefined),
    },
    notifications: {
      list: vi.fn().mockResolvedValue({ results: [], paging: {} }),
      retrieveContent: vi.fn().mockResolvedValue({ blocks: [], channels: [] }),
      create: vi.fn().mockResolvedValue({ notification: { id: 'nt-1' }, state: 'DRAFT' }),
      retrieve: vi.fn().mockResolvedValue({ notification: { id: 'nt-1', name: 'Test' }, state: 'PUBLISHED', created: 1, creator: 'u' }),
      replace: vi.fn().mockResolvedValue({ notification: { id: 'nt-1' }, state: 'DRAFT' }),
      archive: vi.fn().mockResolvedValue(undefined),
      listVersions: vi.fn().mockResolvedValue({ results: [], paging: {} }),
      publish: vi.fn().mockResolvedValue(undefined),
      putContent: vi.fn().mockResolvedValue({ id: 'nt-1', elements: [], state: 'DRAFT', version: 'v001' }),
      putElement: vi.fn().mockResolvedValue({ id: 'nt-1', elements: [], state: 'DRAFT', version: 'v001' }),
      putLocale: vi.fn().mockResolvedValue({ id: 'nt-1', elements: [], state: 'DRAFT', version: 'v001' }),
      checks: {
        list: vi.fn().mockResolvedValue({ checks: [] }),
        update: vi.fn().mockResolvedValue({ checks: [] }),
        delete: vi.fn().mockResolvedValue(undefined),
      },
    },
    brands: {
      create: vi.fn().mockResolvedValue({ id: 'brand-1', name: 'Test' }),
      retrieve: vi.fn().mockResolvedValue({ id: 'brand-1', name: 'Test' }),
      list: vi.fn().mockResolvedValue({ results: [], paging: {} }),
      update: vi.fn().mockResolvedValue({ id: 'brand-1', name: 'Updated' }),
      delete: vi.fn().mockResolvedValue(undefined),
    },
    auth: {
      issueToken: vi.fn().mockResolvedValue({ token: 'jwt-token-123' }),
    },
    automations: {
      list: vi.fn().mockResolvedValue({ templates: [] }),
      invoke: {
        invokeByTemplate: vi.fn().mockResolvedValue({ runId: 'run-1' }),
        invokeAdHoc: vi.fn().mockResolvedValue({ runId: 'run-2' }),
      },
    },
    bulk: {
      createJob: vi.fn().mockResolvedValue({ jobId: 'job-1' }),
      addUsers: vi.fn().mockResolvedValue(undefined),
      runJob: vi.fn().mockResolvedValue(undefined),
      retrieveJob: vi.fn().mockResolvedValue({ job: { status: 'CREATED' } }),
      listUsers: vi.fn().mockResolvedValue({ items: [] }),
    },
    inbound: {
      trackEvent: vi.fn().mockResolvedValue({ messageId: 'inb-1' }),
    },
    auditEvents: {
      retrieve: vi.fn().mockResolvedValue({ auditEventId: 'ae-1' }),
      list: vi.fn().mockResolvedValue({ results: [], paging: {} }),
    },
    tenants: {
      retrieve: vi.fn().mockResolvedValue({ id: 't-1', name: 'Acme' }),
      update: vi.fn().mockResolvedValue({ id: 't-1', name: 'Acme' }),
      list: vi.fn().mockResolvedValue({ items: [], has_more: false, type: 'list', url: '' }),
      delete: vi.fn().mockResolvedValue(undefined),
      listUsers: vi.fn().mockResolvedValue({ items: [], paging: {} }),
      preferences: {
        items: {
          update: vi.fn().mockResolvedValue({ message: 'ok' }),
          delete: vi.fn().mockResolvedValue(undefined),
        },
      },
      templates: {
        list: vi.fn().mockResolvedValue({ results: [], paging: {} }),
        retrieve: vi.fn().mockResolvedValue({ id: 'tmpl-1' }),
        replace: vi.fn().mockResolvedValue({ id: 'tmpl-1' }),
        publish: vi.fn().mockResolvedValue({ id: 'tmpl-1' }),
        delete: vi.fn().mockResolvedValue(undefined),
        versions: {
          retrieve: vi.fn().mockResolvedValue({ id: 'tmpl-1', version: 'v1' }),
        },
      },
    },
    translations: {
      retrieve: vi.fn().mockResolvedValue('msgid "hello"\nmsgstr "bonjour"'),
      update: vi.fn().mockResolvedValue(undefined),
    },
    users: {
      preferences: {
        retrieve: vi.fn().mockResolvedValue({ items: [], paging: {} }),
        retrieveTopic: vi.fn().mockResolvedValue({ topic: { id: 'topic-1', status: 'OPTED_IN' } }),
        updateOrCreateTopic: vi.fn().mockResolvedValue({ message: 'ok' }),
      },
      tenants: {
        list: vi.fn().mockResolvedValue({ items: [], has_more: false, type: 'list', url: '' }),
        addSingle: vi.fn().mockResolvedValue(undefined),
        removeSingle: vi.fn().mockResolvedValue(undefined),
        addMultiple: vi.fn().mockResolvedValue(undefined),
        removeAll: vi.fn().mockResolvedValue(undefined),
      },
      tokens: {
        list: vi.fn().mockResolvedValue({ tokens: [] }),
        retrieve: vi.fn().mockResolvedValue({ token: 'tok-1', provider_key: 'firebase-fcm' }),
        addSingle: vi.fn().mockResolvedValue(undefined),
        addMultiple: vi.fn().mockResolvedValue(undefined),
        update: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn().mockResolvedValue(undefined),
      },
    },
    routingStrategies: {
      create: vi.fn().mockResolvedValue({ id: 'rs-1' }),
      retrieve: vi.fn().mockResolvedValue({ id: 'rs-1', name: 'Default', routing: { method: 'single', channels: ['email'] }, channels: {}, providers: {}, created: 1, creator: 'u' }),
      replace: vi.fn().mockResolvedValue({ id: 'rs-1' }),
      archive: vi.fn().mockResolvedValue(undefined),
      list: vi.fn().mockResolvedValue({ results: [], paging: {} }),
      listNotifications: vi.fn().mockResolvedValue({ results: [], paging: {} }),
    },
    journeys: {
      list: vi.fn().mockResolvedValue({ templates: [], cursor: undefined }),
      invoke: vi.fn().mockResolvedValue({ runId: 'jr-1' }),
      create: vi.fn().mockResolvedValue({ id: 'j-new', name: 'Test Journey', version: 'draft' }),
      retrieve: vi.fn().mockResolvedValue({ id: 'j-1', name: 'Test Journey', version: 'published' }),
      replace: vi.fn().mockResolvedValue({ id: 'j-1', name: 'Test Journey', version: 'draft' }),
      publish: vi.fn().mockResolvedValue(undefined),
      archive: vi.fn().mockResolvedValue(undefined),
      listVersions: vi.fn().mockResolvedValue({ results: [], paging: {} }),
      templates: {
        list: vi.fn().mockResolvedValue({ results: [], paging: {} }),
        create: vi.fn().mockResolvedValue({ id: 'jt-new', name: 'Welcome Email', state: 'DRAFT' }),
        retrieve: vi.fn().mockResolvedValue({ id: 'jt-1', name: 'Welcome Email', state: 'PUBLISHED' }),
        replace: vi.fn().mockResolvedValue({ id: 'jt-1', name: 'Welcome Email', state: 'DRAFT' }),
        archive: vi.fn().mockResolvedValue(undefined),
        publish: vi.fn().mockResolvedValue(undefined),
        listVersions: vi.fn().mockResolvedValue({ results: [], paging: {} }),
      },
    },
    requests: {
      archive: vi.fn().mockResolvedValue(undefined),
    },
    providers: {
      list: vi.fn().mockResolvedValue({ results: [], paging: {} }),
      create: vi.fn().mockResolvedValue({ id: 'prov-1', provider: 'sendgrid', title: 'SendGrid', settings: {}, created: 1 }),
      retrieve: vi.fn().mockResolvedValue({ id: 'prov-1', provider: 'sendgrid', title: 'SendGrid', settings: {}, created: 1 }),
      update: vi.fn().mockResolvedValue({ id: 'prov-1', provider: 'sendgrid', title: 'SendGrid', settings: {}, created: 1 }),
      delete: vi.fn().mockResolvedValue(undefined),
      catalog: {
        list: vi.fn().mockResolvedValue({ results: [], paging: {} }),
      },
    },
  } as any;
}

export async function createTestClient(toolFilter?: string[]): Promise<{
  client: Client;
  mcp: CourierMcp;
  mockCourier: ReturnType<typeof createMockCourier>;
  cleanup: () => Promise<void>;
}> {
  const config = new CourierMcpConfig({
    headers: { API_KEY: 'test-api-key' },
    logLevel: CourierMcpLogLevel.ERROR,
    availableTools: toolFilter ?? CourierMcpToolsRegistry.allAvailableTools,
  });

  const mcp = new CourierMcp(config);
  const mockCourier = createMockCourier();
  (mcp as any).courier = mockCourier;

  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  const client = new Client({ name: 'test-client', version: '1.0.0' });

  await mcp.connect(serverTransport);
  await client.connect(clientTransport);

  return {
    client,
    mcp,
    mockCourier,
    cleanup: async () => {
      await client.close();
      await mcp.close();
    },
  };
}
