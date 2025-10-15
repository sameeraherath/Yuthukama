import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenManager } from "../../utils/tokenManager.js";
import {
  fetchPosts,
  createPost,
  deletePost,
  addComment,
  deleteComment,
} from "./postsAPI";

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
      const token = await tokenManager.getToken();
      
      if (!token) {
        return thunkAPI.rejectWithValue(
          "Authentication required. Please log in."
        );
      }

      const { data } = await axios.get(`${API_BASE}/api/posts/user/${userId}`, {
        withCredentials: true,
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
 * Async thunk for liking a post
 * @async
 * @function likePost
 * @param {string} postId - ID of the post to like
 * @returns {Promise<Object>} Object containing postId and updated likes count
 * @throws {Error} If the API request fails
 */
export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId, thunkAPI) => {
    try {
      const token = await tokenManager.getToken();
      
      if (!token) {
        return thunkAPI.rejectWithValue(
          "Authentication required. Please log in."
        );
      }

      const { data } = await axios.put(
        `${API_BASE}/api/posts/${postId}/like`,
        {},
        {
          withCredentials: true,
        }
      );
      return { postId, likes: data.likes };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to like post"
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
      })
      // Handle likePost actions
      .addCase(likePost.pending, (state) => {
        state.error = null;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, likes } = action.payload;
        // Update post in allPosts
        const post = state.allPosts.find((p) => p._id === postId);
        if (post) {
          post.likes = likes;
        }
        // Update post in userPosts if it exists there
        const userPost = state.userPosts.find((p) => p._id === postId);
        if (userPost) {
          userPost.likes = likes;
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Handle addComment actions
      .addCase(addComment.pending, (state) => {
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        // Update post in allPosts
        const postIndex = state.allPosts.findIndex(
          (p) => p._id === updatedPost._id
        );
        if (postIndex !== -1) {
          state.allPosts[postIndex] = updatedPost;
        }
        // Update post in userPosts if it exists there
        const userPostIndex = state.userPosts.findIndex(
          (p) => p._id === updatedPost._id
        );
        if (userPostIndex !== -1) {
          state.userPosts[userPostIndex] = updatedPost;
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Handle deleteComment actions
      .addCase(deleteComment.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        // Update post in allPosts
        const postIndex = state.allPosts.findIndex(
          (p) => p._id === updatedPost._id
        );
        if (postIndex !== -1) {
          state.allPosts[postIndex] = updatedPost;
        }
        // Update post in userPosts if it exists there
        const userPostIndex = state.userPosts.findIndex(
          (p) => p._id === updatedPost._id
        );
        if (userPostIndex !== -1) {
          state.userPosts[userPostIndex] = updatedPost;
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentPost, addPost } = postsSlice.actions;
export default postsSlice.reducer;
