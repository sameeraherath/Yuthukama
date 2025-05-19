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

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [isSending, setIsSending] = useState(false);

  const postOwner = location.state?.postOwner;
  const receiverId = postOwner?._id;
  const displayName = postOwner?.username || "Unknown Author";

  const {
    messages,
    currentConversation,
    isTyping,
    error,
    loading: chatLoading,
  } = useSelector((state) => state.chat);

  const [newMessage, setNewMessage] = useState("");

  const { isConnected, sendMessage, startTyping, stopTyping } = useChat(
    user?._id,
    receiverId,
    currentConversation?._id
  );

  useEffect(() => {
    if (conversationId) {
      dispatch(fetchMessages(conversationId))
        .unwrap()
        .catch((err) => {
          console.error("Failed to load messages:", err);
        });
    } else if (user && receiverId) {
      dispatch(getOrCreateConversation(receiverId))
        .unwrap()
        .then((conversation) => {
          if (conversation._id) {
            dispatch(fetchMessages(conversation._id));
          }
        })
        .catch((err) => {
          console.error("Failed to load conversation:", err);
        });
    }

    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch, user, receiverId, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleSendMessage = () => {
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
        console.log(
          "Message sent successfully, adding to local state:",
          messageData
        );
        dispatch(addMessage(messageData));
        setNewMessage("");

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          stopTyping();
          typingTimeoutRef.current = null;
        }
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = useCallback(
    (e) => {
      setNewMessage(e.target.value);

      if (e.target.value.trim() && isConnected) {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        } else {
          startTyping();
        }

        typingTimeoutRef.current = setTimeout(() => {
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

  const renderMessage = (message, index) => (
    <Box
      key={index}
      sx={{
        alignSelf: message.sender === user?._id ? "flex-end" : "flex-start",
        maxWidth: "70%",
      }}
    >
      <Paper
        sx={{
          p: 1.5,
          backgroundColor: message.sender === user?._id ? "#e3f2fd" : "#f5f5f5",
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
            {" "}
            <Typography variant="body1">{message.text}</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );

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
