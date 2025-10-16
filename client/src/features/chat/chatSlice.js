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
 * Async thunk for editing a message
 * @async
 * @function editMessage
 * @param {Object} params - Edit parameters
 * @param {string} params.messageId - ID of the message to edit
 * @param {string} params.text - New text content
 * @returns {Promise<Object>} Redux thunk action
 * @throws {Error} If the API request fails
 */
export const editMessage = createAsyncThunk(
  "chat/editMessage",
  async ({ messageId, text }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/chat/messages/${messageId}`,
        { text },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to edit message"
      );
    }
  }
);

/**
 * Async thunk for deleting a message
 * @async
 * @function deleteMessage
 * @param {string} messageId - ID of the message to delete
 * @returns {Promise<Object>} Redux thunk action
 * @throws {Error} If the API request fails
 */
export const deleteMessage = createAsyncThunk(
  "chat/deleteMessage",
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/chat/messages/${messageId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete message"
      );
    }
  }
);

/**
 * Async thunk for marking messages as read
 * @async
 * @function markMessagesAsRead
 * @param {string} conversationId - ID of the conversation
 * @returns {Promise<Object>} Redux thunk action
 * @throws {Error} If the API request fails
 */
export const markMessagesAsRead = createAsyncThunk(
  "chat/markMessagesAsRead",
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/chat/${conversationId}/read`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark messages as read"
      );
    }
  }
);

/**
 * Async thunk for getting unread message count
 * @async
 * @function getUnreadCount
 * @param {string} conversationId - ID of the conversation
 * @returns {Promise<Object>} Redux thunk action
 * @throws {Error} If the API request fails
 */
