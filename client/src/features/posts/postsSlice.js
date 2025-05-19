import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchPosts, createPost, deletePost } from "./postsAPI";

const API_BASE = import.meta.env.VITE_SERVER_URL;

/**
 * Async thunk for fetching posts by user ID
 * @async
 * @function fetchUserPosts
 * @param {string} userId - ID of the user whose posts to fetch
 * @param {Object} thunkAPI - Redux Thunk API object
 * @returns {Promise<Array>} Array of user's posts
 * @throws {Error} If the API request fails
 */
export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (userId, thunkAPI) => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/posts/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch posts"
      );
    }
  }
);

/**
 * Initial state for the posts slice
 * @type {Object}
 * @property {Array} userPosts - Array of posts by the current user
 * @property {Array} allPosts - Array of all posts
 * @property {string|null} error - Error message if any
 * @property {Object|null} currentPost - Currently selected post
 */
const initialState = {
  userPosts: [],
  allPosts: [],
  error: null,
  currentPost: null,
};

/**
 * Redux slice for managing posts state
 * @type {Object}
 */
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    /**
     * Clears any error message in the state
     * @param {Object} state - Current state
     */
    clearError: (state) => {
      state.error = null;
    },
    /**
     * Sets the currently selected post
     * @param {Object} state - Current state
     * @param {Object} action - Action object containing the post to set
     */
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    /**
     * Adds a new post to the state
     * @param {Object} state - Current state
     * @param {Object} action - Action object containing the post to add
     */
    addPost: (state, action) => {
      state.allPosts = [action.payload, ...state.allPosts];
      if (action.payload.user === action.payload.userId) {
        state.userPosts = [action.payload, ...state.userPosts];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchUserPosts actions
      .addCase(fetchUserPosts.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.userPosts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Handle fetchPosts actions
      .addCase(fetchPosts.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.allPosts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Handle createPost actions
      .addCase(createPost.pending, (state) => {
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.allPosts = [action.payload, ...state.allPosts];
        if (action.payload.user === action.meta.arg.userId) {
          state.userPosts = [action.payload, ...state.userPosts];
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Handle deletePost actions
      .addCase(deletePost.pending, (state) => {
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.userPosts = state.userPosts.filter(
          (post) => post._id !== action.payload
        );
        state.allPosts = state.allPosts.filter(
          (post) => post._id !== action.payload
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentPost, addPost } = postsSlice.actions;
export default postsSlice.reducer;
