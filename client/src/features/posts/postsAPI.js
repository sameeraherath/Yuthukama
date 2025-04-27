// Import necessary Redux Toolkit and axios dependencies
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get the base API URL from environment variables
const API_BASE = import.meta.env.VITE_SERVER_URL;

// Async thunk to fetch all posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return thunkAPI.rejectWithValue(
          "Authentication required. Please log in."
        );
      }

      // Make GET request to fetch all posts
      const { data } = await axios.get(`${API_BASE}/api/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      // Handle any errors during fetch
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch posts"
      );
    }
  }
);

// Async thunk to create a new post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, thunkAPI) => {
    try {
      // Make POST request to create a new post
      const { data } = await axios.post(`${API_BASE}/api/posts`, postData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data", // Required for handling file uploads
        },
      });
      return data;
    } catch (error) {
      // Handle any errors during post creation
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create post"
      );
    }
  }
);

// Async thunk to like/unlike a post
export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId, thunkAPI) => {
    try {
      // Make PUT request to toggle like status
      const { data } = await axios.put(
        `${API_BASE}/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return { postId, data };
    } catch (error) {
      // Handle any errors during like/unlike operation
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to like post"
      );
    }
  }
);

// Async thunk to delete a post
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, thunkAPI) => {
    try {
      // Make DELETE request to remove a post
      await axios.delete(`${API_BASE}/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return postId;
    } catch (error) {
      // Handle any errors during post deletion
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete post"
      );
    }
  }
);

// Async thunk to add a comment to a post
export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, content }, thunkAPI) => {
    try {
      // Make POST request to add a new comment
      const { data } = await axios.post(
        `${API_BASE}/api/posts/${postId}/comments`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return { postId, comment: data };
    } catch (error) {
      // Handle any errors during comment addition
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add comment"
      );
    }
  }
);
