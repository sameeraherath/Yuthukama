import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_SERVER_URL;

/**
 * Fetches all posts from the API
 * @async
 * @function fetchPosts
 * @returns {Promise<Object>} Redux thunk action
 * @throws {Error} If authentication is missing or request fails
 * @example
 * // In a component
 * const dispatch = useDispatch();
 * const posts = await dispatch(fetchPosts()).unwrap();
 */
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

/**
 * Creates a new post
 * @async
 * @function createPost
 * @param {Object} postData - Post data to create
 * @param {string} postData.content - Post content
 * @param {string} [postData.image] - Optional image URL
 * @returns {Promise<Object>} Redux thunk action
 * @throws {Error} If post creation fails
 */
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

/**
 * Deletes a post by ID
 * @async
 * @function deletePost
 * @param {string} postId - ID of the post to delete
 * @returns {Promise<Object>} Redux thunk action
 * @throws {Error} If post deletion fails
 */
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

/**
 * Likes a post by ID
 * @async
 * @function likePost
 * @param {string} postId - ID of the post to like
 * @returns {Promise<Object>} Updated post data
 * @throws {Error} If liking the post fails
 */
export const likePost = async (postId) => {
  const response = await axios.put(`${API_BASE}/api/posts/${postId}/like`);
  return response.data;
};

/**
 * Adds a comment to a post
 */
export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, content }, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `${API_BASE}/api/posts/${postId}/comments`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add comment"
      );
    }
  }
);

/**
 * Deletes a comment from a post
 */
export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async ({ postId, commentId }, thunkAPI) => {
    try {
      const { data } = await axios.delete(
        `${API_BASE}/api/posts/${postId}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete comment"
      );
    }
  }
);
