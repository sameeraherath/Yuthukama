import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setToken, setUser, clearAuthData } from "../../utils/authUtils";

const API_BASE = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
console.log("Auth API Base URL:", API_BASE); // Debug log

/**
 * Async thunk for user login
 * @async
 * @function loginUser
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User's email address
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} Redux thunk action
 * @throws {Error} If login fails
 * @example
 * // In a component
 * const dispatch = useDispatch();
 * const result = await dispatch(loginUser({ email: 'user@example.com', password: 'password' })).unwrap();
 */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      console.log("Attempting login to:", `${API_BASE}/api/auth/login`);

      const { data } = await axios.post(
        `${API_BASE}/api/auth/login`,
        { email, password },
        {
          timeout: 15000, // Increased timeout to 15 seconds
          withCredentials: true, // Enable cookies
          headers: {
            "Content-Type": "application/json",
          },
          validateStatus: function (status) {
            return status >= 200 && status < 500; // Accept all responses to handle them properly
          },
        }
      );

      if (data.error) {
        console.error("Login error from server:", data.error);
        return thunkAPI.rejectWithValue(data.error);
      }

      console.log("Login successful, storing token and user data");
      setToken(data.token);
      setUser(data);

      return data;
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code,
        url: error.config?.url,
        method: error.config?.method,
      });

      if (error.code === "ECONNABORTED") {
        return thunkAPI.rejectWithValue(
          "Connection timed out. The server is taking too long to respond. Please try again."
        );
      }

      if (!error.response) {
        return thunkAPI.rejectWithValue(
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      }

      if (error.response.status === 404) {
        return thunkAPI.rejectWithValue(
          "Login endpoint not found. Please check the server configuration."
        );
      }

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  }
);

/**
 * Async thunk for user registration
 * @async
 * @function registerUser
 * @param {Object} userData - User registration data
 * @param {string} userData.username - User's username
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} Redux thunk action
 * @throws {Error} If registration fails
 * @example
 * // In a component
 * const dispatch = useDispatch();
 * const result = await dispatch(registerUser({
 *   username: 'newuser',
 *   email: 'user@example.com',
 *   password: 'password'
 * })).unwrap();
 */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, thunkAPI) => {
    try {
      console.log("Attempting registration to:", `${API_BASE}/api/auth/register`);

      const { data } = await axios.post(
        `${API_BASE}/api/auth/register`,
        { username, email, password },
        {
          timeout: 15000, // Increased timeout to 15 seconds
          withCredentials: true, // Enable cookies
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Registration successful, storing token and user data");
      setToken(data.token);
      setUser(data);

      return data;
    } catch (error) {
      console.error("Registration error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code,
        url: error.config?.url,
        method: error.config?.method,
      });

      if (error.code === "ECONNABORTED") {
        return thunkAPI.rejectWithValue(
          "Connection timed out. The server is taking too long to respond. Please try again."
        );
      }

      if (!error.response) {
        return thunkAPI.rejectWithValue(
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      }

      if (error.response.status === 404) {
        return thunkAPI.rejectWithValue(
          "Registration endpoint not found. Please check the server configuration."
        );
      }

      // Handle validation errors from server
      if (error.response.status === 400 && error.response.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessage = validationErrors.map(err => err.message).join(', ');
        return thunkAPI.rejectWithValue(errorMessage);
      }

      // Handle rate limiting error
      if (error.response.status === 429) {
        return thunkAPI.rejectWithValue(
          "Too many registration attempts. Please wait a few minutes before trying again."
        );
      }

      // Handle user already exists error
      if (error.response.status === 400 && error.response.data?.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    }
  }
);

/**
 * Async thunk for user logout
 * @async
 * @function logoutUser
 * @returns {Promise<Object>} Redux thunk action
 * @throws {Error} If logout fails
 * @example
 * // In a component
 * const dispatch = useDispatch();
 * await dispatch(logoutUser()).unwrap();
 */
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await axios.post(`${API_BASE}/api/auth/logout`);
      clearAuthData();
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      clearAuthData(); // Clear data even if API call fails
      return thunkAPI.rejectWithValue("Logout failed");
    }
  }
);

/**
 * Async thunk for checking user session validity
 * @async
 * @function checkUserSession
 * @returns {Promise<Object>} Redux thunk action
 * @throws {Error} If session check fails or token is invalid
 * @example
 * // In a component
 * const dispatch = useDispatch();
 * const result = await dispatch(checkUserSession()).unwrap();
 */
export const checkUserSession = createAsyncThunk(
  "auth/checkUserSession",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      console.log("checkUserSession - Token:", token);

      if (!token) {
        console.log("checkUserSession - No token found");
        return thunkAPI.rejectWithValue("No token");
      }

      console.log("checkUserSession - Making API request to check session");
      const { data } = await axios.get(`${API_BASE}/api/auth/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // Ensure cookies are sent
      });
      console.log("checkUserSession - Server response:", data);

      // Update user data in localStorage
      setUser(data);
      return data;
    } catch (error) {
      console.error("checkUserSession - Error:", error.response?.data || error);
      
      // Only clear auth data if it's a real authentication error
      if (error.response?.status === 401) {
        clearAuthData();
        return thunkAPI.rejectWithValue("Session expired");
      }
      
      // For other errors (network, server), don't clear auth data
      return thunkAPI.rejectWithValue("Session check failed");
    }
  }
);
