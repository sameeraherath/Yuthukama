import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { addMessage, setTyping } from "../features/chat/chatSlice";

let socket;

const useChat = (userId, receiverId, conversationId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping] = useState(false);
  const dispatch = useDispatch();

  const roomId =
    userId && receiverId ? [userId, receiverId].sort().join("_") : null;
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

    const handleConnect = () => {
      console.log("Socket connected");
      setIsConnected(true);
      if (roomId) {
        joinRoom();
      }
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    };
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

    const handleReceiveMessage = (message) => {
      console.log("Received message:", message);
      if (message.sender !== userId) {
        dispatch(addMessage(message));
      }
    };

    const handleTypingStart = () => {
      dispatch(setTyping(true));
    };

    const handleTypingStop = () => {
      dispatch(setTyping(false));
    };

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

  const startTyping = useCallback(() => {
    if (isConnected && roomId) {
      socket.emit("typing", { roomId, userId });
    }
  }, [isConnected, roomId, userId]);

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
