import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_SERVER_URL;

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

      const { data } = await axios.get(`${API_BASE}/api/posts`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch posts"
      );
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, thunkAPI) => {
    try {
     
      const { data } = await axios.post(`${API_BASE}/api/posts`, postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create post"
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, thunkAPI) => {
    try {
      await axios.delete(`${API_BASE}/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return postId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete post"
      );
    }
  }
);
