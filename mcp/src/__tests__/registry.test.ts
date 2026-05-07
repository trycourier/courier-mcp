import { describe, it, expect } from 'vitest';
import { CourierMcpToolsRegistry } from '../utils/courier-mcp-tools-registry.js';
import { SendTools } from '../tools/send-tools.js';
import { MessagesTools } from '../tools/messages-tools.js';
import { BulkTools } from '../tools/bulk-tools.js';
import { ConfigTools } from '../tools/config-tools.js';
import { TenantsTools } from '../tools/tenants-tools.js';
import { UsersTools } from '../tools/users-tools.js';
import { ProvidersTools } from '../tools/providers-tools.js';

describe('CourierMcpToolsRegistry', () => {
  describe('defaultTools', () => {
    const defaults = CourierMcpToolsRegistry.defaultTools;

    it('includes core send tools', () => {
      for (const tool of SendTools.tools) {
        expect(defaults).toContain(tool);
      }
    });

    it('includes core messages tools', () => {
      for (const tool of MessagesTools.tools) {
        expect(defaults).toContain(tool);
      }
    });

    it('includes Bulk tools', () => {
      for (const tool of BulkTools.tools) {
        expect(defaults).toContain(tool);
      }
    });

    it('includes Tenants tools', () => {
      for (const tool of TenantsTools.tools) {
        expect(defaults).toContain(tool);
      }
    });

    it('includes Users tools', () => {
      for (const tool of UsersTools.tools) {
        expect(defaults).toContain(tool);
      }
    });

    it('does not include diagnostic tools', () => {
      for (const tool of ConfigTools.tools) {
        expect(defaults).not.toContain(tool);
      }
    });

    it('does not include opt-in provider write tools', () => {
      for (const tool of ProvidersTools.optInTools) {
        expect(defaults).not.toContain(tool);
      }
    });

    it('includes read-only provider tools', () => {
      for (const tool of ProvidersTools.tools) {
        expect(defaults).toContain(tool);
      }
    });

    it('does not include removed SDK context tools', () => {
      expect(defaults).not.toContain('get_courier_sdk_context');
      expect(defaults).not.toContain('scan_courier_imports');
      expect(defaults).not.toContain('get_courier_sdk_component_map');
    });

    it('has no duplicate entries', () => {
      const unique = new Set(defaults);
      expect(unique.size).toBe(defaults.length);
    });
  });

  describe('allAvailableTools', () => {
    const all = CourierMcpToolsRegistry.allAvailableTools;

    it('includes everything in defaultTools', () => {
      for (const tool of CourierMcpToolsRegistry.defaultTools) {
        expect(all).toContain(tool);
      }
    });

    it('includes ConfigTools', () => {
      for (const tool of ConfigTools.tools) {
        expect(all).toContain(tool);
      }
    });

    it('includes opt-in provider write tools', () => {
      for (const tool of ProvidersTools.optInTools) {
        expect(all).toContain(tool);
      }
    });

    it('has more tools than defaultTools', () => {
      expect(all.length).toBeGreaterThan(CourierMcpToolsRegistry.defaultTools.length);
    });

    it('has no duplicate entries', () => {
      const unique = new Set(all);
      expect(unique.size).toBe(all.length);
    });
  });
});
