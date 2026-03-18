import { describe, it, expect, afterEach } from 'vitest';
import { CourierMcpConfig } from '../utils/config.js';
import { CourierMcpLogLevel } from '../utils/types.js';
import { CourierMcpToolsRegistry } from '../utils/courier-mcp-tools-registry.js';

describe('CourierMcpConfig', () => {

  const origEnv = { ...process.env };
  afterEach(() => {
    process.env = { ...origEnv };
  });

  describe('apiKey resolution', () => {
    it('reads API_KEY header (uppercase)', () => {
      const config = new CourierMcpConfig({ headers: { API_KEY: 'key-upper' } });
      expect(config.apiKey).toBe('key-upper');
    });

    it('reads api_key header (lowercase)', () => {
      const config = new CourierMcpConfig({ headers: { api_key: 'key-lower' } });
      expect(config.apiKey).toBe('key-lower');
    });

    it('prefers uppercase API_KEY over lowercase', () => {
      const config = new CourierMcpConfig({ headers: { API_KEY: 'upper', api_key: 'lower' } });
      expect(config.apiKey).toBe('upper');
    });

    it('falls back to COURIER_API_KEY env var', () => {
      process.env.COURIER_API_KEY = 'env-key';
      const config = new CourierMcpConfig({ headers: {} });
      expect(config.apiKey).toBe('env-key');
    });

    it('defaults to empty string when nothing set', () => {
      delete process.env.COURIER_API_KEY;
      const config = new CourierMcpConfig({ headers: {} });
      expect(config.apiKey).toBe('');
    });

    it('works with no headers at all', () => {
      delete process.env.COURIER_API_KEY;
      const config = new CourierMcpConfig({});
      expect(config.apiKey).toBe('');
    });
  });

  describe('baseUrl resolution', () => {
    it('reads BASE_URL header (uppercase)', () => {
      const config = new CourierMcpConfig({ headers: { API_KEY: 'k', BASE_URL: 'https://custom.api' } });
      expect(config.baseUrl).toBe('https://custom.api');
    });

    it('reads base_url header (lowercase)', () => {
      const config = new CourierMcpConfig({ headers: { API_KEY: 'k', base_url: 'https://custom2.api' } });
      expect(config.baseUrl).toBe('https://custom2.api');
    });

    it('falls back to COURIER_BASE_URL env var', () => {
      process.env.COURIER_BASE_URL = 'https://env.api';
      const config = new CourierMcpConfig({ headers: { API_KEY: 'k' } });
      expect(config.baseUrl).toBe('https://env.api');
    });

    it('defaults to https://api.courier.com', () => {
      delete process.env.COURIER_BASE_URL;
      const config = new CourierMcpConfig({ headers: { API_KEY: 'k' } });
      expect(config.baseUrl).toBe('https://api.courier.com');
    });
  });

  describe('logLevel', () => {
    it('defaults to ERROR', () => {
      const config = new CourierMcpConfig({});
      expect(config.logLevel).toBe(CourierMcpLogLevel.ERROR);
    });

    it('accepts explicit log level', () => {
      const config = new CourierMcpConfig({ logLevel: CourierMcpLogLevel.DEBUG });
      expect(config.logLevel).toBe(CourierMcpLogLevel.DEBUG);
    });
  });

  describe('availableTools', () => {
    it('defaults to defaultTools when not provided', () => {
      const config = new CourierMcpConfig({});
      expect(config.availableTools).toEqual(CourierMcpToolsRegistry.defaultTools);
    });

    it('does not include config tools by default', () => {
      const config = new CourierMcpConfig({});
      expect(config.availableTools).not.toContain('get_environment_config');
    });

    it('accepts explicit tool list', () => {
      const config = new CourierMcpConfig({ availableTools: ['send_message'] });
      expect(config.availableTools).toEqual(['send_message']);
    });
  });
});
