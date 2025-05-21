import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_SERVER_URL;

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
          timeout: 10000, // 10 second timeout
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login successful, storing token and user data");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      return data;
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code,
      });

      if (error.code === "ECONNABORTED") {
        return thunkAPI.rejectWithValue(
          "Connection timed out. Please check your internet connection and try again."
        );
      }

      if (!error.response) {
        return thunkAPI.rejectWithValue(
          "Unable to reach the server. Please check your internet connection."
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
      const { data } = await axios.post(`${API_BASE}/api/auth/register`, {
        username,
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
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
      });
      console.log("checkUserSession - Server response:", data);

      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("checkUserSession - Error:", error.response?.data || error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return thunkAPI.rejectWithValue("Session expired");
    }
  }
);
