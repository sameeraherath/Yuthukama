/**
 * Authentication state management slice
 * @module authSlice
 */

import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  logoutUser,
  checkUserSession,
} from "./authAPI";
import { updateProfilePicture } from "./userSlice";

/**
 * Initial user state from localStorage
 * @type {Object|null}
 */
const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

console.log("Initial user state from localStorage:", user);

/**
 * Initial state for the auth slice
 * @type {Object}
 * @property {Object|null} user - Current user data
 * @property {boolean} loading - Loading state
 * @property {string|null} error - Error message
 * @property {boolean} isAuthenticated - Authentication status
 * @property {string} message - Status message
 */
const initialState = {
  user: user,
  loading: false,
  error: null,
  isAuthenticated: !!user,
  message: "",
};

/**
 * Redux slice for authentication state management
 * @type {import('@reduxjs/toolkit').Slice}
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Resets the auth state to initial values
     * @param {Object} state - Current state
     */
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.message = "";
    },
    /**
     * Clears any error messages
     * @param {Object} state - Current state
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.message = "Logged out successfully";
      })
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
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        console.log(
          "Auth slice - Profile picture update received:",
          action.payload
        );
        console.log("Previous user state:", state.user);
        state.user = {
          ...state.user,
          profilePicture: action.payload.profilePicture,
        };
        console.log("Updated user state:", state.user);
      });
  },
});

export const { reset, clearError } = authSlice.actions;
export default authSlice.reducer;
