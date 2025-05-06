import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_SERVER_URL;

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const { data } = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

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

export const checkUserSession = createAsyncThunk(
  "auth/checkUserSession",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return thunkAPI.rejectWithValue("No token");

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
