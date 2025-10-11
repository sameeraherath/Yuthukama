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

      const { data } = await axios.get(`${API_BASE}/api/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      const token = localStorage.getItem("token");
      const { data } = await axios.post(`${API_BASE}/api/posts`, postData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        withCredentials: true,
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

/**
 * Fetches trending/popular posts
 * @async
 * @function fetchTrendingPosts
 * @param {Object} params - Parameters for fetching trending posts
 * @param {number} [params.limit=5] - Number of posts to fetch
 * @param {number} [params.days=7] - Number of days to consider for trending
 * @returns {Promise<Object>} Redux thunk action
 * @throws {Error} If authentication is missing or request fails
 */
export const fetchTrendingPosts = createAsyncThunk(
  "posts/fetchTrendingPosts",
  async ({ limit = 5, days = 7 }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return thunkAPI.rejectWithValue(
          "Authentication required. Please log in."
        );
      }

      const { data } = await axios.get(`${API_BASE}/api/posts/trending`, {
        params: { limit, days },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch trending posts"
      );
    }
  }
);

/**
 * Toggles save/unsave a post
 * @async
 * @function toggleSavePost
 * @param {string} postId - ID of the post to save/unsave
 * @returns {Promise<Object>} Updated save status
 * @throws {Error} If saving the post fails
 */
export const toggleSavePost = async (postId) => {
  const response = await axios.put(`${API_BASE}/api/posts/${postId}/save`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

/**
 * Fetches user's saved posts
 * @async
 * @function fetchSavedPosts
 * @returns {Promise<Object>} Redux thunk action
 * @throws {Error} If authentication is missing or request fails
 */
export const fetchSavedPosts = createAsyncThunk(
  "posts/fetchSavedPosts",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return thunkAPI.rejectWithValue(
          "Authentication required. Please log in."
        );
      }

      const { data } = await axios.get(`${API_BASE}/api/posts/saved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch saved posts"
      );
    }
  }
);

/**
 * Reports a post
 * @async
 * @function reportPost
 * @param {Object} reportData - Report data
 * @param {string} reportData.postId - ID of the post to report
 * @param {string} reportData.reason - Report reason
 * @param {string} [reportData.description] - Additional description
 * @returns {Promise<Object>} Redux thunk action
 * @throws {Error} If report submission fails
 */
export const reportPost = createAsyncThunk(
  "posts/reportPost",
  async ({ postId, reason, description }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return thunkAPI.rejectWithValue(
          "Authentication required. Please log in."
        );
      }

      const { data } = await axios.post(
        `${API_BASE}/api/posts/${postId}/report`,
        { reason, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to report post"
      );
    }
  }
);