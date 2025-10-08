import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  addMessage,
  getOrCreateConversation,
  fetchMessages,
  clearMessages,
  editMessage,
  deleteMessage,
  markMessagesAsRead,
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
  IconButton,
  Badge,
  Chip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import MessageActions from "../components/MessageActions";
import MessageAttachment from "../components/MessageAttachment";
import ChatAPI from "../features/chat/chatAPI";
import EnhancedSkeleton from "../components/LoadingStates/EnhancedSkeleton";

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
  const fileInputRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

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

  // Initialize chat with proper user ID handling
  const userId = user?._id || user?.id;
  const { isConnected, startTyping, stopTyping } = useChat(
    userId,
    receiverId,
    currentConversation?._id
  );

  console.log("Chat state:", {
    conversationId,
    receiverId,
    displayName,
    isConnected,
    currentConversationId: currentConversation?._id,
    userId: userId,
    messagesCount: messages?.length,
    isAuthenticated,
    authLoading,
    userData: user,
  });

  // Handle conversation and messages loading
  useEffect(() => {
    if (!isAuthenticated || authLoading || !userId) return;

    const loadConversation = async () => {
      try {
        if (conversationId) {
          await dispatch(fetchMessages(conversationId)).unwrap();
        } else if (userId && receiverId) {
          const conversation = await dispatch(
            getOrCreateConversation(receiverId)
          ).unwrap();
          if (conversation._id) {
            await dispatch(fetchMessages(conversation._id));
          }
        }
      } catch (err) {
        console.error("Failed to load conversation:", err);
        setConnectionError(err.message || "Failed to load conversation");
      }
    };

    loadConversation();

    return () => {
      console.log("Cleaning up chat messages");
      dispatch(clearMessages());
    };
  }, [
    dispatch,
    userId,
    receiverId,
    conversationId,
    isAuthenticated,
    authLoading,
  ]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (currentConversation?._id && messages.length > 0) {
      const unreadMessages = messages.filter(
        (m) => !m.read && m.sender !== userId
      );
      if (unreadMessages.length > 0) {
        dispatch(markMessagesAsRead(currentConversation._id));
      }
    }
  }, [currentConversation, messages, userId, dispatch]);

  // Handle socket connection errors
  useEffect(() => {
    if (!isConnected && userId && receiverId) {
      setConnectionError("Connection lost. Trying to reconnect...");
    } else {
      setConnectionError(null);
    }
  }, [isConnected, userId, receiverId]);

  /**
   * Handles file selection
   */
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setConnectionError("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);

      // Generate preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  /**
   * Clears selected file
   */
  const handleClearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * Handles sending a new message with optional file attachment
   * @async
   * @function
   */
  const handleSendMessage = async () => {
    console.log("Attempting to send message:", {
      messageLength: newMessage.trim().length,
      hasFile: !!selectedFile,
      conversationId: currentConversation?._id,
    });

    if ((!newMessage.trim() && !selectedFile) || !currentConversation?._id) {
      console.log("Cannot send message: empty message and no file");
      return;
    }

    setIsSending(true);

    try {
      // Use REST API for sending messages with potential file attachments
      const messageData = await ChatAPI.sendMessage(
        currentConversation._id,
        newMessage.trim(),
        selectedFile
      );

      if (messageData) {
        console.log("Message sent successfully:", messageData);
        dispatch(addMessage(messageData));
        setNewMessage("");
        handleClearFile();

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          stopTyping();
          typingTimeoutRef.current = null;
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setConnectionError(
        error.message || "Failed to send message. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };

  /**
   * Handles editing a message
   */
  const handleEditMessage = async (messageId, newText) => {
    try {
      await dispatch(editMessage({ messageId, text: newText })).unwrap();
    } catch (error) {
      console.error("Error editing message:", error);
      setConnectionError("Failed to edit message. Please try again.");
    }
  };

  /**
   * Handles deleting a message
   */
  const handleDeleteMessage = async (messageId) => {
    try {
      await dispatch(deleteMessage(messageId)).unwrap();
    } catch (error) {
      console.error("Error deleting message:", error);
      setConnectionError("Failed to delete message. Please try again.");
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
   * @param {Object} message.attachment - Optional file attachment
   * @param {boolean} message.read - Whether message has been read
   * @param {boolean} message.edited - Whether message has been edited
   * @param {boolean} message.deleted - Whether message has been deleted
   * @param {number} index - Message index
   * @returns {JSX.Element} Message bubble with content and timestamp
   */
  const renderMessage = (message, index) => {
    const currentUserId = userId;
    const isSentByCurrentUser = message.sender === currentUserId;

    return (
      <Box
        key={message._id || index}
        className="message-container"
        sx={{
          alignSelf: isSentByCurrentUser ? "flex-end" : "flex-start",
          maxWidth: "70%",
          display: "flex",
          alignItems: "flex-start",
          gap: 0.5,
        }}
      >
        <Paper
          sx={{
            p: 1.5,
            backgroundColor: isSentByCurrentUser ? "#e3f2fd" : "#f5f5f5",
            borderRadius: 2,
            position: "relative",
            flex: 1,
            opacity: message.deleted ? 0.6 : 1,
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
              {/* Message attachment */}
              {message.attachment && (
                <MessageAttachment attachment={message.attachment} />
              )}

              {/* Message text */}
              {message.text && (
                <Typography
                  variant="body1"
                  sx={{
                    fontStyle: message.deleted ? "italic" : "normal",
                    color: message.deleted ? "text.secondary" : "text.primary",
                  }}
                >
                  {message.text}
                </Typography>
              )}

              {/* Message metadata */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 0.5,
                }}
              >
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {message.timestamp
                    ? new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </Typography>

                {/* Edited indicator */}
                {message.edited && !message.deleted && (
                  <Chip
                    label="edited"
                    size="small"
                    sx={{
                      height: 16,
                      fontSize: "0.65rem",
                      backgroundColor: "rgba(0, 0, 0, 0.08)",
                    }}
                  />
                )}

                {/* Read receipt for sent messages */}
                {isSentByCurrentUser && message.read && (
                  <DoneAllIcon
                    sx={{
                      fontSize: 14,
                      color: "#1ac173",
                    }}
                  />
                )}
              </Box>
            </>
          )}
        </Paper>

        {/* Message actions (edit/delete) */}
        {isSentByCurrentUser && message.sender !== "system" && (
          <MessageActions
            message={message}
            onEdit={handleEditMessage}
            onDelete={handleDeleteMessage}
            isSentByCurrentUser={isSentByCurrentUser}
          />
        )}
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
        <EnhancedSkeleton variant="chat" count={1} />
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
          ) : error || connectionError ? (
            <Alert severity="error" sx={{ m: 2 }}>
              {error || connectionError}
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

        {/* File preview */}
        {selectedFile && (
          <Box sx={{ p: 2, pb: 0 }}>
            <Paper
              sx={{
                p: 1.5,
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              {filePreview ? (
                <Box
                  component="img"
                  src={filePreview}
                  alt="Preview"
                  sx={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                />
              ) : (
                <AttachFileIcon sx={{ fontSize: 32, color: "#1ac173" }} />
              )}
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>
              <IconButton size="small" onClick={handleClearFile}>
                <CloseIcon />
              </IconButton>
            </Paper>
          </Box>
        )}

        <Stack direction="row" spacing={1} sx={{ p: 2 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <IconButton
            color="primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
            sx={{
              color: "#1ac173",
              "&:hover": {
                backgroundColor: "rgba(26, 193, 115, 0.1)",
              },
            }}
          >
            <AttachFileIcon />
          </IconButton>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            size="small"
            value={newMessage}
            onChange={handleTyping}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                "&.Mui-focused fieldset": {
                  borderColor: "#1ac173",
                  borderWidth: 2,
                },
              },
            }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1ac173",
              borderRadius: 3,
              padding: "8px 16px",
              "&:hover": {
                backgroundColor: "#158f5e",
              },
            }}
            endIcon={
              isSending ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SendIcon />
              )
            }
            onClick={handleSendMessage}
            disabled={(!newMessage.trim() && !selectedFile) || isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ChatPage;
