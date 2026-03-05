import { describe, it, expect } from 'vitest';
import { CourierMcpToolsRegistry } from '../utils/courier-mcp-tools-registry.js';
import { SendTools } from '../tools/send-tools.js';
import { MessagesTools } from '../tools/messages-tools.js';
import { BulkTools } from '../tools/bulk-tools.js';
import { TenantsTools } from '../tools/tenants-tools.js';
import { UsersTools } from '../tools/users-tools.js';

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

    it('does not include removed tools', () => {
      expect(defaults).not.toContain('get_environment_config');
      expect(defaults).not.toContain('get_courier_sdk_context');
      expect(defaults).not.toContain('scan_courier_imports');
      expect(defaults).not.toContain('get_courier_sdk_component_map');
    });

    it('has no duplicate entries', () => {
      const unique = new Set(defaults);
      expect(unique.size).toBe(defaults.length);
    });
  });

  describe('allAvailableTools (deprecated alias)', () => {
    it('returns the same tools as defaultTools', () => {
      expect(CourierMcpToolsRegistry.allAvailableTools).toEqual(
        CourierMcpToolsRegistry.defaultTools
      );
    });
  });
});
