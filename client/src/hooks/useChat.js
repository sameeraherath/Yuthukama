import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { addMessage, setTyping, updateMessageStatus, addReaction, updateUserStatus } from "../features/chat/chatSlice";

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
 * @property {Function} markMessageAsRead - Function to mark message as read
 * @property {Function} addReactionToMessage - Function to add reaction to message
 * @property {Object} userStatus - Online status of users
 * @example
 * const { isConnected, sendMessage } = useChat(userId, receiverId, conversationId);
 *
 * // Send a message
 * const messageData = sendMessage('Hello!');
 */
const useChat = (userId, receiverId, conversationId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [connectionError, setConnectionError] = useState(null);
  const [userStatus, setUserStatus] = useState({});
  const [pendingMessages, setPendingMessages] = useState(new Map());
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
    if (!userId || !receiverId) {
      console.log("Missing userId or receiverId, skipping socket connection");
      return;
    }

    // Add connection timeout
    const connectionTimeout = setTimeout(() => {
      if (!isConnected) {
        console.warn("Socket connection timeout after 10 seconds");
        setConnectionError("Connection timeout. Please refresh the page.");
        setConnectionAttempts((prev) => prev + 1);
      }
    }, 10000);

    if (!socket) {
      console.log("Initializing new socket connection...");
      socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:5000", {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
        path: "/socket.io",
        transports: ["websocket", "polling"],
        autoConnect: true,
        forceNew: false,
      });
    }

    if (!socket.connected) {
      console.log("Socket not connected, attempting to connect...");
      socket.connect();
    }

    /**
     * Handles socket connection
     * @function
     */
    const handleConnect = () => {
      console.log("Socket connected successfully");
      setIsConnected(true);
      setConnectionError(null);
      setConnectionAttempts(0);
      clearTimeout(connectionTimeout);

      if (roomId) {
        joinRoom();
      }
    };

    /**
     * Handles socket disconnection
     * @function
     */
    const handleDisconnect = (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);

      if (
        reason === "io server disconnect" ||
        reason === "io client disconnect"
      ) {
        // Manual disconnect, don't show error
        setConnectionError(null);
      } else {
        setConnectionError("Connection lost. Reconnecting...");
      }
    };

    /**
     * Handles connection errors and attempts reconnection
     * @function
     * @param {Error} error - Connection error
     */
    const handleConnectError = (error) => {
      console.error("Connection error:", error.message || error);
      console.log(
        "Attempted connection to:",
        import.meta.env.VITE_SERVER_URL || "http://localhost:5000"
      );
      setIsConnected(false);
      setConnectionAttempts((prev) => prev + 1);

      // Provide specific error messages
      if (error.message?.includes("xhr poll error")) {
        setConnectionError(
          "Server connection failed. Please check if the server is running."
        );
      } else if (error.message?.includes("timeout")) {
        setConnectionError("Connection timeout. Retrying...");
      } else {
        setConnectionError("Unable to connect. Retrying...");
      }
    };

    /**
     * Handles successful reconnection
     * @function
     */
    const handleReconnect = (attemptNumber) => {
      console.log("Reconnected after", attemptNumber, "attempts");
      setConnectionError(null);
      setConnectionAttempts(0);
      if (roomId) {
        joinRoom();
      }
    };

    /**
     * Handles reconnection attempts
     * @function
     */
    const handleReconnectAttempt = (attemptNumber) => {
      console.log("Reconnection attempt", attemptNumber);
      setConnectionError(`Reconnecting... (Attempt ${attemptNumber})`);
    };

    /**
     * Handles failed reconnection
     * @function
     */
    const handleReconnectFailed = () => {
      console.error("Reconnection failed after all attempts");
      setConnectionError("Failed to connect. Please refresh the page.");
      setIsConnected(false);
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
        // Mark message as read automatically
        if (message._id) {
          markMessageAsRead(message._id);
        }
      }
    };

    /**
     * Handles message delivery confirmation
     * @function
     * @param {Object} data - Delivery confirmation data
     */
    const handleMessageDelivered = (data) => {
      console.log("Message delivered:", data);
      dispatch(updateMessageStatus({
        tempId: data.tempId,
        status: 'delivered',
        messageId: data.messageId,
        timestamp: data.timestamp
      }));
    };

    /**
     * Handles message read receipt
     * @function
     * @param {Object} data - Read receipt data
     */
    const handleMessageRead = (data) => {
      console.log("Message read:", data);
      dispatch(updateMessageStatus({
        messageId: data.messageId,
        status: 'read',
        readBy: data.readBy,
        readAt: data.readAt
      }));
    };

    /**
     * Handles user status changes
     * @function
     * @param {Object} data - User status data
     */
    const handleUserStatusChange = (data) => {
      console.log("User status changed:", data);
      setUserStatus(prev => ({
        ...prev,
        [data.userId]: {
          status: data.status,
          timestamp: data.timestamp
        }
      }));
      dispatch(updateUserStatus(data));
    };

    /**
     * Handles message reactions
     * @function
     * @param {Object} data - Reaction data
     */
    const handleMessageReaction = (data) => {
      console.log("Message reaction:", data);
      dispatch(addReaction(data));
    };

    /**
     * Handles message errors
     * @function
     * @param {Object} data - Error data
     */
    const handleMessageError = (data) => {
      console.error("Message error:", data);
      dispatch(updateMessageStatus({
        tempId: data.tempId,
        status: 'error',
        error: data.error
      }));
    };

    /**
     * Handles typing indicator start
     * @function
     * @param {Object} data - Typing data
     */
    const handleTypingStart = (data) => {
      if (data.userId !== userId) {
        setIsTyping(true);
        dispatch(setTyping(true));
      }
    };

    /**
     * Handles typing indicator stop
     * @function
     * @param {Object} data - Stop typing data
     */
    const handleTypingStop = (data) => {
      if (data.userId !== userId) {
        setIsTyping(false);
        dispatch(setTyping(false));
      }
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
    socket.on("reconnect", handleReconnect);
    socket.on("reconnect_attempt", handleReconnectAttempt);
    socket.on("reconnect_failed", handleReconnectFailed);
    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_delivered", handleMessageDelivered);
    socket.on("message_read", handleMessageRead);
    socket.on("message_error", handleMessageError);
    socket.on("user_status_change", handleUserStatusChange);
    socket.on("message_reaction", handleMessageReaction);
    socket.on("typing", handleTypingStart);
    socket.on("stop_typing", handleTypingStop);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      clearTimeout(connectionTimeout);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("reconnect", handleReconnect);
      socket.off("reconnect_attempt", handleReconnectAttempt);
      socket.off("reconnect_failed", handleReconnectFailed);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_delivered", handleMessageDelivered);
      socket.off("message_read", handleMessageRead);
      socket.off("message_error", handleMessageError);
      socket.off("user_status_change", handleUserStatusChange);
      socket.off("message_reaction", handleMessageReaction);
      socket.off("typing", handleTypingStart);
      socket.off("stop_typing", handleTypingStop);
    };
  }, [dispatch, userId, receiverId, roomId, conversationId, isConnected]);

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

      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const messageData = {
        roomId,
        conversationId,
        sender: userId,
        text: text.trim(),
        timestamp: new Date().toISOString(),
        messageId: `${userId}_${Date.now()}`,
        tempId,
        status: 'sending'
      };

      // Store pending message
      setPendingMessages(prev => new Map(prev.set(tempId, messageData)));

      // Add optimistic message to store
      dispatch(addMessage(messageData));

      setTimeout(() => {
        socket.emit("send_message", messageData);
        console.log(
          `Sending message to room ${roomId}: ${text.trim()}`,
          messageData
        );
      }, 100);

      return messageData;
    },
    [isConnected, roomId, conversationId, userId, dispatch]
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

  /**
   * Marks a message as read
   * @function
   * @param {string} messageId - ID of the message to mark as read
   */
  const markMessageAsRead = useCallback((messageId) => {
    if (isConnected && messageId) {
      socket.emit("mark_message_read", {
        messageId,
        conversationId
      });
    }
  }, [isConnected, conversationId]);

  /**
   * Adds a reaction to a message
   * @function
   * @param {string} messageId - ID of the message
   * @param {string} reaction - Reaction emoji
   */
  const addReactionToMessage = useCallback((messageId, reaction) => {
    if (isConnected && messageId && reaction) {
      socket.emit("add_reaction", {
        messageId,
        reaction,
        userId,
        roomId
      });
    }
  }, [isConnected, userId, roomId]);

  return {
    isConnected,
    sendMessage,
    startTyping,
    stopTyping,
    isTyping,
    connectionError,
    connectionAttempts,
    markMessageAsRead,
    addReactionToMessage,
    userStatus,
  };
};

export default useChat;
