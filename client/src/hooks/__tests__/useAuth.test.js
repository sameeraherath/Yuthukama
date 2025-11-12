import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useAuth from '../useAuth';
import authReducer from '../../features/auth/authSlice';

// Mock authAPI
vi.mock('../../features/auth/authAPI', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  logoutUser: vi.fn(),
  checkUserSession: vi.fn(),
}));

const createMockStore = (authState) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: authState,
    },
  });
};

const renderHookWithStore = (hook, { authState } = {}) => {
  const store = createMockStore(authState || {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    sessionChecked: true,
    message: '',
  });

  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  return renderHook(hook, { wrapper });
};

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.log to avoid cluttering test output
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should return user state from Redux', () => {
    const authState = {
      user: { id: '123', username: 'testuser' },
      isAuthenticated: true,
      loading: false,
      error: null,
      sessionChecked: true,
      message: '',
    };

    const { result } = renderHookWithStore(() => useAuth(), { authState });

    expect(result.current.user).toEqual(authState.user);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should return null user when not authenticated', () => {
    const authState = {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      sessionChecked: true,
      message: '',
    };

    const { result } = renderHookWithStore(() => useAuth(), { authState });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should provide login function', () => {
    const { result } = renderHookWithStore(() => useAuth());

    expect(typeof result.current.login).toBe('function');
  });

  it('should provide logout function', () => {
    const { result } = renderHookWithStore(() => useAuth());

    expect(typeof result.current.logout).toBe('function');
  });

  it('should provide register function', () => {
    const { result } = renderHookWithStore(() => useAuth());

    expect(typeof result.current.register).toBe('function');
  });

  it('should provide checkSession function', () => {
    const { result } = renderHookWithStore(() => useAuth());

    expect(typeof result.current.checkSession).toBe('function');
  });

  it('should return loading state when loading', () => {
    const authState = {
      user: null,
      isAuthenticated: false,
      loading: true,
      error: null,
      sessionChecked: false,
      message: '',
    };

    const { result } = renderHookWithStore(() => useAuth(), { authState });

    expect(result.current.loading).toBe(true);
  });

  it('should return error state when error exists', () => {
    const authState = {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: 'Invalid credentials',
      sessionChecked: true,
      message: '',
    };

    const { result } = renderHookWithStore(() => useAuth(), { authState });

    expect(result.current.error).toBe('Invalid credentials');
  });

  it('should return all required properties', () => {
    const { result } = renderHookWithStore(() => useAuth());

    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('isAuthenticated');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('register');
    expect(result.current).toHaveProperty('logout');
    expect(result.current).toHaveProperty('checkSession');
  });
});

