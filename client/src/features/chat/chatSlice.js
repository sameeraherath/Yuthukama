import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/chat", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch conversations"
      );
    }
  }
);

export const getOrCreateConversation = createAsyncThunk(
  "chat/getOrCreateConversation",
  async (receiverId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/chat/user/${receiverId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create conversation"
      );
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/chat/${conversationId}/messages`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch messages"
      );
    }
  }
);

const initialState = {
  messages: [],
  conversations: [],
  currentConversation: null,
  isTyping: false,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const newMessage = action.payload;

      if (!newMessage) {
        console.warn(
          "[chatSlice] addMessage: called with null or undefined payload."
        );
        return;
      }

      let exists = false;
      if (newMessage.messageId) {
        // If a unique messageId is provided, use it for deduplication
        exists = state.messages.some(
          (m) => m.messageId === newMessage.messageId
        );
      } else {
        // Message lacks a messageId. This is not ideal.
        // The original fallback (timestamp, sender, text) could incorrectly drop messages.
        // For now, to prevent messages from being dropped, we'll log a warning.
        // We will NOT use the risky fallback. If no messageId, assume it's new for now.
        // This prioritizes displaying messages over strict deduplication if IDs are missing.
        // The root cause of missing messageId should be investigated.
        console.warn(
          "[chatSlice] addMessage: Received message without messageId. Adding it, but this may lead to duplicates if IDs are not handled correctly upstream. Message:",
          newMessage
        );
        exists = false; // Treat as new if no ID, to avoid dropping it.
      }

      if (!exists) {
        // console.log("[chatSlice] addMessage: Adding new message to state:", newMessage);
        state.messages.push(newMessage);

        // Update the current conversation's last message details
        if (
          state.currentConversation &&
          newMessage.conversationId === state.currentConversation._id
        ) {
          state.currentConversation.lastMessage = newMessage.text;
          state.currentConversation.lastMessageTimestamp = newMessage.timestamp;
        }

        // Update the conversation in the main conversations list
        // and move it to the top
        const convoIndex = state.conversations.findIndex(
          (c) => c._id === newMessage.conversationId
        );
        if (convoIndex !== -1) {
          const updatedConversation = {
            ...state.conversations[convoIndex],
            lastMessage: newMessage.text,
            lastMessageTimestamp: newMessage.timestamp,
          };
          state.conversations.splice(convoIndex, 1); // Remove from current position
          state.conversations.unshift(updatedConversation); // Add to the beginning
        }
      } else {
        // console.log("[chatSlice] addMessage: Message already exists in state, skipping:", newMessage);
      }
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
    },
    clearChatState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getOrCreateConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrCreateConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConversation = action.payload;

        const exists = state.conversations.some(
          (c) => c._id === action.payload._id
        );
        if (!exists) {
          state.conversations.unshift(action.payload);
        }
      })
      .addCase(getOrCreateConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addMessage,
  setTyping,
  clearMessages,
  clearCurrentConversation,
  clearChatState,
} = chatSlice.actions;
export default chatSlice.reducer;
