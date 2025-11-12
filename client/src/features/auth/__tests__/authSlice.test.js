import { describe, it, expect, beforeEach, vi } from 'vitest';
import authReducer, { reset, clearError, forceLogout } from '../authSlice';
import {
  loginUser,
  registerUser,
  logoutUser,
  checkUserSession,
} from '../authAPI';

// Mock authUtils
vi.mock('../../../utils/authUtils', () => ({
  getSafeUser: vi.fn(() => null),
  clearAuthData: vi.fn(),
}));

describe('authSlice', () => {
  const initialState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    message: '',
    sessionChecked: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return initial state', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toEqual({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        message: '',
        sessionChecked: false,
      });
    });
  });

  describe('loginUser', () => {
    it('should handle login pending', () => {
      const action = { type: loginUser.pending.type };
      const state = authReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle login fulfilled', () => {
      const userData = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
      };
      const action = {
        type: loginUser.fulfilled.type,
        payload: userData,
      };
      const state = authReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(userData);
      expect(state.sessionChecked).toBe(true);
      expect(state.message).toBe('Login successful');
    });

    it('should handle login rejected', () => {
      const errorMessage = 'Invalid credentials';
      const action = {
        type: loginUser.rejected.type,
        payload: errorMessage,
      };
      const state = authReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.isAuthenticated).toBe(false);
      expect(state.sessionChecked).toBe(true);
    });
  });

  describe('registerUser', () => {
    it('should handle registration pending', () => {
      const action = { type: registerUser.pending.type };
      const state = authReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle registration fulfilled', () => {
      const userData = {
        id: '123',
        username: 'newuser',
        email: 'new@example.com',
      };
      const action = {
        type: registerUser.fulfilled.type,
        payload: userData,
      };
      const state = authReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(userData);
      expect(state.sessionChecked).toBe(true);
      expect(state.message).toBe('Registration successful');
    });

    it('should handle registration rejected', () => {
      const errorMessage = 'User already exists';
      const action = {
        type: registerUser.rejected.type,
        payload: errorMessage,
      };
      const state = authReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.isAuthenticated).toBe(false);
      expect(state.sessionChecked).toBe(true);
    });
  });

  describe('logoutUser', () => {
    it('should handle logout fulfilled', () => {
      const loggedInState = {
        ...initialState,
        user: { id: '123' },
        isAuthenticated: true,
      };
      const action = { type: logoutUser.fulfilled.type };
      const state = authReducer(loggedInState, action);
      
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.sessionChecked).toBe(true);
      expect(state.message).toBe('Logged out successfully');
    });
  });

  describe('checkUserSession', () => {
    it('should handle session check pending', () => {
      const action = { type: checkUserSession.pending.type };
      const state = authReducer(initialState, action);
      
      expect(state.loading).toBe(true);
    });

    it('should handle session check fulfilled', () => {
      const userData = { id: '123', username: 'testuser' };
      const action = {
        type: checkUserSession.fulfilled.type,
        payload: userData,
      };
      const state = authReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(userData);
      expect(state.sessionChecked).toBe(true);
    });

    it('should handle session expired', () => {
      const action = {
        type: checkUserSession.rejected.type,
        payload: 'Session expired',
      };
      const state = authReducer(initialState, action);
      
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.sessionChecked).toBe(true);
    });

    it('should handle no token error', () => {
      const action = {
        type: checkUserSession.rejected.type,
        payload: 'No token',
      };
      const state = authReducer(initialState, action);
      
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.sessionChecked).toBe(true);
    });

    it('should keep existing auth state for network errors', () => {
      const loggedInState = {
        ...initialState,
        user: { id: '123' },
        isAuthenticated: true,
      };
      const action = {
        type: checkUserSession.rejected.type,
        payload: 'Network error',
      };
      const state = authReducer(loggedInState, action);
      
      expect(state.user).toEqual({ id: '123' });
      expect(state.isAuthenticated).toBe(true);
      expect(state.sessionChecked).toBe(true);
    });
  });

  describe('reducers', () => {
    it('should reset state', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error',
        message: 'Some message',
        loading: true,
      };
      const action = reset();
      const state = authReducer(stateWithError, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.message).toBe('');
    });

    it('should clear error', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error',
      };
      const action = clearError();
      const state = authReducer(stateWithError, action);
      
      expect(state.error).toBeNull();
    });

    it('should force logout', () => {
      const loggedInState = {
        ...initialState,
        user: { id: '123' },
        isAuthenticated: true,
      };
      const action = forceLogout();
      const state = authReducer(loggedInState, action);
      
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.sessionChecked).toBe(true);
      expect(state.message).toBe('Session expired. Please log in again.');
    });
  });
});

