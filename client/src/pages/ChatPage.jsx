import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  addMessage,
  getOrCreateConversation,
  fetchMessages,
  clearMessages,
} from "../features/chat/chatSlice";
import useAuth from "../hooks/useAuth";
import useChat from "../hooks/useChat";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

/**
 * Chat page component for real-time messaging between users
 * @component
 * @returns {JSX.Element} Chat interface with message history and input
 * @example
 * // In App.jsx
 * <Route path="/chat/:conversationId?" element={<ChatPage />} />
 */
const ChatPage = () => {
  console.log("ChatPage component rendered");
  const location = useLocation();
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [isSending, setIsSending] = useState(false);

  // Debug auth state
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Auth state changed:", {
      user,
      isAuthenticated,
      authLoading,
      storedUser: storedUser ? JSON.parse(storedUser) : null,
      userId: user?._id,
      userData: user,
    });
  }, [user, isAuthenticated, authLoading]);

  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      navigate("/login", {
        state: {
          from: location,
          message: "Please log in to access the chat",
        },
      });
      return;
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  const postOwner = location.state?.postOwner;
  const receiverId = postOwner?._id;
  const displayName = postOwner?.username || "Unknown Author";

  console.log("Initial props:", {
    locationState: location.state,
    postOwner,
    user: user?._id,
    isAuthenticated,
    authLoading,
    userData: user,
  });

  const {
    messages,
    currentConversation,
    isTyping,
    error,
    loading: chatLoading,
  } = useSelector((state) => state.chat);

  const [newMessage, setNewMessage] = useState("");

  // Only initialize chat if user is authenticated and has an ID
  const { isConnected, sendMessage, startTyping, stopTyping } = useChat(
    user?._id || user?.id, // Try both _id and id
    receiverId,
    currentConversation?._id
  );

  console.log("Chat state:", {
    conversationId,
    receiverId,
    displayName,
    isConnected,
    currentConversationId: currentConversation?._id,
    userId: user?._id || user?.id, // Try both _id and id
    messagesCount: messages?.length,
    isAuthenticated,
    authLoading,
    userData: user,
  });

  useEffect(() => {
    if (!isAuthenticated || authLoading) {
      console.log("Waiting for authentication to complete");
      return;
    }

    if (!user?._id && !user?.id) {
      console.log("User ID not found in auth state:", user);
      return;
    }

    console.log("Effect triggered - Loading conversation and messages", {
      conversationId,
      userId: user?._id || user?.id,
      receiverId,
      currentConversationId: currentConversation?._id,
    });

    if (conversationId) {
      console.log(
        "Fetching messages for existing conversation:",
        conversationId
      );
      dispatch(fetchMessages(conversationId))
        .unwrap()
        .then(() => console.log("Messages fetched successfully"))
        .catch((err) => {
          console.error("Failed to load messages:", err);
        });
    } else if (user && receiverId) {
      console.log("Creating new conversation with receiver:", receiverId);
      dispatch(getOrCreateConversation(receiverId))
        .unwrap()
        .then((conversation) => {
          console.log("Conversation created/fetched:", {
            conversationId: conversation._id,
            participants: conversation.participants,
          });
          if (conversation._id) {
            dispatch(fetchMessages(conversation._id));
          }
        })
        .catch((err) => {
          console.error("Failed to load conversation:", err);
        });
    } else {
      console.log("Missing required data for conversation:", {
        hasUser: !!user,
        hasUserId: !!(user?._id || user?.id),
        hasReceiverId: !!receiverId,
      });
    }

    return () => {
      console.log("Cleaning up chat messages");
      dispatch(clearMessages());
    };
  }, [
    dispatch,
    user,
    receiverId,
    conversationId,
    currentConversation?._id,
    isAuthenticated,
    authLoading,
  ]);

  /**
   * Effect hook to scroll to latest message
   * @effect
   * @listens {messages} - Message array
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Handles sending a new message
   * @async
   * @function
   */
  const handleSendMessage = () => {
    console.log("Attempting to send message:", {
      messageLength: newMessage.trim().length,
      isConnected,
      conversationId: currentConversation?._id,
    });

    if (!newMessage.trim() || !isConnected) {
      console.log("Cannot send message: empty message or not connected");
      return;
    }

    if (!currentConversation?._id) {
      console.log("Cannot send message: no active conversation");
      return;
    }

    const trimmedMessage = newMessage.trim();
    setIsSending(true);

    try {
      const messageData = sendMessage(trimmedMessage);

      if (messageData) {
        console.log("Message sent successfully:", messageData);
        dispatch(addMessage(messageData));
        setNewMessage("");

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          stopTyping();
          typingTimeoutRef.current = null;
        }
      } else {
        console.error("Failed to send message - no message data returned");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  /**
   * Handles typing indicator and message input
   * @function
   * @param {Event} e - Input change event
   */
  const handleTyping = useCallback(
    (e) => {
      setNewMessage(e.target.value);

      if (e.target.value.trim() && isConnected) {
        console.log("User is typing...");
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        } else {
          startTyping();
        }

        typingTimeoutRef.current = setTimeout(() => {
          console.log("User stopped typing");
          stopTyping();
          typingTimeoutRef.current = null;
        }, 2000);
      } else if (!e.target.value.trim() && typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        stopTyping();
        typingTimeoutRef.current = null;
      }
    },
    [isConnected, startTyping, stopTyping]
  );

  /**
   * Renders a single message in the chat
   * @function
   * @param {Object} message - Message data
   * @param {string} message.sender - Sender ID
   * @param {string} message.text - Message text
   * @param {string} message.timestamp - Message timestamp
   * @param {number} index - Message index
   * @returns {JSX.Element} Message bubble with content and timestamp
   */
  const renderMessage = (message, index) => {
    const currentUserId = user?._id || user?.id;
    const isSentByCurrentUser = message.sender === currentUserId;
    return (
      <Box
        key={index}
        sx={{
          alignSelf: isSentByCurrentUser ? "flex-end" : "flex-start",
          maxWidth: "70%",
        }}
      >
        <Paper
          sx={{
            p: 1.5,
            backgroundColor: isSentByCurrentUser ? "#e3f2fd" : "#f5f5f5",
            borderRadius: 2,
          }}
        >
          {message.sender === "system" ? (
            <Typography
              variant="body2"
              sx={{ fontStyle: "italic", color: "text.secondary" }}
            >
              {message.text}
            </Typography>
          ) : (
            <>
              <Typography variant="body1">{message.text}</Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {message.timestamp
                  ? new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </Typography>
            </>
          )}
        </Paper>
      </Box>
    );
  };

  // Show loading state while checking authentication or loading chat
  if (authLoading || chatLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: "#1ac173" }} />
      </Box>
    );
  }

  // Show error if not authenticated
  if (!isAuthenticated) {
    return (
      <Box sx={{ minHeight: "100vh", padding: "20px" }}>
        <Paper
          elevation={3}
          sx={{
            maxWidth: 800,
            margin: "0 auto",
            padding: 3,
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" mb={2}>
            Authentication Required
          </Typography>
          <Typography variant="body1" mb={3}>
            Please log in to access the chat.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            sx={{
              backgroundColor: "#1ac173",
              borderRadius: 3,
              padding: "8px 16px",
            }}
          >
            Go to Login
          </Button>
        </Paper>
      </Box>
    );
  }

  if (!receiverId && !location.state?.postOwner) {
    return (
      <Box sx={{ minHeight: "100vh", padding: "20px" }}>
        <Paper
          elevation={3}
          sx={{
            maxWidth: 800,
            margin: "0 auto",
            padding: 3,
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" mb={2}>
            No chat selected
          </Typography>
          <Typography variant="body1" mb={3}>
            Please select a user to chat with.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/home")}
            sx={{
              backgroundColor: "#1ac173",
              borderRadius: 3,
              padding: "8px 16px",
            }}
          >
            Return to Home
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", padding: "20px" }}>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 800,
          margin: "0 auto",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: "#1ac173",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          <Avatar>{displayName.charAt(0)}</Avatar>
          <Typography variant="h6">
            Chat with {displayName}
            {!isConnected && <span> (Connecting...)</span>}
          </Typography>
        </Box>
        <Divider />

        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            position: "relative",
          }}
        >
          {chatLoading && !messages.length ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress sx={{ color: "#1ac173" }} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          ) : (
            <>
              {messages.map(renderMessage)}
              {isTyping && (
                <Box sx={{ alignSelf: "flex-start", ml: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontStyle: "italic", color: "text.secondary" }}
                  >
                    {displayName} is typing...
                  </Typography>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </Box>
        <Divider />

        <Stack direction="row" spacing={1} sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            size="small"
            value={newMessage}
            onChange={handleTyping}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            disabled={!isConnected}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                "&.Mui-focused fieldset": {
                  borderColor: "#1ac173",
                  borderWidth: 2,
                },
              },
            }}
          />{" "}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1ac173",
              borderRadius: 3,
              padding: "8px 16px",
            }}
            endIcon={
              isSending ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SendIcon />
              )
            }
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected || isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ChatPage;
