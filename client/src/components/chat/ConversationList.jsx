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
  Fab,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CircleIcon from "@mui/icons-material/Circle";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from "../../features/chat/chatSlice";
import useAuth from "../../hooks/useAuth";
import UserSearch from "./UserSearch";
import ChatAPI from "../../features/chat/chatAPI";

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
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

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
  };

  /**
   * Handle user selection from search
   */
  const handleUserSelect = async (selectedUser) => {
    setIsCreatingConversation(true);
    try {
      // Get or create conversation with selected user
      const conversation = await ChatAPI.getOrCreateConversation(selectedUser._id);
      
      // Refresh conversations list
      dispatch(fetchConversations());
      
      // Select the new conversation
      if (onSelectConversation) {
        onSelectConversation(conversation);
      }
      
      // Navigate to the conversation
      navigate(`/messages/${conversation._id}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setIsCreatingConversation(false);
    }
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
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        borderRight: "1px solid #e4e6eb",
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: 2, 
          backgroundColor: "white",
          borderBottom: "1px solid #e4e6eb",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            sx={{ 
              fontSize: "1.5rem",
              color: "#050505",
            }}
          >
            Messages
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton 
              size="small" 
              sx={{ color: "#65676b" }}
              onClick={() => setShowUserSearch(true)}
            >
              <SearchIcon />
            </IconButton>
            <IconButton 
              size="small" 
              sx={{ 
                color: "#1DBF73",
                backgroundColor: "#f0fdf4",
                "&:hover": {
                  backgroundColor: "#e8f5e9",
                },
              }}
              onClick={() => setShowUserSearch(true)}
              disabled={isCreatingConversation}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
        
        {/* Search Input */}
        <TextField
          fullWidth
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#65676b", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#f0f2f5",
              fontSize: "0.875rem",
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: "#e4e6eb",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1DBF73",
              },
            },
          }}
        />
      </Box>

      {/* Conversation List */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
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
              <Box
                key={conversation._id}
                onClick={() => handleSelectConversation(conversation)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  cursor: "pointer",
                  backgroundColor: isSelected ? "#e8f5e9" : "transparent",
                  borderLeft: isSelected ? "3px solid #1DBF73" : "3px solid transparent",
                  "&:hover": {
                    backgroundColor: isSelected ? "#e8f5e9" : "#f5f5f5",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {/* Avatar */}
                <Avatar
                  src={otherUser.profilePicture}
                  alt={otherUser.username}
                  sx={{ 
                    width: 48, 
                    height: 48,
                    mr: 2,
                    backgroundColor: "#e0e0e0",
                  }}
                >
                  {otherUser.username?.charAt(0).toUpperCase()}
                </Avatar>

                {/* Conversation Details */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {/* Name and Time */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                    <Typography
                      variant="body1"
                      fontWeight={unreadCount > 0 ? 600 : 500}
                      sx={{
                        fontSize: "0.9375rem",
                        color: "#050505",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {otherUser.username}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.75rem",
                        color: "#65676b",
                        fontWeight: 400,
                      }}
                    >
                      {formatTime(conversation.lastMessageTimestamp)}
                    </Typography>
                  </Box>

                  {/* Message Preview and Read Receipt */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.8125rem",
                        color: "#65676b",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                        mr: 1,
                      }}
                    >
                      {conversation.lastMessage || "No messages yet"}
                    </Typography>
                    
                    {/* Read Receipt */}
                    <DoneAllIcon
                      sx={{
                        fontSize: 16,
                        color: "#1DBF73",
                        opacity: 0.7,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Box>

      {/* User Search Dialog */}
      <UserSearch
        open={showUserSearch}
        onClose={() => setShowUserSearch(false)}
        onUserSelect={handleUserSelect}
      />
    </Box>
  );
};

export default ConversationList;
