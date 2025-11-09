import { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Avatar,
  Typography,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Close as CloseIcon,
  Message as MessageIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import axios from "../../utils/axiosConfig";
import useAuth from "../../hooks/useAuth";

/**
 * UserSearch component - Search and select users for messaging
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onUserSelect - Callback when user is selected
 * @param {Function} props.onClose - Callback to close the search
 * @param {boolean} props.open - Whether the search dialog is open
 * @returns {JSX.Element} User search interface
 */
const UserSearch = ({ onUserSelect, onClose, open }) => {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentUsers, setRecentUsers] = useState([]);
  const searchTimeoutRef = useRef(null);

  // Load recent users when dialog opens
  useEffect(() => {
    if (open) {
      loadRecentUsers();
    }
  }, [open]);

  // Search users with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        searchUsers(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  /**
   * Search for users by username or email
   */
  const searchUsers = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get("/api/users/search", {
        params: { query, limit: 20 },
      });
      setSearchResults(response.data.users || []);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load recent users (users with recent conversations)
   */
  const loadRecentUsers = async () => {
    try {
      const response = await axios.get("/api/chat/conversations");
      const conversations = response.data || [];
      
      // Extract unique users from recent conversations
      const recentUserIds = new Set();
      const recentUsersList = [];
      
      conversations.forEach(conversation => {
        conversation.participants?.forEach(participant => {
          if (participant._id !== currentUser?._id && !recentUserIds.has(participant._id)) {
            recentUserIds.add(participant._id);
            recentUsersList.push(participant);
          }
        });
      });
      
      setRecentUsers(recentUsersList.slice(0, 5));
    } catch (error) {
      console.error("Error loading recent users:", error);
    }
  };


  /**
   * Handle user selection
   */
  const handleUserSelect = (selectedUser) => {
    onUserSelect(selectedUser);
    onClose();
  };

  /**
   * Get display name for user
   */
  const getUserDisplayName = (user) => {
    return user.username || user.email || "Unknown User";
  };

  /**
   * Get user initials for avatar
   */
  const getUserInitials = (user) => {
    const name = getUserDisplayName(user);
    return name.charAt(0).toUpperCase();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={600}>
            Start New Conversation
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Search Input */}
        <Box sx={{ p: 2, pb: 1 }}>
          <TextField
            fullWidth
            placeholder="Search users by username or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#65676b" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#f0f2f5",
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

        <Divider />

        {/* Content */}
        <Box sx={{ maxHeight: "50vh", overflowY: "auto" }}>
          {/* Search Results */}
          {searchQuery.trim().length >= 2 && (
            <Box>
              <Box sx={{ p: 2, pb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                  Search Results
                </Typography>
              </Box>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : searchResults.length > 0 ? (
                <List sx={{ py: 0 }}>
                  {searchResults
                    .filter(user => user._id !== currentUser?._id)
                    .map((user) => (
                      <ListItem key={user._id} disablePadding>
                        <ListItemButton
                          onClick={() => handleUserSelect(user)}
                          sx={{
                            borderRadius: 1,
                            mx: 1,
                            mb: 0.5,
                            "&:hover": {
                              backgroundColor: "#f0fdf4",
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              src={user.profilePicture}
                              sx={{
                                width: 40,
                                height: 40,
                                backgroundColor: "#1DBF73",
                              }}
                            >
                              {getUserInitials(user)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={getUserDisplayName(user)}
                            secondary={user.email}
                            primaryTypographyProps={{
                              fontWeight: 500,
                              fontSize: "0.9rem",
                            }}
                            secondaryTypographyProps={{
                              fontSize: "0.8rem",
                              color: "#65676b",
                            }}
                          />
                          <MessageIcon sx={{ color: "#1DBF73", fontSize: 20 }} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                </List>
              ) : (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    No users found
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Recent Users */}
          {searchQuery.trim().length < 2 && recentUsers.length > 0 && (
            <Box>
              <Box sx={{ p: 2, pb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                  Recent Conversations
                </Typography>
              </Box>
              <List sx={{ py: 0 }}>
                {recentUsers.map((user) => (
                  <ListItem key={user._id} disablePadding>
                    <ListItemButton
                      onClick={() => handleUserSelect(user)}
                      sx={{
                        borderRadius: 1,
                        mx: 1,
                        mb: 0.5,
                        "&:hover": {
                          backgroundColor: "#f0fdf4",
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={user.profilePicture}
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: "#1DBF73",
                          }}
                        >
                          {getUserInitials(user)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={getUserDisplayName(user)}
                        secondary="Recent conversation"
                        primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: "0.9rem",
                        }}
                        secondaryTypographyProps={{
                          fontSize: "0.8rem",
                          color: "#65676b",
                        }}
                      />
                      <MessageIcon sx={{ color: "#1DBF73", fontSize: 20 }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}


          {/* Empty State */}
          {searchQuery.trim().length < 2 && recentUsers.length === 0 && (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <PersonIcon sx={{ fontSize: 48, color: "#e0e0e0", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No users available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start typing to search for users to message
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UserSearch;
