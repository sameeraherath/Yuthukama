// Import necessary dependencies from Redux Toolkit and axios for HTTP requests
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get the base API URL from environment variables
const API_BASE = import.meta.env.VITE_SERVER_URL;

// Async thunk action to update user's profile picture
// This function handles the API call to update profile picture
export const updateProfilePicture = createAsyncThunk(
  "user/updateProfilePicture",
  async (formData, thunkAPI) => {
    try {
      // Make PUT request to update profile picture
      // formData contains the image file
      const { data } = await axios.put(
        `${API_BASE}/api/users/profile-pic`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add JWT token for authentication
            "Content-Type": "multipart/form-data", // Required for file upload
          },
        }
      );
      return data;
    } catch (error) {
      // If request fails, return error message
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile picture"
      );
    }
  }
);

// Async thunk action to update username
// This function handles the API call to update the user's username
export const updateUsername = createAsyncThunk(
  "user/updateUsername",
  async (username, thunkAPI) => {
    try {
      // Make PUT request to update username
      const { data } = await axios.put(
        `${API_BASE}/api/users/username`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add JWT token for authentication
          },
        }
      );
      return data;
    } catch (error) {
      // If request fails, return error message
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update username"
      );
    }
  }
);

// Create the user slice with initial state and reducers
const userSlice = createSlice({
  name: "user",
  // Initial state for user-related operations
  initialState: {
    loading: false, // Tracks loading state during async operations
    error: null, // Stores error messages if any
    message: "", // Stores success messages
  },
  // Regular reducers for synchronous actions
  reducers: {
    // Clear any existing messages or errors
    clearMessage: (state) => {
      state.message = "";
      state.error = null;
    },
  },
  // Handle async action states (pending, fulfilled, rejected)
  extraReducers: (builder) => {
    builder
      // Profile picture update states
      .addCase(updateProfilePicture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfilePicture.fulfilled, (state) => {
        state.loading = false;
        state.message = "Profile picture updated successfully";
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Username update states
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

// Export actions and reducer
export const { clearMessage } = userSlice.actions;
export default userSlice.reducer;
