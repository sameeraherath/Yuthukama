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
import { getSafeUser, clearAuthData } from "../../utils/authUtils";

/**
 * Initial user state from localStorage
 * @type {Object|null}
 */
const user = getSafeUser();

console.log("Initial user state from localStorage:", user);

/**
 * Initial state for the auth slice
 * @type {Object}
 * @property {Object|null} user - Current user data
 * @property {boolean} loading - Loading state
 * @property {string|null} error - Error message
 * @property {boolean} isAuthenticated - Authentication status
 * @property {string} message - Status message
 * @property {boolean} sessionChecked - Whether initial session check is complete
 */
const initialState = {
  user: user,
  loading: false,
  error: null,
  isAuthenticated: !!user,
  message: "",
  sessionChecked: false,
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
    /**
     * Forces logout and clears all auth data
     * @param {Object} state - Current state
     */
    forceLogout: (state) => {
      clearAuthData();
      state.user = null;
      state.isAuthenticated = false;
      state.sessionChecked = true;
      state.message = "Session expired. Please log in again.";
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
        state.sessionChecked = true;
        state.message = "Login successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.sessionChecked = true;
        clearAuthData();
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.sessionChecked = true;
        state.message = "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.sessionChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        clearAuthData();
        state.user = null;
        state.isAuthenticated = false;
        state.sessionChecked = true;
        state.message = "Logged out successfully";
      })
      .addCase(checkUserSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkUserSession.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.sessionChecked = true;
      })
      .addCase(checkUserSession.rejected, (state, action) => {
        state.loading = false;
        state.sessionChecked = true;
        
        // Only clear auth data if it's a real authentication error
        if (action.payload === "Session expired" || action.payload === "No token") {
          state.user = null;
          state.isAuthenticated = false;
          clearAuthData();
        } else {
          // For network errors, keep existing auth state but mark session as checked
          console.log("Session check failed due to network error, keeping existing auth state");
        }
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

export const { reset, clearError, forceLogout } = authSlice.actions;
export default authSlice.reducer;
