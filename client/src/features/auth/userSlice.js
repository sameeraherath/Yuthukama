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
 * Async thunk for fetching user profile by ID
 * @async
 * @function fetchUserById
 * @param {string} userId - ID of the user to fetch
 * @param {Object} thunkAPI - Redux Thunk API object
 * @returns {Promise<Object>} User profile data
 * @throws {Error} If user profile fetch fails
 * @example
 * // In a component
 * await dispatch(fetchUserById('user123'));
 */
export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId, thunkAPI) => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user profile"
      );
    }
  }
);

/**
 * Async thunk for following a user
 * @async
 * @function followUser
 * @param {string} userId - ID of the user to follow
 * @param {Object} thunkAPI - Redux Thunk API object
 * @returns {Promise<Object>} Success message
 * @throws {Error} If follow operation fails
 * @example
 * // In a component
 * await dispatch(followUser('user123'));
 */
export const followUser = createAsyncThunk(
  "user/followUser",
  async (userId, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `${API_BASE}/api/users/${userId}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return { userId, message: data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to follow user"
      );
    }
  }
);

/**
 * Async thunk for unfollowing a user
 * @async
 * @function unfollowUser
 * @param {string} userId - ID of the user to unfollow
 * @param {Object} thunkAPI - Redux Thunk API object
 * @returns {Promise<Object>} Success message
 * @throws {Error} If unfollow operation fails
 * @example
 * // In a component
 * await dispatch(unfollowUser('user123'));
 */
export const unfollowUser = createAsyncThunk(
  "user/unfollowUser",
  async (userId, thunkAPI) => {
    try {
      const { data } = await axios.delete(
        `${API_BASE}/api/users/${userId}/follow`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return { userId, message: data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to unfollow user"
      );
    }
  }
);

/**
 * Async thunk for fetching followers list
 * @async
 * @function fetchFollowers
 * @param {string} userId - ID of the user
 * @param {Object} thunkAPI - Redux Thunk API object
 * @returns {Promise<Object>} Followers list
 * @throws {Error} If fetching followers fails
 * @example
 * // In a component
 * await dispatch(fetchFollowers('user123'));
 */
export const fetchFollowers = createAsyncThunk(
  "user/fetchFollowers",
  async (userId, thunkAPI) => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/api/users/${userId}/followers`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return { userId, followers: data.followers, count: data.count };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch followers"
      );
    }
  }
);

/**
 * Async thunk for fetching following list
 * @async
 * @function fetchFollowing
 * @param {string} userId - ID of the user
 * @param {Object} thunkAPI - Redux Thunk API object
 * @returns {Promise<Object>} Following list
 * @throws {Error} If fetching following fails
 * @example
 * // In a component
 * await dispatch(fetchFollowing('user123'));
 */
export const fetchFollowing = createAsyncThunk(
  "user/fetchFollowing",
  async (userId, thunkAPI) => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/api/users/${userId}/following`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return { userId, following: data.following, count: data.count };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch following"
      );
    }
  }
);

/**
 * Async thunk for checking follow status
 * @async
 * @function checkFollowStatus
 * @param {string} userId - ID of the user to check
 * @param {Object} thunkAPI - Redux Thunk API object
 * @returns {Promise<Object>} Follow status
 * @throws {Error} If checking follow status fails
 * @example
 * // In a component
 * await dispatch(checkFollowStatus('user123'));
 */
export const checkFollowStatus = createAsyncThunk(
  "user/checkFollowStatus",
  async (userId, thunkAPI) => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/api/users/${userId}/follow-status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return { userId, isFollowing: data.isFollowing };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to check follow status"
      );
    }
  }
);

/**
 * Async thunk for fetching recommended users
 * @async
 * @function fetchRecommendedUsers
 * @param {number} limit - Number of recommended users to fetch
 * @param {Object} thunkAPI - Redux Thunk API object
 * @returns {Promise<Object>} Recommended users list
 * @throws {Error} If fetching recommended users fails
 * @example
 * // In a component
 * await dispatch(fetchRecommendedUsers(10));
 */
export const fetchRecommendedUsers = createAsyncThunk(
  "user/fetchRecommendedUsers",
  async (limit = 10, thunkAPI) => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/api/users/recommended?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return { users: data.users, count: data.count };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch recommended users"
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
   * @property {Object|null} profileUser - User profile data for viewing other users
   * @property {Array} followers - Followers list
   * @property {Array} following - Following list
   * @property {Array} recommendedUsers - Recommended users list
   * @property {Object} followStatus - Follow status for different users
   */
  initialState: {
    loading: false,
    error: null,
    message: "",
    profileUser: null,
    followers: [],
    following: [],
    recommendedUsers: [],
    followStatus: {},
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
      })
      // Fetch User By ID Cases
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.profileUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.profileUser = null;
      })
      // Follow User Cases
      .addCase(followUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.followStatus[action.payload.userId] = true;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Unfollow User Cases
      .addCase(unfollowUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.followStatus[action.payload.userId] = false;
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Followers Cases
      .addCase(fetchFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload.followers;
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Following Cases
      .addCase(fetchFollowing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.following = action.payload.following;
      })
      .addCase(fetchFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check Follow Status Cases
      .addCase(checkFollowStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkFollowStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.followStatus[action.payload.userId] = action.payload.isFollowing;
      })
      .addCase(checkFollowStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Recommended Users Cases
      .addCase(fetchRecommendedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedUsers = action.payload.users;
      })
      .addCase(fetchRecommendedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessage } = userSlice.actions;
export default userSlice.reducer;
