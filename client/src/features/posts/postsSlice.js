// Import necessary dependencies and API functions
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchPosts, createPost } from "./postsAPI";

const API_BASE = import.meta.env.VITE_SERVER_URL;

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

// Define initial state for posts management
const initialState = {
  userPosts: [], // Array to store user posts
  allPosts: [], // Array to store all posts
  loading: false, // Loading state for async operations
  error: null, // Error messages if any
  currentPost: null, // Currently selected post
};

// Create the posts slice
const postsSlice = createSlice({
  name: "posts",
  initialState,
  // Regular reducers for synchronous actions
  reducers: {
    // Clear any error messages in the state
    clearError: (state) => {
      state.error = null;
    },
    // Set the current post in the state
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
  },
  // Handle async action states
  extraReducers: (builder) => {
    builder
      // Fetch user posts action states
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.userPosts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch all posts action states
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.allPosts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create post action states
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        // Add new post to the beginning of the allPosts array
        state.allPosts = [action.payload, ...state.allPosts];
        if (action.payload.user === action.meta.arg.userId) {
          state.userPosts = [action.payload, ...state.userPosts];
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearError, setCurrentPost } = postsSlice.actions;
export default postsSlice.reducer;
