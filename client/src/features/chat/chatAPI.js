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
};

export default ChatAPI;
