import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tokenManager } from '../tokenManager';

describe('TokenManager', () => {
  beforeEach(() => {
    // Clear localStorage and reset tokenManager state
    localStorage.clear();
    tokenManager.clearToken();
  });

  describe('setToken', () => {
    it('should store token in localStorage', () => {
      const token = 'test-token-123';
      tokenManager.setToken(token);
      
      expect(localStorage.getItem('token')).toBe(token);
      expect(tokenManager.getTokenSync()).toBe(token);
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage.setItem to throw error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      tokenManager.setToken('test-token');
      
      expect(tokenManager.getTokenSync()).toBeNull();
      
      // Restore original
      localStorage.setItem = originalSetItem;
    });
  });

  describe('getToken', () => {
    it('should return null when no token exists', async () => {
      const token = await tokenManager.getToken();
      expect(token).toBeNull();
    });

    it('should return valid token when token exists', async () => {
      // Create a valid JWT token (expires in 1 hour)
      const payload = {
        id: 'user123',
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      
      tokenManager.setToken(token);
      const result = await tokenManager.getToken();
      
      expect(result).toBe(token);
    });

    it('should return null for expired token', async () => {
      // Create expired token
      const payload = {
        id: 'user123',
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      
      tokenManager.setToken(token);
      const result = await tokenManager.getToken();
      
      expect(result).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should prevent race conditions during validation', async () => {
      const payload = {
        id: 'user123',
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      
      tokenManager.setToken(token);
      
      // Call getToken multiple times simultaneously
      const promises = [
        tokenManager.getToken(),
        tokenManager.getToken(),
        tokenManager.getToken(),
      ];
      
      const results = await Promise.all(promises);
      
      // All should return the same token
      expect(results.every(r => r === token)).toBe(true);
    });
  });

  describe('clearToken', () => {
    it('should remove token from localStorage', () => {
      tokenManager.setToken('test-token');
      tokenManager.clearToken();
      
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(tokenManager.getTokenSync()).toBeNull();
    });
  });

  describe('validateToken', () => {
    it('should return false for invalid JWT format', async () => {
      tokenManager.setToken('invalid-token');
      const result = await tokenManager.getToken();
      expect(result).toBeNull();
    });

    it('should return false for token with missing parts', async () => {
      tokenManager.setToken('header.payload'); // Missing signature
      const result = await tokenManager.getToken();
      expect(result).toBeNull();
    });

    it('should return false for token with empty parts', async () => {
      tokenManager.setToken('header..signature'); // Empty payload
      const result = await tokenManager.getToken();
      expect(result).toBeNull();
    });
  });

  describe('hasToken', () => {
    it('should return true when token exists', () => {
      tokenManager.setToken('test-token');
      expect(tokenManager.hasToken()).toBe(true);
    });

    it('should return false when no token exists', () => {
      expect(tokenManager.hasToken()).toBe(false);
    });
  });

  describe('getTokenSync', () => {
    it('should return token synchronously', () => {
      const token = 'test-token-123';
      tokenManager.setToken(token);
      expect(tokenManager.getTokenSync()).toBe(token);
    });

    it('should return null when no token exists', () => {
      expect(tokenManager.getTokenSync()).toBeNull();
    });
  });

  describe('initialize', () => {
    it('should initialize token from localStorage', () => {
      localStorage.setItem('token', 'stored-token');
      tokenManager.clearToken(); // Reset state
      
      // Force re-initialization by calling getTokenSync
      const token = tokenManager.getTokenSync();
      expect(token).toBe('stored-token');
    });

    it('should handle localStorage errors during initialization', () => {
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn(() => {
        throw new Error('Storage access denied');
      });

      tokenManager.clearToken();
      const token = tokenManager.getTokenSync();
      expect(token).toBeNull();
      
      // Restore original
      localStorage.getItem = originalGetItem;
    });
  });
});

