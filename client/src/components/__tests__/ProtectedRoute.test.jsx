import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProtectedRoute from '../ProtectedRoute';
import authReducer from '../../features/auth/authSlice';

// Mock useAuth hook
vi.mock('../../hooks/useAuth', () => ({
  default: vi.fn(),
}));

import useAuth from '../../hooks/useAuth';

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

const renderWithProviders = (component, { authState, initialEntries = ['/'] } = {}) => {
  const store = createMockStore(authState || {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    sessionChecked: true,
    message: '',
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        {component}
      </MemoryRouter>
    </Provider>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading spinner when loading', () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: true,
    });

    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        authState: {
          user: null,
          isAuthenticated: false,
          loading: true,
          sessionChecked: false,
          error: null,
          message: '',
        },
      }
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
    });

    const { container } = renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        authState: {
          user: null,
          isAuthenticated: false,
          loading: false,
          sessionChecked: true,
          error: null,
          message: '',
        },
        initialEntries: ['/home'],
      }
    );

    // React Router Navigate component should be present
    expect(container.querySelector('div')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when authenticated', () => {
    useAuth.mockReturnValue({
      user: { id: '123', role: 'user' },
      isAuthenticated: true,
      loading: false,
    });

    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        authState: {
          user: { id: '123', role: 'user' },
          isAuthenticated: true,
          loading: false,
          sessionChecked: true,
          error: null,
          message: '',
        },
      }
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect admin to dashboard when accessing regular pages', () => {
    useAuth.mockReturnValue({
      user: { id: '123', role: 'admin' },
      isAuthenticated: true,
      loading: false,
    });

    const { container } = renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        authState: {
          user: { id: '123', role: 'admin' },
          isAuthenticated: true,
          loading: false,
          sessionChecked: true,
          error: null,
          message: '',
        },
        initialEntries: ['/home'],
      }
    );

    // Should redirect admin away from regular pages
    expect(container.querySelector('div')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should allow admin access to admin dashboard', () => {
    useAuth.mockReturnValue({
      user: { id: '123', role: 'admin' },
      isAuthenticated: true,
      loading: false,
    });

    renderWithProviders(
      <ProtectedRoute>
        <div>Admin Content</div>
      </ProtectedRoute>,
      {
        authState: {
          user: { id: '123', role: 'admin' },
          isAuthenticated: true,
          loading: false,
          sessionChecked: true,
          error: null,
          message: '',
        },
        initialEntries: ['/admin/dashboard'],
      }
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('should redirect non-admin users when requireAdmin is true', () => {
    useAuth.mockReturnValue({
      user: { id: '123', role: 'user' },
      isAuthenticated: true,
      loading: false,
    });

    const { container } = renderWithProviders(
      <ProtectedRoute requireAdmin={true}>
        <div>Admin Content</div>
      </ProtectedRoute>,
      {
        authState: {
          user: { id: '123', role: 'user' },
          isAuthenticated: true,
          loading: false,
          sessionChecked: true,
          error: null,
          message: '',
        },
      }
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('should allow admin access when requireAdmin is true', () => {
    useAuth.mockReturnValue({
      user: { id: '123', role: 'admin' },
      isAuthenticated: true,
      loading: false,
    });

    renderWithProviders(
      <ProtectedRoute requireAdmin={true}>
        <div>Admin Content</div>
      </ProtectedRoute>,
      {
        authState: {
          user: { id: '123', role: 'admin' },
          isAuthenticated: true,
          loading: false,
          sessionChecked: true,
          error: null,
          message: '',
        },
        initialEntries: ['/admin/dashboard'],
      }
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });
});

