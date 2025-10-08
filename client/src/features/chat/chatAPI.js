import axios from "axios";

const ChatAPI = {
  getConversations: async () => {
    try {
      const response = await axios.get("/api/chat", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to fetch conversations" }
      );
    }
  },

  getOrCreateConversation: async (receiverId) => {
    try {
      const response = await axios.get(`/api/chat/user/${receiverId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to create conversation" }
      );
    }
  },

  getMessages: async (conversationId) => {
    try {
      const response = await axios.get(`/api/chat/${conversationId}/messages`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch messages" };
    }
  },

  sendMessage: async (conversationId, text, file) => {
    try {
      const formData = new FormData();
      if (text) formData.append("text", text);
      if (file) formData.append("file", file);
      formData.append("conversationId", conversationId);

      const response = await axios.post("/api/chat/messages", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to send message" };
    }
  },

  editMessage: async (messageId, newText) => {
    try {
      const response = await axios.put(
        `/api/chat/messages/${messageId}`,
        { text: newText },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to edit message" };
    }
  },

  deleteMessage: async (messageId) => {
    try {
      const response = await axios.delete(`/api/chat/messages/${messageId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete message" };
    }
  },

  markMessagesAsRead: async (conversationId) => {
    try {
      const response = await axios.put(
        `/api/chat/${conversationId}/read`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to mark messages as read" }
      );
    }
  },

  getUnreadCount: async (conversationId) => {
    try {
      const response = await axios.get(
        `/api/chat/${conversationId}/unread-count`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to get unread count" };
    }
  },
};

export default ChatAPI;
