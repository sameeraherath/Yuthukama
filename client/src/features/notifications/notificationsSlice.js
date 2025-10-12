import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/notifications");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk for marking a notification as read
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/api/notifications/${notificationId}/read`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk for marking all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.patch("/api/notifications/mark-all-read");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk for deleting a notification
export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/notifications/${notificationId}`);
      return { notificationId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk for deleting all notifications
export const deleteAllNotifications = createAsyncThunk(
  "notifications/deleteAllNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete("/api/notifications");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk for cleaning up old notifications
export const cleanupOldNotifications = createAsyncThunk(
  "notifications/cleanupOldNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete("/api/notifications/cleanup");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    unreadCount: 0,
    loading: false,
    error: null,
    pagination: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    updateUnreadCount: (state) => {
      state.unreadCount = state.items.filter((n) => !n.isRead).length;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both old format (array) and new format (object with pagination)
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
          state.unreadCount = action.payload.filter((n) => !n.isRead).length;
        } else {
          state.items = action.payload.notifications;
          state.unreadCount = action.payload.notifications.filter((n) => !n.isRead).length;
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.items.find(
          (n) => n._id === action.payload._id
        );
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount -= 1;
        }
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.items.forEach((notification) => {
          notification.isRead = true;
        });
        state.unreadCount = 0;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notificationId = action.payload.notificationId;
        const notification = state.items.find((n) => n._id === notificationId);
        if (notification && !notification.isRead) {
          state.unreadCount -= 1;
        }
        state.items = state.items.filter((n) => n._id !== notificationId);
      })
      .addCase(deleteAllNotifications.fulfilled, (state) => {
        state.items = [];
        state.unreadCount = 0;
      })
      .addCase(cleanupOldNotifications.fulfilled, (state, action) => {
        // Refresh notifications after cleanup
        // This would typically trigger a refetch
      });
  },
});

export const { addNotification, updateUnreadCount } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
