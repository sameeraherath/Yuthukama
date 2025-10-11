import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ConversationList from "../components/chat/ConversationList";
import ChatPage from "./ChatPage";
import useAuth from "../hooks/useAuth";

/**
 * ModernChatPage - Modern messaging interface with conversation list and chat window
 * @component
 * @returns {JSX.Element} Split-screen chat interface
 */
const ModernChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedConversation, setSelectedConversation] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login", {
        state: {
          from: "/messages",
          message: "Please log in to access messages",
        },
      });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Handle URL changes - clear selected conversation when no conversationId
  useEffect(() => {
    if (!conversationId) {
      setSelectedConversation(null);
    }
  }, [conversationId]);

  /**
   * Handle conversation selection
   */
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    navigate(`/messages/${conversation._id}`);
  };

  // Show loading state
  if (authLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // Mobile view - show either list or chat
  if (isMobile) {
    return (
      <Box sx={{ height: "100vh", overflow: "hidden" }}>
        {conversationId ? (
          <ChatPage onBack={() => navigate("/messages")} />
        ) : (
          <ConversationList onSelectConversation={handleSelectConversation} />
        )}
      </Box>
    );
  }

  // Desktop view - split screen
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "white",
        display: "flex",
      }}
    >
      {/* Conversation List - Left Side */}
      <Box
        sx={{
          width: { xs: "100%", md: "350px", lg: "400px" },
          height: "100%",
          display: { xs: conversationId ? "none" : "flex", md: "flex" },
          flexDirection: "column",
        }}
      >
        <ConversationList onSelectConversation={handleSelectConversation} />
      </Box>

      {/* Chat Window - Right Side */}
      <Box
        sx={{
          flex: 1,
          height: "100%",
          display: { xs: conversationId ? "flex" : "none", md: "flex" },
          flexDirection: "column",
          backgroundColor: "white",
        }}
      >
        {conversationId ? (
          <ChatPage selectedConversation={selectedConversation} />
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
            }}
          >
            <Box
              sx={{
                textAlign: "center",
                maxWidth: 400,
                p: 4,
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  color: "#050505",
                  fontSize: "1.5rem",
                  mb: 2,
                }}
              >
                Welcome to Messages
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#65676b",
                  fontSize: "0.9375rem",
                  mb: 4,
                }}
              >
                Select a conversation from the list to start chatting
              </Typography>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: "#f0f2f5",
                  borderRadius: 2,
                  border: "1px solid #e4e6eb",
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{
                    color: "#65676b",
                    fontSize: "0.8125rem",
                  }}
                >
                  💡 <strong>Tip:</strong> Click on any conversation to view
                  and send messages
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ModernChatPage;
