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
  setCurrentConversation,
  fetchConversations,
} from "../features/chat/chatSlice";
import { fetchUserById } from "../features/auth/userSlice";
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
import CircleIcon from "@mui/icons-material/Circle";
import MessageActions from "../components/MessageActions";
import MessageAttachment from "../components/MessageAttachment";
import MessageStatus from "../components/MessageStatus";
import MessageReactions from "../components/MessageReactions";
import OnlineStatus from "../components/OnlineStatus";
import UserManagement from "../components/chat/UserManagement";
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

  const {
    messages,
    currentConversation,
    isTyping,
    error,
    loading: chatLoading,
    conversations,
  } = useSelector((state) => state.chat);

  const { profileUser } = useSelector((state) => state.user);

  const [newMessage, setNewMessage] = useState("");

  // Initialize chat with proper user ID handling
  const userId = user?._id || user?.id;

  // Get other participant from current conversation or location state
  const postOwner = location.state?.postOwner;
  const otherParticipant = currentConversation?.participants?.find(
    (p) => p._id !== userId
  );

  // Receiver can be from postOwner (when coming from MessageButton)
  // or from conversation participants (when coming from ConversationList)
  const receiverId = postOwner?._id || otherParticipant?._id;
  const displayName =
    postOwner?.username || 
    otherParticipant?.username || 
    postOwner?.name || 
    otherParticipant?.name ||
    (profileUser?._id === receiverId ? profileUser?.username : null) ||
    "Loading...";

  console.log("Initial props:", {
    locationState: location.state,
    postOwner,
    conversationId,
    currentConversation: currentConversation?._id,
    currentConversationParticipants: currentConversation?.participants,
    otherParticipant,
    receiverId,
    displayName,
    user: user?._id,
    isAuthenticated,
    authLoading,
    userData: user,
  });

  const {
    isConnected,
    sendMessage: sendSocketMessage,
    startTyping,
    stopTyping,
    isTyping: socketTyping,
    connectionError: socketError,
    connectionAttempts,
    markMessageAsRead,
    addReactionToMessage,
    userStatus,
  } = useChat(userId, receiverId, currentConversation?._id);

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

  // Fetch conversations when component mounts
  useEffect(() => {
    if (isAuthenticated && userId && conversations.length === 0) {
      dispatch(fetchConversations());
    }
  }, [dispatch, isAuthenticated, userId, conversations.length]);

  // Handle conversation and messages loading
  useEffect(() => {
    if (!isAuthenticated || authLoading || !userId) return;

    const loadConversation = async () => {
      try {
        if (conversationId) {
          // First, try to find the conversation in the existing conversations list
          const existingConversation = conversations.find(c => c._id === conversationId);
          
          if (existingConversation) {
            // Set the current conversation
            dispatch(setCurrentConversation(existingConversation));
          }
          
          // Then fetch messages
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
    conversations,
  ]);

  // Fetch user details if we don't have them
  useEffect(() => {
    if (receiverId && !postOwner?.username && !otherParticipant?.username) {
      dispatch(fetchUserById(receiverId));
    }
  }, [receiverId, postOwner, otherParticipant, dispatch]);

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
    if (socketError) {
      setConnectionError(socketError);
    } else if (!isConnected && userId && receiverId && !chatLoading) {
      // Only show error if we're not loading and should be connected
      if (connectionAttempts > 0) {
        setConnectionError(`Connecting... (Attempt ${connectionAttempts})`);
      } else {
        setConnectionError("Connecting to chat server...");
      }
    } else {
      setConnectionError(null);
    }
  }, [
    isConnected,
    userId,
    receiverId,
    socketError,
    connectionAttempts,
    chatLoading,
  ]);

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
      // Use WebSocket for real-time messaging if connected and no file attachment
      if (isConnected && !selectedFile) {
        const messageData = sendSocketMessage(newMessage.trim());
        if (messageData) {
          console.log("Message sent via WebSocket:", messageData);
          setNewMessage("");
          setConnectionError(null);
          
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            stopTyping();
            typingTimeoutRef.current = null;
          }
        }
      } else {
        // Use REST API for messages with file attachments or when WebSocket is not connected
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
          setConnectionError(null);

          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            stopTyping();
            typingTimeoutRef.current = null;
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send message. Please try again.";
      setConnectionError(errorMessage);

      // Auto-clear error after 5 seconds
      setTimeout(() => {
        setConnectionError(null);
      }, 5000);
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
          maxWidth: { xs: "85%", sm: "70%" },
          display: "flex",
          alignItems: "flex-start",
          gap: 0.5,
          mb: 0.5,
          width: "fit-content",
          minWidth: 0,
        }}
      >
        {/* Show avatar for received messages */}
        {!isSentByCurrentUser && (
          <Avatar
            src={otherParticipant?.profilePicture || postOwner?.profilePicture}
            sx={{ width: 32, height: 32, mt: 0.5 }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
        )}

        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: message.attachment ? 0.5 : 1.5,
              backgroundColor: isSentByCurrentUser ? "#1DBF73" : "white",
              color: isSentByCurrentUser ? "white" : "#050505",
              borderRadius: message.attachment ? 3 : "18px",
              position: "relative",
              opacity: message.deleted ? 0.6 : 1,
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
              wordWrap: "break-word",
              border: isSentByCurrentUser ? "none" : "1px solid #e4e6eb",
              maxWidth: "100%",
              width: "fit-content",
              minWidth: 0,
            }}
          >
            {message.sender === "system" ? (
              <Typography
                variant="body2"
                sx={{
                  fontStyle: "italic",
                  color: isSentByCurrentUser
                    ? "rgba(255,255,255,0.9)"
                    : "text.secondary",
                  px: 1,
                }}
              >
                {message.text}
              </Typography>
            ) : (
              <>
                {/* Message attachment */}
                {message.attachment && (
                  <Box sx={{ borderRadius: 2.5, overflow: "hidden" }}>
                    <MessageAttachment attachment={message.attachment} />
                  </Box>
                )}

                {/* Message text */}
                {message.text && (
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: message.deleted ? "italic" : "normal",
                      fontSize: "0.9375rem",
                      lineHeight: 1.4,
                      px: message.attachment ? 1.5 : 0,
                      py: message.attachment ? 1 : 0,
                    }}
                  >
                    {message.text}
                  </Typography>
                )}
              </>
            )}
          </Paper>

          {/* Message metadata below bubble */}
          {message.sender !== "system" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 1.5,
                justifyContent: isSentByCurrentUser ? "flex-end" : "flex-start",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#65676b",
                  fontSize: "0.75rem",
                }}
              >
                {message.timestamp
                  ? new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </Typography>

              {/* Edited indicator */}
              {message.edited && !message.deleted && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#65676b",
                    fontSize: "0.7rem",
                  }}
                >
                  • edited
                </Typography>
              )}

              {/* Message status indicator for sent messages */}
              {isSentByCurrentUser && (
                <MessageStatus
                  status={message.status || (message.read ? 'read' : 'delivered')}
                  timestamp={message.timestamp}
                  readAt={message.readAt}
                  readBy={message.readBy}
                  error={message.error}
                />
              )}

              {/* Message reactions */}
              {message.reactions && message.reactions.length > 0 && (
                <Box sx={{ px: 1.5, mt: 0.5 }}>
                  <MessageReactions
                    messageId={message._id}
                    reactions={message.reactions}
                    onAddReaction={addReactionToMessage}
                  />
                </Box>
              )}
            </Box>
          )}
        </Box>

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

  // Show "No chat selected" only if we don't have conversationId, receiverId, or postOwner
  if (!conversationId && !receiverId && !location.state?.postOwner) {
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
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 0,
          overflow: "hidden",
          backgroundColor: "white",
        }}
      >
        {/* User Management Header */}
        <UserManagement
          user={otherParticipant || postOwner}
          conversation={currentConversation}
          userStatus={userStatus}
          onBlockUser={(user) => {
            console.log("Block user:", user);
            // Implement block user functionality
          }}
          onReportUser={(user) => {
            console.log("Report user:", user);
            // Implement report user functionality
          }}
          onRemoveUser={(user) => {
            console.log("Remove user:", user);
            // Implement remove user functionality
          }}
        />

        {/* Messages Area */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            backgroundColor: "white",
            alignItems: "stretch",
          }}
        >
          {/* Connection Error Alert */}
          {!isConnected && connectionError && connectionAttempts > 5 && (
            <Alert
              severity="warning"
              sx={{ mb: 2 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              }
            >
              {connectionError}
            </Alert>
          )}

          {chatLoading && !messages.length ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                gap: 2,
              }}
            >
              <CircularProgress sx={{ color: "#1ac173" }} />
              <Typography variant="body2" color="text.secondary">
                Loading messages...
              </Typography>
            </Box>
          ) : error ? (
            <Alert
              severity="error"
              sx={{ m: 2 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          ) : (
            <>
              {messages.map(renderMessage)}
              {(isTyping || socketTyping) && (
                <Box
                  sx={{
                    alignSelf: "flex-start",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    ml: 1,
                  }}
                >
                  <Avatar
                    src={
                      otherParticipant?.profilePicture ||
                      postOwner?.profilePicture
                    }
                    sx={{ width: 32, height: 32 }}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Paper
                    elevation={0}
                    sx={{
                      px: 2,
                      py: 1.5,
                      backgroundColor: "white",
                      borderRadius: "18px",
                      border: "1px solid #e4e6eb",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <CircleIcon
                        sx={{
                          fontSize: 8,
                          color: "#90949c",
                          animation: "pulse 1.5s ease-in-out infinite",
                          "@keyframes pulse": {
                            "0%, 100%": { opacity: 0.4 },
                            "50%": { opacity: 1 },
                          },
                        }}
                      />
                      <CircleIcon
                        sx={{
                          fontSize: 8,
                          color: "#90949c",
                          animation: "pulse 1.5s ease-in-out 0.2s infinite",
                        }}
                      />
                      <CircleIcon
                        sx={{
                          fontSize: 8,
                          color: "#90949c",
                          animation: "pulse 1.5s ease-in-out 0.4s infinite",
                        }}
                      />
                    </Box>
                  </Paper>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </Box>

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

        {/* Input Area */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "white",
            borderTop: "1px solid #e4e6eb",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="flex-end">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />

            <IconButton
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending}
              sx={{
                color: "#1DBF73",
                "&:hover": {
                  backgroundColor: "rgba(29, 191, 115, 0.08)",
                },
                "&:disabled": {
                  color: "#bcc0c4",
                },
              }}
            >
              <AttachFileIcon />
            </IconButton>

            <TextField
              fullWidth
              multiline
              maxRows={4}
              variant="outlined"
              placeholder="Aa"
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
                  borderRadius: "20px",
                  backgroundColor: "#f0f2f5",
                  fontSize: "0.9375rem",
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1DBF73",
                    borderWidth: 1,
                  },
                  "& .MuiOutlinedInput-input": {
                    py: 1,
                  },
                },
              }}
            />

            <IconButton
              onClick={handleSendMessage}
              disabled={
                (!newMessage.trim() && !selectedFile) ||
                isSending
              }
              sx={{
                backgroundColor: "#1DBF73",
                color: "white",
                width: 36,
                height: 36,
                "&:hover": {
                  backgroundColor: "#18a364",
                },
                "&:disabled": {
                  backgroundColor: "#e4e6eb",
                  color: "#bcc0c4",
                },
              }}
            >
              {isSending ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                <SendIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatPage;
