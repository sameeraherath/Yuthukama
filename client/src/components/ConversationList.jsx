import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchConversations } from "../features/chat/chatSlice";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import useAuth from "../hooks/useAuth";

const ConversationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { conversations, loading, error } = useSelector((state) => state.chat);

  useEffect(() => {
    if (user) {
      dispatch(fetchConversations());
    }
  }, [dispatch, user]);

  const handleConversationClick = (conversation) => {
    const otherUser = conversation.participants.find(
      (participant) => participant._id !== user._id
    );

    navigate("/chat", {
      state: {
        postOwner: otherUser,
      },
    });
  };

  if (loading && !conversations.length) {
    return (
      <Box display="flex" justifyContent="center" my={3}>
        <CircularProgress sx={{ color: "#1ac173" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" my={2}>
        {error}
      </Typography>
    );
  }

  if (!conversations.length) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" my={2}>
        No conversations yet. Start chatting with someone!
      </Typography>
    );
  }

  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden", mt: 2 }}>
      <Typography
        variant="h6"
        sx={{ p: 2, bgcolor: "#1ac173", color: "white" }}
      >
        Your Conversations
      </Typography>
      <List sx={{ width: "100%" }}>
        {conversations.map((conversation, index) => {
          const otherUser = conversation.participants.find(
            (participant) => participant._id !== user._id
          );

          const lastMessageTime = conversation.lastMessageTimestamp
            ? new Date(conversation.lastMessageTimestamp).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )
            : "";

          return (
            <Box key={conversation._id}>
              <ListItem
                alignItems="flex-start"
                button
                onClick={() => handleConversationClick(conversation)}
                sx={{
                  "&:hover": {
                    bgcolor: "rgba(26, 193, 115, 0.08)",
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar>{otherUser?.username?.charAt(0) || "?"}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={otherUser?.username || "Unknown User"}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{
                          display: "inline",
                          maxWidth: "70%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {conversation.lastMessage || "Start a conversation"}
                      </Typography>
                      {" — "}
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                      >
                        {lastMessageTime}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < conversations.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </Box>
          );
        })}
      </List>
    </Paper>
  );
};

export default ConversationList;
