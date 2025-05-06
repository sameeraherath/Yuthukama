import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchPosts, createPost, deletePost } from "./postsAPI";

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

const initialState = {
  userPosts: [],
  allPosts: [],
  // Removed loading state as it's now handled globally
  error: null,
  currentPost: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPosts.pending, (state) => {
        // Removed loading state management
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        // Removed loading state management
        state.userPosts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        // Removed loading state management
        state.error = action.payload;
      })
      .addCase(fetchPosts.pending, (state) => {
        // Removed loading state management
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        // Removed loading state management
        state.allPosts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        // Removed loading state management
        state.error = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        // Removed loading state management
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        // Removed loading state management
        state.allPosts = [action.payload, ...state.allPosts];
        if (action.payload.user === action.meta.arg.userId) {
          state.userPosts = [action.payload, ...state.userPosts];
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        // Removed loading state management
        state.error = action.payload;
      })
      .addCase(deletePost.pending, (state) => {
        // Removed loading state management
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        // Removed loading state management
        state.userPosts = state.userPosts.filter(
          (post) => post._id !== action.payload
        );
        state.allPosts = state.allPosts.filter(
          (post) => post._id !== action.payload
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        // Removed loading state management
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearError, setCurrentPost } = postsSlice.actions;
export default postsSlice.reducer;
