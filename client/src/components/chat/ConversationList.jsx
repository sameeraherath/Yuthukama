import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  TextField,
  InputAdornment,
  Badge,
  Divider,
  Paper,
  IconButton,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CircleIcon from "@mui/icons-material/Circle";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from "../../features/chat/chatSlice";
import useAuth from "../../hooks/useAuth";

/**
 * ConversationList component - displays list of conversations
 * @component
 */
const ConversationList = ({ onSelectConversation }) => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { conversations, loading } = useSelector((state) => state.chat);

  useEffect(() => {
    if (user) {
      dispatch(fetchConversations());
    }
  }, [dispatch, user]);

  /**
   * Get the other participant in a conversation
   */
  const getOtherParticipant = (conversation) => {
    if (!conversation?.participants) return null;
    return conversation.participants.find((p) => p._id !== user?._id);
  };

  /**
   * Format timestamp to relative time
   */
  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes < 1 ? "Just now" : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  /**
   * Handle conversation selection
   */
  const handleSelectConversation = (conversation) => {
    if (onSelectConversation) {
      onSelectConversation(conversation);
    }
    navigate(`/messages/${conversation._id}`);
  };

  /**
   * Deduplicate conversations - keep only the most recent one per user
   */
  const deduplicatedConversations = conversations.reduce(
    (acc, conversation) => {
      const otherUser = getOtherParticipant(conversation);
      if (!otherUser) return acc;

      // Check if we already have a conversation with this user
      const existingIndex = acc.findIndex((conv) => {
        const existingOtherUser = getOtherParticipant(conv);
        return existingOtherUser?._id === otherUser._id;
      });

      if (existingIndex === -1) {
        // No existing conversation with this user
        acc.push(conversation);
      } else {
        // Keep the conversation with the most recent message
        const existingConv = acc[existingIndex];
        const existingTime = new Date(existingConv.lastMessageTimestamp || 0);
        const currentTime = new Date(conversation.lastMessageTimestamp || 0);

        if (currentTime > existingTime) {
          acc[existingIndex] = conversation;
        }
      }

      return acc;
    },
    []
  );

  /**
   * Filter conversations based on search query and sort by most recent
   */
  const filteredConversations = deduplicatedConversations
    .filter((conversation) => {
      const otherUser = getOtherParticipant(conversation);
      if (!otherUser) return false;

      const searchLower = searchQuery.toLowerCase();
      return (
        otherUser.username?.toLowerCase().includes(searchLower) ||
        conversation.lastMessage?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      // Sort by most recent message first
      const timeA = new Date(a.lastMessageTimestamp || 0);
      const timeB = new Date(b.lastMessageTimestamp || 0);
      return timeB - timeA;
    });

  /**
   * Count unread messages
   */
  const getUnreadCount = (conversation) => {
    // You can implement unread count logic here
    return conversation.unreadCount || 0;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #e0e0e0",
        backgroundColor: "#fafafa",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, backgroundColor: "white" }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Messages
        </Typography>

        {/* Search Bar */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "#f5f5f5",
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: "transparent",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1ac173",
                borderWidth: 1,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Divider />

      {/* Conversation List */}
      <List
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 0,
          backgroundColor: "white",
        }}
      >
        {loading ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Loading conversations...
            </Typography>
          </Box>
        ) : filteredConversations.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? "No conversations found" : "No messages yet"}
            </Typography>
          </Box>
        ) : (
          filteredConversations.map((conversation) => {
            const otherUser = getOtherParticipant(conversation);
            if (!otherUser) return null;

            const isSelected = conversation._id === conversationId;
            const unreadCount = getUnreadCount(conversation);

            return (
              <ListItem
                key={conversation._id}
                disablePadding
                sx={{
                  backgroundColor: isSelected ? "#f0f9f4" : "transparent",
                  borderLeft: isSelected
                    ? "4px solid #1ac173"
                    : "4px solid transparent",
                  "&:hover": {
                    backgroundColor: isSelected ? "#f0f9f4" : "#f5f5f5",
                  },
                }}
              >
                <ListItemButton
                  onClick={() => handleSelectConversation(conversation)}
                  sx={{ py: 1.5, px: 2 }}
                >
                  {/* Avatar with online status */}
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      badgeContent={
                        otherUser.isOnline ? (
                          <CircleIcon
                            sx={{
                              width: 12,
                              height: 12,
                              color: "#1ac173",
                              backgroundColor: "white",
                              borderRadius: "50%",
                            }}
                          />
                        ) : null
                      }
                    >
                      <Avatar
                        src={otherUser.profilePicture}
                        alt={otherUser.username}
                        sx={{ width: 48, height: 48 }}
                      >
                        {otherUser.username?.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>

                  {/* Conversation details */}
                  <ListItemText
                    sx={{ ml: 1 }}
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="body1"
                          fontWeight={unreadCount > 0 ? 600 : 400}
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {otherUser.username}
                        </Typography>
                        <Typography
                          variant="caption"
                          color={unreadCount > 0 ? "#1ac173" : "text.secondary"}
                          fontWeight={unreadCount > 0 ? 600 : 400}
                        >
                          {formatTime(conversation.lastMessageTimestamp)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={unreadCount > 0 ? 500 : 400}
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth:
                              unreadCount > 0 ? "calc(100% - 30px)" : "100%",
                          }}
                        >
                          {conversation.lastMessage || "No messages yet"}
                        </Typography>
                        {unreadCount > 0 && (
                          <Chip
                            label={unreadCount}
                            size="small"
                            sx={{
                              height: 20,
                              minWidth: 20,
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              backgroundColor: "#1ac173",
                              color: "white",
                              "& .MuiChip-label": {
                                px: 0.75,
                              },
                            }}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })
        )}
      </List>
    </Paper>
  );
};

export default ConversationList;
