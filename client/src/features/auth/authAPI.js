import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_SERVER_URL;

// Function to handle user login
// Takes email and password as parameters
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      // Make POST request to login endpoint
      const { data } = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password,
      });

      // Store the JWT token in localStorage for future authenticated requests
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      return data;
    } catch (error) {
      // Handle and throw any errors that occur during login
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// Function to handle user registration
// Takes user registration details as parameter
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, thunkAPI) => {
    try {
      // Make POST request to register endpoint
      const { data } = await axios.post(`${API_BASE}/api/auth/register`, {
        username,
        email,
        password,
      });

      // Store the JWT token if provided after registration
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      return data;
    } catch (error) {
      // Handle and throw any errors that occur during registration
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Function to handle user logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await axios.post(`${API_BASE}/api/auth/logout`);
      // Remove JWT token from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return thunkAPI.rejectWithValue("Logout failed");
    }
  }
);

// Function to check user session
// Uses the stored JWT token for authentication
export const checkUserSession = createAsyncThunk(
  "auth/checkUserSession",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return thunkAPI.rejectWithValue("No token");

      // Make GET request to check user session with JWT token in header
      const { data } = await axios.get(`${API_BASE}/api/auth/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Session check error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return thunkAPI.rejectWithValue("Session expired");
    }
  }
);
