import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import ConversationList from "../components/ConversationList";
import { fetchConversations } from "../features/chat/chatSlice";
import useAuth from "../hooks/useAuth";

const ConversationsPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { loading, error } = useSelector((state) => state.chat);

  useEffect(() => {
    if (user) {
      dispatch(fetchConversations());
    }
  }, [dispatch, user]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            mb: 3,
            color: "#333",
          }}
        >
          Conversations
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#1ac173" }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        ) : (
          <ConversationList />
        )}
      </Paper>
    </Container>
  );
};

export default ConversationsPage;
