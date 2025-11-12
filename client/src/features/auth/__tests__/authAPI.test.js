import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { loginUser, registerUser, logoutUser, checkUserSession } from '../authAPI';
import { tokenManager } from '../../../utils/tokenManager';
import { setUser, clearAuthData } from '../../../utils/authUtils';

// Mock dependencies
vi.mock('axios');
vi.mock('../../../utils/tokenManager', () => ({
  tokenManager: {
    setToken: vi.fn(),
    clearToken: vi.fn(),
    getToken: vi.fn(),
  },
}));
vi.mock('../../../utils/authUtils', () => ({
  setUser: vi.fn(),
  clearAuthData: vi.fn(),
}));

describe('authAPI', () => {
  const mockDispatch = vi.fn();
  const mockGetState = vi.fn();
  const mockThunkAPI = {
    dispatch: mockDispatch,
    getState: mockGetState,
    rejectWithValue: vi.fn((value) => ({ type: 'rejected', payload: value })),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.VITE_SERVER_URL = 'http://localhost:5000';
  });

  describe('loginUser', () => {
    it('should successfully login user', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
        },
      };

      axios.post.mockResolvedValue(mockResponse);

      const result = await loginUser(
        { email: 'test@example.com', password: 'password123' },
        mockThunkAPI
      );

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/login',
        { email: 'test@example.com', password: 'password123' },
        expect.objectContaining({
          timeout: 15000,
          withCredentials: true,
        })
      );
      expect(tokenManager.setToken).toHaveBeenCalledWith('test-token');
      expect(setUser).toHaveBeenCalledWith(mockResponse.data);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login error from server', async () => {
      const mockResponse = {
        data: { error: 'Invalid credentials' },
      };

      axios.post.mockResolvedValue(mockResponse);

      const result = await loginUser(
        { email: 'test@example.com', password: 'wrong' },
        mockThunkAPI
      );

      expect(mockThunkAPI.rejectWithValue).toHaveBeenCalledWith('Invalid credentials');
    });

    it('should handle connection timeout', async () => {
      const error = { code: 'ECONNABORTED' };
      axios.post.mockRejectedValue(error);

      await loginUser(
        { email: 'test@example.com', password: 'password123' },
        mockThunkAPI
      );

      expect(mockThunkAPI.rejectWithValue).toHaveBeenCalledWith(
        'Connection timed out. The server is taking too long to respond. Please try again.'
      );
    });

    it('should handle network errors', async () => {
      const error = { message: 'Network Error' };
      axios.post.mockRejectedValue(error);

      await loginUser(
        { email: 'test@example.com', password: 'password123' },
        mockThunkAPI
      );

      expect(mockThunkAPI.rejectWithValue).toHaveBeenCalledWith(
        'Unable to connect to the server. Please check your internet connection and try again.'
      );
    });

    it('should handle 404 errors', async () => {
      const error = {
        response: { status: 404 },
      };
      axios.post.mockRejectedValue(error);

      await loginUser(
        { email: 'test@example.com', password: 'password123' },
        mockThunkAPI
      );

      expect(mockThunkAPI.rejectWithValue).toHaveBeenCalledWith(
        'Login endpoint not found. Please check the server configuration.'
      );
    });
  });

  describe('registerUser', () => {
    it('should successfully register user', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          id: '123',
          username: 'newuser',
          email: 'new@example.com',
        },
      };

      axios.post.mockResolvedValue(mockResponse);

      const result = await registerUser(
        { username: 'newuser', email: 'new@example.com', password: 'password123' },
        mockThunkAPI
      );

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/register',
        { username: 'newuser', email: 'new@example.com', password: 'password123' },
        expect.objectContaining({
          timeout: 15000,
          withCredentials: true,
        })
      );
      expect(tokenManager.setToken).toHaveBeenCalledWith('test-token');
      expect(setUser).toHaveBeenCalledWith(mockResponse.data);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle validation errors', async () => {
      const error = {
        response: {
          status: 400,
          data: {
            errors: [
              { message: 'Email is required' },
              { message: 'Password must be at least 8 characters' },
            ],
          },
        },
      };
      axios.post.mockRejectedValue(error);

      await registerUser(
        { username: 'newuser', email: '', password: '123' },
        mockThunkAPI
      );

      expect(mockThunkAPI.rejectWithValue).toHaveBeenCalledWith(
        'Email is required, Password must be at least 8 characters'
      );
    });

    it('should handle rate limiting', async () => {
      const error = {
        response: { status: 429 },
      };
      axios.post.mockRejectedValue(error);

      await registerUser(
        { username: 'newuser', email: 'new@example.com', password: 'password123' },
        mockThunkAPI
      );

      expect(mockThunkAPI.rejectWithValue).toHaveBeenCalledWith(
        'Too many registration attempts. Please wait a few minutes before trying again.'
      );
    });

    it('should handle user already exists error', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'User already exists' },
        },
      };
      axios.post.mockRejectedValue(error);

      await registerUser(
        { username: 'existing', email: 'existing@example.com', password: 'password123' },
        mockThunkAPI
      );

      expect(mockThunkAPI.rejectWithValue).toHaveBeenCalledWith('User already exists');
    });
  });

  describe('logoutUser', () => {
    it('should successfully logout user', async () => {
      axios.post.mockResolvedValue({ data: { message: 'Logged out successfully' } });

      const result = await logoutUser(undefined, mockThunkAPI);

      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/auth/logout');
      expect(tokenManager.clearToken).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should clear token even if API call fails', async () => {
      axios.post.mockRejectedValue(new Error('Network error'));

      await logoutUser(undefined, mockThunkAPI);

      expect(tokenManager.clearToken).toHaveBeenCalled();
      expect(mockThunkAPI.rejectWithValue).toHaveBeenCalledWith('Logout failed');
    });
  });

  describe('checkUserSession', () => {
    it('should successfully check user session', async () => {
      const mockUserData = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
      };

      tokenManager.getToken.mockResolvedValue('valid-token');
      axios.get.mockResolvedValue({ data: mockUserData });

      const result = await checkUserSession(undefined, mockThunkAPI);

      expect(tokenManager.getToken).toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/check',
        { withCredentials: true }
      );
      expect(setUser).toHaveBeenCalledWith(mockUserData);
      expect(result).toEqual(mockUserData);
    });

    it('should reject when no token exists', async () => {
      tokenManager.getToken.mockResolvedValue(null);

      await checkUserSession(undefined, mockThunkAPI);

      expect(mockThunkAPI.rejectWithValue).toHaveBeenCalledWith('No token');
      expect(axios.get).not.toHaveBeenCalled();
    });

    it('should handle session expired error', async () => {
      tokenManager.getToken.mockResolvedValue('expired-token');
      const error = {
        response: { status: 401 },
      };
      axios.get.mockRejectedValue(error);

      await checkUserSession(undefined, mockThunkAPI);

      expect(tokenManager.clearToken).toHaveBeenCalled();
      expect(mockThunkAPI.rejectWithValue).toHaveBeenCalledWith('Session expired');
    });

    it('should handle network errors without clearing auth', async () => {
      tokenManager.getToken.mockResolvedValue('valid-token');
      const error = {
        message: 'Network Error',
      };
      axios.get.mockRejectedValue(error);

      await checkUserSession(undefined, mockThunkAPI);

      expect(tokenManager.clearToken).not.toHaveBeenCalled();
      expect(mockThunkAPI.rejectWithValue).toHaveBeenCalledWith('Session check failed');
    });
  });
});

