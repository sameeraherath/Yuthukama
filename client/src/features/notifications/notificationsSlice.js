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

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    unreadCount: 0,
    loading: false,
    error: null,
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
        state.items = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.isRead).length;
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
      });
  },
});

export const { addNotification, updateUnreadCount } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
