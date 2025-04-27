// Import necessary dependencies from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  logoutUser,
  checkUserSession,
} from "./authAPI";

// Get initial user data from localStorage if it exists
const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

// Define initial state for authentication
const initialState = {
  user: user, // Current user data
  loading: false, // Loading state for async operations
  error: null, // Error messages
  isAuthenticated: !!user, // Authentication status based on user presence
  message: "", // Success/info messages
};

// Create the authentication slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  // Regular reducers for synchronous actions
  reducers: {
    // Reset auth state to initial values
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.message = "";
    },
    // Clear any error messages
    clearError: (state) => {
      state.error = null;
    },
  },
  // Handle async action states
  extraReducers: (builder) => {
    builder
      // Login action states
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.message = "Login successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Register action states
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.message = "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Logout action states
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.message = "Logged out successfully";
      })

      // Session check action states
      .addCase(checkUserSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkUserSession.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkUserSession.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

// Export actions and reducer
export const { reset, clearError } = authSlice.actions;
export default authSlice.reducer;