export const getUnreadCount = createAsyncThunk(
  "chat/getUnreadCount",
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/chat/${conversationId}/unread-count`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get unread count"
      );
    }
  }
);

/**
 * Async thunk for removing a user from a conversation
 * @async
 * @function removeUserFromConversation
 * @param {Object} params - Parameters object
 * @param {string} params.conversationId - ID of the conversation
 * @param {string} params.userId - ID of the user to remove
 * @returns {Promise<Object>} Redux thunk action
 * @throws {Error} If the API request fails
 */
export const removeUserFromConversation = createAsyncThunk(
  "chat/removeUserFromConversation",
  async ({ conversationId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `/api/chat/conversations/${conversationId}/users/${userId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove user from conversation"
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
 * @property {number} unreadCount - Number of unread messages in current conversation
 */
const initialState = {
  messages: [],
  conversations: [],
  currentConversation: null,
  isTyping: false,
  loading: false,
  error: null,
  unreadCount: 0,
  userStatus: {},
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
     * Updates a message in the state (for edits)
     * @param {Object} state - Current state
     * @param {Object} action - Action object containing updated message
     */
    updateMessage: (state, action) => {
      const updatedMessage = action.payload;
      const index = state.messages.findIndex(
        (m) => m._id === updatedMessage._id
      );
      if (index !== -1) {
        state.messages[index] = updatedMessage;
      }
    },
    /**
     * Removes a message from the state
     * @param {Object} state - Current state
     * @param {Object} action - Action object containing message ID
     */
    removeMessage: (state, action) => {
      const messageId = action.payload;
      state.messages = state.messages.filter((m) => m._id !== messageId);
    },
    /**
     * Marks messages as read locally
     * @param {Object} state - Current state
     * @param {Object} action - Action object containing message IDs
     */
    markLocalMessagesAsRead: (state, action) => {
      const messageIds = action.payload;
      state.messages.forEach((message) => {
        if (messageIds.includes(message._id)) {
          message.read = true;
          message.readAt = new Date().toISOString();
        }
      });
      state.unreadCount = 0;
    },
    /**
     * Sets unread count
     * @param {Object} state - Current state
     * @param {Object} action - Action object containing count
     */
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    /**
     * Updates message status (delivered, read, error)
     * @param {Object} state - Current state
     * @param {Object} action - Action object containing status update
     */
    updateMessageStatus: (state, action) => {
      const { tempId, messageId, status, timestamp, readBy, readAt, error } = action.payload;
      
      // Find message by tempId or messageId
      const messageIndex = state.messages.findIndex(
        (m) => m.tempId === tempId || m._id === messageId
      );
      
      if (messageIndex !== -1) {
        const message = state.messages[messageIndex];
        
        if (status === 'delivered') {
          message.status = 'delivered';
          message._id = messageId;
          message.timestamp = timestamp;
          delete message.tempId;
        } else if (status === 'read') {
          message.status = 'read';
          message.read = true;
          message.readBy = readBy;
          message.readAt = readAt;
        } else if (status === 'error') {
          message.status = 'error';
          message.error = error;
        }
      }
    },

    /**
     * Adds a reaction to a message
     * @param {Object} state - Current state
     * @param {Object} action - Action object containing reaction data
     */
    addReaction: (state, action) => {
      const { messageId, reaction, userId, timestamp } = action.payload;
      
      const messageIndex = state.messages.findIndex(
        (m) => m._id === messageId
      );
      
      if (messageIndex !== -1) {
        const message = state.messages[messageIndex];
        
        if (!message.reactions) {
          message.reactions = [];
        }
        
        const existingReactionIndex = message.reactions.findIndex(
          (r) => r.userId === userId
        );
        
        if (existingReactionIndex !== -1) {
          message.reactions[existingReactionIndex].reaction = reaction;
          message.reactions[existingReactionIndex].timestamp = timestamp;
        } else {
          message.reactions.push({
            userId,
            reaction,
            timestamp
          });
        }
      }
    },

    /**
     * Updates user online status
     * @param {Object} state - Current state
     * @param {Object} action - Action object containing user status
     */
    updateUserStatus: (state, action) => {
      const { userId, status, timestamp } = action.payload;
      
      if (!state.userStatus) {
        state.userStatus = {};
      }
      
      state.userStatus[userId] = {
        status,
        timestamp
      };
    },

    /**
     * Sets the current conversation
     * @param {Object} state - Current state
     * @param {Object} action - Action object containing conversation
     */
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
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
        console.log("Fetched messages:", action.payload);
        state.messages = action.payload;
        
        // If we have messages, set the current conversation
        if (action.payload.length > 0) {
          const conversationId = action.payload[0].conversationId;
          // Find the conversation in the conversations list
          const conversation = state.conversations.find(c => c._id === conversationId);
          if (conversation) {
            state.currentConversation = conversation;
          }
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(editMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editMessage.fulfilled, (state, action) => {
        state.loading = false;
        const updatedMessage = action.payload;
        const index = state.messages.findIndex(
          (m) => m._id === updatedMessage._id
        );
        if (index !== -1) {
          state.messages[index] = updatedMessage;
        }
      })
      .addCase(editMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading = false;
        const deletedMessage = action.payload;
        const index = state.messages.findIndex(
          (m) => m._id === deletedMessage._id
        );
        if (index !== -1) {
          state.messages[index] = deletedMessage;
        }
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        const updatedMessages = action.payload;
        updatedMessages.forEach((updatedMsg) => {
          const index = state.messages.findIndex(
            (m) => m._id === updatedMsg._id
          );
          if (index !== -1) {
            state.messages[index] = updatedMsg;
          }
        });
        state.unreadCount = 0;
      })

      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.unreadCount || 0;
      })

      .addCase(removeUserFromConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeUserFromConversation.fulfilled, (state, action) => {
        state.loading = false;
        
        // If conversation was deleted, clear current conversation and remove from list
        if (action.payload.conversationDeleted) {
          state.currentConversation = null;
          state.conversations = state.conversations.filter(
            c => c._id !== action.meta.arg.conversationId
          );
          state.messages = [];
        } else {
          // Update the conversation in the list
          const conversationIndex = state.conversations.findIndex(
            c => c._id === action.meta.arg.conversationId
          );
          if (conversationIndex !== -1) {
            state.conversations[conversationIndex] = {
              ...state.conversations[conversationIndex],
              participants: state.conversations[conversationIndex].participants.filter(
                p => p._id !== action.meta.arg.userId
              )
            };
          }
          
          // Update current conversation if it's the one being modified
          if (state.currentConversation?._id === action.meta.arg.conversationId) {
            state.currentConversation = {
              ...state.currentConversation,
              participants: state.currentConversation.participants.filter(
                p => p._id !== action.meta.arg.userId
              )
            };
          }
        }
      })
      .addCase(removeUserFromConversation.rejected, (state, action) => {
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
  updateMessage,
  removeMessage,
  markLocalMessagesAsRead,
  setUnreadCount,
  updateMessageStatus,
  addReaction,
  updateUserStatus,
  setCurrentConversation,
} = chatSlice.actions;
export default chatSlice.reducer;
