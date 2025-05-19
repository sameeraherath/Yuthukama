import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { addMessage, setTyping } from "../features/chat/chatSlice";

/**
 * Socket.IO instance for real-time communication
 * @type {Socket}
 */
let socket;

/**
 * Custom hook for managing real-time chat functionality
 * @param {string} userId - Current user's ID
 * @param {string} receiverId - Recipient's user ID
 * @param {string} conversationId - Current conversation ID
 * @returns {Object} Chat state and methods
 * @property {boolean} isConnected - Socket connection status
 * @property {Function} sendMessage - Function to send a message
 * @property {Function} startTyping - Function to indicate typing start
 * @property {Function} stopTyping - Function to indicate typing stop
 * @property {boolean} isTyping - Whether the other user is typing
 * @example
 * const { isConnected, sendMessage } = useChat(userId, receiverId, conversationId);
 *
 * // Send a message
 * const messageData = sendMessage('Hello!');
 */
const useChat = (userId, receiverId, conversationId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping] = useState(false);
  const dispatch = useDispatch();

  const roomId =
    userId && receiverId ? [userId, receiverId].sort().join("_") : null;

  /**
   * Effect hook to manage socket connection and event handlers
   * @effect
   * @listens {userId} - Current user ID
   * @listens {receiverId} - Recipient user ID
   * @listens {conversationId} - Conversation ID
   * @listens {dispatch} - Redux dispatch function
   */
  useEffect(() => {
    if (!userId || !receiverId) return;
    if (!socket) {
      socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        path: "/socket.io",
      });
    }

    if (!socket.connected) {
      socket.connect();
    }

    /**
     * Handles socket connection
     * @function
     */
    const handleConnect = () => {
      console.log("Socket connected");
      setIsConnected(true);
      if (roomId) {
        joinRoom();
      }
    };

    /**
     * Handles socket disconnection
     * @function
     */
    const handleDisconnect = () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    };

    /**
     * Handles connection errors and attempts reconnection
     * @function
     * @param {Error} error - Connection error
     */
    const handleConnectError = (error) => {
      console.error("Connection error:", error);
      console.log(
        "Attempted connection to:",
        import.meta.env.VITE_API_URL || "http://localhost:5000"
      );
      setIsConnected(false);

      setTimeout(() => {
        if (!socket.connected) {
          console.log("Attempting to reconnect...");
          socket.connect();
        }
      }, 5000);
    };

    /**
     * Handles incoming messages
     * @function
     * @param {Object} message - Received message data
     */
    const handleReceiveMessage = (message) => {
      console.log("Received message:", message);
      if (message.sender !== userId) {
        dispatch(addMessage(message));
      }
    };

    /**
     * Handles typing indicator start
     * @function
     */
    const handleTypingStart = () => {
      dispatch(setTyping(true));
    };

    /**
     * Handles typing indicator stop
     * @function
     */
    const handleTypingStop = () => {
      dispatch(setTyping(false));
    };

    /**
     * Joins a chat room
     * @function
     */
    const joinRoom = () => {
      if (roomId) {
        console.log(`Joining room: ${roomId}`);
        socket.emit("join_room", roomId);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("receive_message", handleReceiveMessage);
    socket.on("typing", handleTypingStart);
    socket.on("stop_typing", handleTypingStop);

    if (socket.connected) {
      joinRoom();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("typing", handleTypingStart);
      socket.off("stop_typing", handleTypingStop);
    };
  }, [dispatch, userId, receiverId, roomId, conversationId]);

  /**
   * Sends a message through the socket
   * @function
   * @param {string} text - Message text
   * @returns {Object|null} Message data or null if conditions not met
   */
  const sendMessage = useCallback(
    (text) => {
      if (!isConnected || !text.trim() || !roomId) {
        console.log("Cannot send message - conditions not met:", {
          isConnected,
          hasText: !!text.trim(),
          roomId,
        });
        return null;
      }

      if (!conversationId) {
        console.log("Cannot send message - missing conversationId");
        return null;
      }

      socket.emit("join_room", roomId);

      const messageData = {
        roomId,
        conversationId,
        sender: userId,
        text: text.trim(),
        timestamp: new Date().toISOString(),
        messageId: `${userId}_${Date.now()}`,
      };

      setTimeout(() => {
        socket.emit("send_message", messageData);
        console.log(
          `Sending message to room ${roomId}: ${text.trim()}`,
          messageData
        );
      }, 100);

      return messageData;
    },
    [isConnected, roomId, conversationId, userId]
  );

  /**
   * Indicates that the user has started typing
   * @function
   */
  const startTyping = useCallback(() => {
    if (isConnected && roomId) {
      socket.emit("typing", { roomId, userId });
    }
  }, [isConnected, roomId, userId]);

  /**
   * Indicates that the user has stopped typing
   * @function
   */
  const stopTyping = useCallback(() => {
    if (isConnected && roomId) {
      socket.emit("stop_typing", { roomId, userId });
    }
  }, [isConnected, roomId, userId]);

  return {
    isConnected,
    sendMessage,
    startTyping,
    stopTyping,
    isTyping,
  };
};

export default useChat;
