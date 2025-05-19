import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * Async thunk for fetching all conversations
 * @async
 * @function fetchConversations
 * @returns {Promise<Object>} Redux thunk action
 * @throws {Error} If the API request fails
 */
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

/**
 * Async thunk for getting or creating a conversation with a user
 * @async
 * @function getOrCreateConversation
 * @param {string} receiverId - ID of the user to start/continue conversation with
 * @returns {Promise<Object>} Redux thunk action
 * @throws {Error} If the API request fails
 */
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

/**
 * Async thunk for fetching messages in a conversation
 * @async
 * @function fetchMessages
 * @param {string} conversationId - ID of the conversation to fetch messages from
 * @returns {Promise<Object>} Redux thunk action
 * @throws {Error} If the API request fails
 */
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

/**
 * Initial state for the chat slice
 * @type {Object}
 * @property {Array} messages - Array of chat messages
 * @property {Array} conversations - Array of conversations
 * @property {Object|null} currentConversation - Currently active conversation
 * @property {boolean} isTyping - Whether the other user is typing
 * @property {boolean} loading - Loading state
 * @property {string|null} error - Error message if any
 */
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
    /**
     * Adds a new message to the state
     * @param {Object} state - Current state
     * @param {Object} action - Action object containing the message to add
     * @param {string} action.payload.messageId - Unique identifier for the message
     * @param {string} action.payload.conversationId - ID of the conversation
     * @param {string} action.payload.text - Message text
     * @param {string} action.payload.timestamp - Message timestamp
     */
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
        exists = state.messages.some(
          (m) => m.messageId === newMessage.messageId
        );
      } else {
        console.warn(
          "[chatSlice] addMessage: Received message without messageId. Adding it, but this may lead to duplicates if IDs are not handled correctly upstream. Message:",
          newMessage
        );
        exists = false;
      }

      if (!exists) {
        state.messages.push(newMessage);

        if (
          state.currentConversation &&
          newMessage.conversationId === state.currentConversation._id
        ) {
          state.currentConversation.lastMessage = newMessage.text;
          state.currentConversation.lastMessageTimestamp = newMessage.timestamp;
        }

        const convoIndex = state.conversations.findIndex(
          (c) => c._id === newMessage.conversationId
        );
        if (convoIndex !== -1) {
          const updatedConversation = {
            ...state.conversations[convoIndex],
            lastMessage: newMessage.text,
            lastMessageTimestamp: newMessage.timestamp,
          };
          state.conversations.splice(convoIndex, 1);
          state.conversations.unshift(updatedConversation);
        }
      }
    },
    /**
     * Sets the typing indicator state
     * @param {Object} state - Current state
     * @param {Object} action - Action object containing the typing state
     * @param {boolean} action.payload - Whether the other user is typing
     */
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    /**
     * Clears all messages from the state
     * @param {Object} state - Current state
     */
    clearMessages: (state) => {
      state.messages = [];
    },
    /**
     * Clears the current conversation from the state
     * @param {Object} state - Current state
     */
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
    },
    /**
     * Resets the entire chat state to initial values
     * @returns {Object} Initial state
     */
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
