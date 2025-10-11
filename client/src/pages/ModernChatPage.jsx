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
          from: "/chat",
          message: "Please log in to access chat",
        },
      });
    }
  }, [isAuthenticated, authLoading, navigate]);

  /**
   * Handle conversation selection
   */
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
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
        height: "100%",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Grid container sx={{ height: "100%" }}>
        {/* Conversation List - Left Side */}
        <Grid
          item
          xs={12}
          md={4}
          lg={3}
          sx={{
            height: "100%",
            borderRight: "1px solid #e0e0e0",
            display: { xs: conversationId ? "none" : "block", md: "block" },
          }}
        >
          <ConversationList onSelectConversation={handleSelectConversation} />
        </Grid>

        {/* Chat Window - Right Side */}
        <Grid
          item
          xs={12}
          md={8}
          lg={9}
          sx={{
            height: "100%",
            display: { xs: conversationId ? "block" : "none", md: "block" },
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
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  maxWidth: 400,
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="text.secondary"
                  gutterBottom
                >
                  Welcome to Messages
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Select a conversation from the list to start chatting
                </Typography>
                <Box
                  sx={{
                    mt: 4,
                    p: 3,
                    backgroundColor: "#f0f9f4",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    💡 <strong>Tip:</strong> Click on any conversation to view
                    and send messages
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ModernChatPage;
