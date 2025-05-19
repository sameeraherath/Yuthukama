/**
 * Redux slice for managing user profile data and operations
 * @module userSlice
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_SERVER_URL;

/**
 * Async thunk for updating user's profile picture
 * @async
 * @function updateProfilePicture
 * @param {FormData} formData - Form data containing the new profile picture
 * @param {Object} thunkAPI - Redux Thunk API object
 * @returns {Promise<Object>} Updated user data with new profile picture URL
 * @throws {Error} If profile picture update fails
 * @example
 * // In a component
 * const formData = new FormData();
 * formData.append('profilePic', file);
 * await dispatch(updateProfilePicture(formData));
 */
export const updateProfilePicture = createAsyncThunk(
  "user/updateProfilePicture",
  async (formData, thunkAPI) => {
    try {
      console.log("Sending profile picture update request...");
      const { data } = await axios.put(
        `${API_BASE}/api/users/profile-pic`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Server response for profile picture update:", data);
      return data;
    } catch (error) {
      console.error(
        "Profile picture update error:",
        error.response?.data || error
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile picture"
      );
    }
  }
);

/**
 * Async thunk for updating user's username
 * @async
 * @function updateUsername
 * @param {string} username - New username
 * @param {Object} thunkAPI - Redux Thunk API object
 * @returns {Promise<Object>} Updated user data
 * @throws {Error} If username update fails
 * @example
 * // In a component
 * await dispatch(updateUsername('newUsername'));
 */
export const updateUsername = createAsyncThunk(
  "user/updateUsername",
  async (username, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `${API_BASE}/api/users/username`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update username"
      );
    }
  }
);

/**
 * Redux slice for user state management
 * @type {Object}
 * @property {string} name - Slice name
 * @property {Object} initialState - Initial state object
 * @property {Object} reducers - Reducer functions
 * @property {Function} extraReducers - Additional reducers for async actions
 */
const userSlice = createSlice({
  name: "user",
  /**
   * Initial state for user slice
   * @type {Object}
   * @property {boolean} loading - Loading state for user operations
   * @property {string|null} error - Error message if any
   * @property {string} message - Success message
   */
  initialState: {
    loading: false,
    error: null,
    message: "",
  },
  reducers: {
    /**
     * Clears success and error messages
     * @function clearMessage
     * @param {Object} state - Current state
     */
    clearMessage: (state) => {
      state.message = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Profile Picture Update Cases
      .addCase(updateProfilePicture.pending, (state) => {
        console.log("Profile picture update pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        console.log("Profile picture update fulfilled:", action.payload);
        state.loading = false;
        state.message = "Profile picture updated successfully";
        // Update the user in localStorage with the new profile picture
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser) {
          console.log(
            "Updating localStorage user with new profile picture:",
            action.payload.profilePicture
          );
          currentUser.profilePicture = action.payload.profilePicture;
          localStorage.setItem("user", JSON.stringify(currentUser));
        }
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        console.error("Profile picture update rejected:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      // Username Update Cases
      .addCase(updateUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUsername.fulfilled, (state) => {
        state.loading = false;
        state.message = "Username updated successfully";
      })
      .addCase(updateUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessage } = userSlice.actions;
export default userSlice.reducer;
