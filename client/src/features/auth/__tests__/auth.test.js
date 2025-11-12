import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import authReducer from '../authSlice';
import { loginUser, registerUser, logoutUser, checkUserSession } from '../authAPI';
import ProtectedRoute from '../../../components/ProtectedRoute';
import useAuth from '../../../hooks/useAuth';

// Mock dependencies
vi.mock('../../../utils/authUtils', () => ({
  getSafeUser: vi.fn(() => null),
  clearAuthData: vi.fn(),
}));

vi.mock('../authAPI', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  logoutUser: vi.fn(),
  checkUserSession: vi.fn(),
}));

vi.mock('../../../hooks/useAuth', () => ({
  default: vi.fn(),
}));

describe('Authentication Feature Integration', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
          sessionChecked: true,
          message: '',
        },
      },
    });
    vi.clearAllMocks();
  });

  describe('Authentication Flow', () => {
    it('should handle complete login flow', () => {
      // Simulate login pending
      const pendingAction = { type: loginUser.pending.type };
      let state = authReducer(store.getState().auth, pendingAction);
      expect(state.loading).toBe(true);

      // Simulate login success
      const userData = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
      };
      const fulfilledAction = {
        type: loginUser.fulfilled.type,
        payload: userData,
      };
      state = authReducer(state, fulfilledAction);
      
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(userData);
      expect(state.loading).toBe(false);
    });

    it('should handle complete registration flow', () => {
      // Simulate registration pending
      const pendingAction = { type: registerUser.pending.type };
      let state = authReducer(store.getState().auth, pendingAction);
      expect(state.loading).toBe(true);

      // Simulate registration success
      const userData = {
        id: '123',
        username: 'newuser',
        email: 'new@example.com',
      };
      const fulfilledAction = {
        type: registerUser.fulfilled.type,
        payload: userData,
      };
      state = authReducer(state, fulfilledAction);
      
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(userData);
      expect(state.loading).toBe(false);
    });

    it('should handle complete logout flow', () => {
      // Start with logged in state
      const loggedInState = {
        user: { id: '123', username: 'testuser' },
        isAuthenticated: true,
        loading: false,
        error: null,
        sessionChecked: true,
        message: '',
      };

      // Simulate logout
      const action = { type: logoutUser.fulfilled.type };
      const state = authReducer(loggedInState, action);
      
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.message).toBe('Logged out successfully');
    });
  });

  describe('ProtectedRoute with Auth State', () => {
    it('should protect routes based on authentication state', () => {
      useAuth.mockReturnValue({
        user: { id: '123', role: 'user' },
        isAuthenticated: true,
        loading: false,
      });

      const authenticatedStore = configureStore({
        reducer: { auth: authReducer },
        preloadedState: {
          auth: {
            user: { id: '123', role: 'user' },
            isAuthenticated: true,
            loading: false,
            sessionChecked: true,
            error: null,
            message: '',
          },
        },
      });

      render(
        <Provider store={authenticatedStore}>
          <MemoryRouter>
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should redirect unauthenticated users', () => {
      useAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        loading: false,
      });

      const { container } = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/home']}>
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(container.querySelector('div')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle login errors gracefully', () => {
      const errorMessage = 'Invalid credentials';
      const action = {
        type: loginUser.rejected.type,
        payload: errorMessage,
      };
      const state = authReducer(store.getState().auth, action);
      
      expect(state.error).toBe(errorMessage);
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
    });

    it('should handle registration errors gracefully', () => {
      const errorMessage = 'User already exists';
      const action = {
        type: registerUser.rejected.type,
        payload: errorMessage,
      };
      const state = authReducer(store.getState().auth, action);
      
      expect(state.error).toBe(errorMessage);
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
    });
  });

  describe('Session Management', () => {
    it('should handle session check success', () => {
      const userData = { id: '123', username: 'testuser' };
      const action = {
        type: checkUserSession.fulfilled.type,
        payload: userData,
      };
      const state = authReducer(store.getState().auth, action);
      
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(userData);
      expect(state.sessionChecked).toBe(true);
    });

    it('should handle session expiration', () => {
      const action = {
        type: checkUserSession.rejected.type,
        payload: 'Session expired',
      };
      const state = authReducer(store.getState().auth, action);
      
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.sessionChecked).toBe(true);
    });
  });
});

