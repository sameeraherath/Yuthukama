import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSafeUser, setUser, clearAuthData, setToken, getToken } from '../authUtils';
import { tokenManager } from '../tokenManager';

// Mock tokenManager
vi.mock('../tokenManager', () => ({
  tokenManager: {
    setToken: vi.fn(),
    clearToken: vi.fn(),
    getTokenSync: vi.fn(() => null),
  },
}));

describe('authUtils', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getSafeUser', () => {
    it('should return user from localStorage when valid JSON exists', () => {
      const user = { id: '123', username: 'testuser' };
      localStorage.setItem('user', JSON.stringify(user));
      
      const result = getSafeUser();
      expect(result).toEqual(user);
    });

    it('should return null when no user in localStorage', () => {
      const result = getSafeUser();
      expect(result).toBeNull();
    });

    it('should return null and remove invalid JSON from localStorage', () => {
      localStorage.setItem('user', 'invalid-json');
      
      const result = getSafeUser();
      expect(result).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should handle localStorage errors gracefully', () => {
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn(() => {
        throw new Error('Storage access denied');
      });

      const result = getSafeUser();
      expect(result).toBeNull();
      
      // Restore original
      localStorage.getItem = originalGetItem;
    });
  });

  describe('setUser', () => {
    it('should store user in localStorage', () => {
      const user = { id: '123', username: 'testuser' };
      setUser(user);
      
      const stored = JSON.parse(localStorage.getItem('user'));
      expect(stored).toEqual(user);
    });

    it('should handle localStorage errors gracefully', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      const user = { id: '123', username: 'testuser' };
      // Should not throw error
      expect(() => setUser(user)).not.toThrow();
      
      // Restore original
      localStorage.setItem = originalSetItem;
    });
  });

  describe('setToken', () => {
    it('should call tokenManager.setToken', () => {
      const token = 'test-token';
      setToken(token);
      
      expect(tokenManager.setToken).toHaveBeenCalledWith(token);
    });
  });

  describe('clearAuthData', () => {
    it('should call tokenManager.clearToken', () => {
      clearAuthData();
      
      expect(tokenManager.clearToken).toHaveBeenCalled();
    });
  });

  describe('getToken', () => {
    it('should call tokenManager.getTokenSync', () => {
      tokenManager.getTokenSync.mockReturnValue('test-token');
      const result = getToken();
      
      expect(tokenManager.getTokenSync).toHaveBeenCalled();
      expect(result).toBe('test-token');
    });
  });
});

