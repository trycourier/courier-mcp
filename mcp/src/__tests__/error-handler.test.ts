import { describe, it, expect } from 'vitest';
import { formatSuccess, formatError, handleToolCall } from '../utils/error-handler.js';
import {
  BadRequestError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  InternalServerError,
  APIConnectionError,
} from '@trycourier/courier/core/error';

describe('error-handler', () => {
  describe('formatSuccess', () => {
    it('wraps data as JSON text content', () => {
      const result = formatSuccess({ requestId: 'abc' });
      expect(result.isError).toBeUndefined();
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(JSON.parse(result.content[0].text)).toEqual({ requestId: 'abc' });
    });

    it('handles null and primitives', () => {
      expect(JSON.parse(formatSuccess(null).content[0].text)).toBeNull();
      expect(JSON.parse(formatSuccess(42).content[0].text)).toBe(42);
    });
  });

  describe('formatError', () => {
    it('handles BadRequestError with status and message', () => {
      const err = new BadRequestError(400, { message: 'Invalid body' }, 'Invalid body', new Headers());
      const result = formatError(err);
      expect(result.isError).toBe(true);
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.status).toBe(400);
      expect(parsed.message).toBe('Invalid body');
    });

    it('handles AuthenticationError', () => {
      const err = new AuthenticationError(401, { message: 'Unauthorized' }, 'Unauthorized', new Headers());
      const result = formatError(err);
      expect(result.isError).toBe(true);
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.status).toBe(401);
    });

    it('handles NotFoundError', () => {
      const err = new NotFoundError(404, { message: 'Not found' }, 'Not found', new Headers());
      const result = formatError(err);
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.status).toBe(404);
    });

    it('handles RateLimitError', () => {
      const err = new RateLimitError(429, { message: 'Too many requests' }, 'Too many requests', new Headers());
      const result = formatError(err);
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.status).toBe(429);
    });

    it('handles InternalServerError', () => {
      const err = new InternalServerError(500, { message: 'Server error' }, 'Server error', new Headers());
      const result = formatError(err);
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.status).toBe(500);
    });

    it('handles APIConnectionError', () => {
      const err = new APIConnectionError({ message: 'Network down' });
      const result = formatError(err);
      expect(result.isError).toBe(true);
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.message).toContain('Connection error');
    });

    it('handles generic Error', () => {
      const err = new Error('Something broke');
      const result = formatError(err);
      expect(result.isError).toBe(true);
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.message).toBe('Something broke');
    });

    it('handles non-Error thrown values', () => {
      const result = formatError('string error');
      expect(result.isError).toBe(true);
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.message).toBe('string error');
    });
  });

  describe('handleToolCall', () => {
    it('returns success for resolved promise', async () => {
      const result = await handleToolCall(() => Promise.resolve({ id: 1 }));
      expect(result.isError).toBeUndefined();
      expect(JSON.parse(result.content[0].text)).toEqual({ id: 1 });
    });

    it('catches and formats SDK errors', async () => {
      const result = await handleToolCall(() => {
        throw new NotFoundError(404, { message: 'Profile not found' }, 'Profile not found', new Headers());
      });
      expect(result.isError).toBe(true);
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.status).toBe(404);
      expect(parsed.message).toBe('Profile not found');
    });
  });
});
