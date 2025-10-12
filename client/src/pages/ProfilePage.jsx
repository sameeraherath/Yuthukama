import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PostCard from "../components/PostCard";
import { fetchUserPosts } from "../features/posts/postsSlice";
import {
  updateProfilePicture,
  updateUsername,
  clearMessage,
  fetchUserById,
  followUser,
  unfollowUser,
  checkFollowStatus,
  fetchFollowers,
  fetchFollowing,
} from "../features/auth/userSlice";
import { deletePost } from "../features/posts/postsAPI";

import {
  Avatar,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  CircularProgress,
  Grid,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Zoom,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EnhancedSkeleton from "../components/LoadingStates/EnhancedSkeleton";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import SettingsIcon from "@mui/icons-material/Settings";
import ExploreIcon from "@mui/icons-material/Explore";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";

/**
 * Profile page component that displays user information and posts
 * @component
 * @returns {JSX.Element} Profile page with user details and posts grid
 * @example
 * // In App.jsx
 * <Route path="/profile" element={<ProfilePage />} />
 */
const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userId } = useParams();
  const [file, setFile] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
  const [followingDialogOpen, setFollowingDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  /**
   * Effect hook to log user state changes
   * @effect
   * @listens {user} - Current user data
   */
  useEffect(() => {
    console.log("Current user state:", user);
    console.log("Profile picture URL:", user?.profilePicture);
  }, [user]);

  const {
    loading: postsLoading,
    userPosts,
    error: postsError,
  } = useSelector((state) => state.posts);
  const {
    loading: userLoading,
    error: userError,
    message,
    profileUser,
    followers,
    following,
    followStatus,
  } = useSelector((state) => state.user);

  console.log("ProfilePage userPosts:", userPosts);

  // Determine which user we're viewing
  const isViewingOwnProfile = !userId || userId === user?.id;
  const targetUserId = userId || user?.id;
  const displayUser = isViewingOwnProfile ? user : profileUser;

  /**
   * Effect hook to fetch user data and posts when user ID changes
   * @effect
   * @listens {userId} - URL parameter user ID
   * @listens {user?.id} - Current user ID
   * @listens {dispatch} - Redux dispatch function
   */
  useEffect(() => {
    if (targetUserId) {
      // Fetch posts for the target user
      dispatch(fetchUserPosts(targetUserId));
      
      // If viewing another user's profile, fetch their data
      if (!isViewingOwnProfile) {
        dispatch(fetchUserById(userId));
        // Check follow status
        dispatch(checkFollowStatus(userId));
        // Fetch followers and following counts
        dispatch(fetchFollowers(userId));
        dispatch(fetchFollowing(userId));
      }
    }
  }, [dispatch, targetUserId, userId, isViewingOwnProfile]);

  /**
   * Handle scroll event for scroll-to-top button
   */
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Scroll to top smoothly
   */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Navigation items for sidebar
   */
  const navigationItems = [
    { icon: <HomeIcon />, label: "Home", path: "/home", active: false },
    { icon: <ExploreIcon />, label: "Explore", path: "/explore" },
    { icon: <NotificationsIcon />, label: "Notifications", component: "notification" },
    { icon: <ChatIcon />, label: "Messages", path: "/messages" },
    { icon: <BookmarkIcon />, label: "Saved", path: "/saved" },
    { icon: <PersonIcon />, label: "Profile", path: "/profile", active: true },
    { icon: <SettingsIcon />, label: "Settings", path: "/settings" },
  ];

  /**
   * Effect hook to clear messages after timeout
   * @effect
   * @listens {message} - Success message
   * @listens {userError} - Error message
   * @listens {dispatch} - Redux dispatch function
   */
  useEffect(() => {
    if (message || userError) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, userError, dispatch]);

  /**
   * Handles file selection for profile picture
   * @function
   * @param {Event} e - File input change event
   */
  const handleFileChange = (e) => {
    console.log("Selected file:", e.target.files[0]);
    setFile(e.target.files[0]);
  };

  /**
   * Handles profile picture upload
   * @async
   * @function
   */
  const handleUpload = async () => {
    if (!file) return;
    console.log("Uploading file:", file);
    const formData = new FormData();
    formData.append("profilePic", file);
    try {
      const result = await dispatch(updateProfilePicture(formData));
      console.log("Profile picture update result:", result);
      setFile(null);
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  /**
   * Handles username update
   * @async
   * @function
   */
  const handleUsernameChange = async () => {
    if (!newUsername) return;
    await dispatch(updateUsername(newUsername));
    setNewUsername("");
    setEditingUsername(false);
  };

  /**
   * Initiates username editing mode
   * @function
   */
  const handleEditUsername = () => {
    setEditingUsername(true);
    setNewUsername(user?.username || "");
  };

  /**
   * Cancels username editing
   * @function
   */
  const handleCancelEdit = () => {
    setEditingUsername(false);
    setNewUsername("");
  };

  /**
   * Handles post deletion
   * @async
   * @function
   */
  const handleDeletePost = async () => {
    if (postToDelete) {
      await dispatch(deletePost(postToDelete));
      dispatch(fetchUserPosts(targetUserId));
    }
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  /**
   * Handles following a user
   * @async
   * @function
   */
  const handleFollow = async () => {
    if (userId) {
      await dispatch(followUser(userId));
      // Refresh followers/following data
      dispatch(fetchFollowers(userId));
      dispatch(fetchFollowing(userId));
    }
  };

  /**
   * Handles unfollowing a user
   * @async
   * @function
   */
  const handleUnfollow = async () => {
    if (userId) {
      await dispatch(unfollowUser(userId));
      // Refresh followers/following data
      dispatch(fetchFollowers(userId));
      dispatch(fetchFollowing(userId));
    }
  };

  /**
   * Handles opening followers dialog
   * @function
   */
  const handleOpenFollowers = () => {
    setFollowersDialogOpen(true);
    setActiveTab(0);
  };

  /**
   * Handles opening following dialog
   * @function
   */
  const handleOpenFollowing = () => {
    setFollowingDialogOpen(true);
    setActiveTab(1);
  };

  if (postsLoading || userLoading) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            mt: 4,
          }}
          role="status"
          aria-live="polite"
          aria-label="Loading profile"
        >
          <EnhancedSkeleton variant="profile" count={1} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(2, 1fr)",
              },
              gap: 3,
            }}
          >
            <EnhancedSkeleton variant="post" count={4} />
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        position: "relative",
      }}
    >
      {/* Left Sidebar Navigation - Desktop */}
      <Paper
        elevation={0}
        sx={{
          width: { xs: 0, md: 280 },
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "white",
          borderRight: "1px solid #e5e7eb",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          position: "fixed",
          left: 0,
          top: 64, // Account for navbar height
          zIndex: 100,
          overflowY: "auto",
          borderRadius: 0,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#e5e7eb",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#d1d5db",
          },
        }}
      >
        {/* User Profile Section */}
        <Box sx={{ 
          p: { md: 2.5, lg: 3 }, 
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "#fafafa",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={user?.profilePicture}
              alt={user?.username}
              sx={{
                width: 48,
                height: 48,
                border: "2px solid #1DBF73",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 12px rgba(29, 191, 115, 0.3)",
                },
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="subtitle1" 
                fontWeight={600}
                sx={{
                  fontSize: "0.95rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.username}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Navigation Menu */}
        <Box sx={{ flex: 1, p: { md: 1.5, lg: 2 } }}>
          <List sx={{ px: 1 }}>
            {navigationItems.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                    if (item.component === "notification") {
                      // Handle notification click - could open notification panel
                      return;
                    }
                    navigate(item.path);
                  }}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: item.active ? "#f0fdf4" : "transparent",
                    color: item.active ? "#1DBF73" : "#374151",
                    py: 1.5,
                    px: 2,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#f0fdf4",
                      color: "#1DBF73",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: item.active ? "#1DBF73" : "#6b7280",
                      minWidth: 40,
                      transition: "color 0.2s ease-in-out",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.component === "notification" ? (
                      <NotificationsIcon />
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: item.active ? 600 : 500,
                      fontSize: "0.9rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
            
            {/* AI Chatbot Button */}
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => setShowAIChat(true)}
                sx={{
                  borderRadius: 2,
                  color: "#374151",
                  py: 1.5,
                  px: 2,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#f0fdf4",
                    color: "#1DBF73",
                    transform: "translateX(4px)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "#6b7280",
                    minWidth: 40,
                    transition: "color 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SmartToyIcon />
                </ListItemIcon>
                <ListItemText
                  primary="AI Assistant"
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: "0.9rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        {/* Create Post Button */}
        <Box sx={{ 
          p: { md: 1.5, lg: 2 }, 
          borderTop: "1px solid #e5e7eb",
          backgroundColor: "#fafafa",
        }}>
          <Fab
            size="medium"
            onClick={() => navigate("/create-post")}
            sx={{
              width: "100%",
              height: 48,
              borderRadius: 2,
              background: "linear-gradient(135deg, #1DBF73 0%, #169c5f 100%)",
              boxShadow: "none",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                background: "linear-gradient(135deg, #169c5f 0%, #117a47 100%)",
                boxShadow: "0 4px 12px rgba(29, 191, 115, 0.3)",
                transform: "translateY(-2px)",
              },
              "&:active": {
                transform: "translateY(0px)",
              },
            }}
          >
            <AddIcon sx={{ color: "white", fontSize: "1.2rem" }} />
          </Fab>
        </Box>
      </Paper>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: 280, sm: 320 },
            backgroundColor: "white",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <Box sx={{ 
          height: "100%", 
          display: "flex", 
          flexDirection: "column",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#e5e7eb",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#d1d5db",
          },
        }}>
          {/* Header */}
          <Box sx={{ 
            p: 2, 
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#fafafa",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                color="#1DBF73"
                sx={{ fontSize: "1.25rem" }}
              >
                Yuthukama
              </Typography>
              <IconButton 
                onClick={() => setMobileDrawerOpen(false)}
                sx={{
                  color: "#6b7280",
                  "&:hover": {
                    backgroundColor: "#f0fdf4",
                    color: "#1DBF73",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          
          {/* User Profile */}
          <Box sx={{ 
            p: 2, 
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                src={user?.profilePicture}
                alt={user?.username}
                sx={{ 
                  width: 48, 
                  height: 48, 
                  border: "2px solid #1DBF73",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 4px 12px rgba(29, 191, 115, 0.3)",
                  },
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="subtitle1" 
                  fontWeight={600}
                  sx={{
                    fontSize: "0.95rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.username}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Navigation */}
          <Box sx={{ flex: 1, p: 1 }}>
            <List sx={{ px: 1 }}>
              {navigationItems.map((item, index) => (
                <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => {
                      if (item.component === "notification") {
                        // Handle notification click
                        return;
                      }
                      navigate(item.path);
                      setMobileDrawerOpen(false);
                    }}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: item.active ? "#f0fdf4" : "transparent",
                      color: item.active ? "#1DBF73" : "#374151",
                      py: 1.5,
                      px: 2,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#f0fdf4",
                        color: "#1DBF73",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: item.active ? "#1DBF73" : "#6b7280", 
                      minWidth: 40,
                      transition: "color 0.2s ease-in-out",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {item.component === "notification" ? (
                        <NotificationsIcon />
                      ) : (
                        item.icon
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: item.active ? 600 : 500,
                        fontSize: "0.9rem",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              
              {/* AI Chatbot Button */}
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                    setShowAIChat(true);
                    setMobileDrawerOpen(false);
                  }}
                  sx={{
                    borderRadius: 2,
                    color: "#374151",
                    py: 1.5,
                    px: 2,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#f0fdf4",
                      color: "#1DBF73",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: "#6b7280", 
                    minWidth: 40,
                    transition: "color 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <SmartToyIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="AI Assistant"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "0.9rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>

          {/* Create Post Button */}
          <Box sx={{ 
            p: 2, 
            borderTop: "1px solid #e5e7eb",
            backgroundColor: "#fafafa",
          }}>
            <Fab
              size="medium"
              onClick={() => {
                navigate("/create-post");
                setMobileDrawerOpen(false);
              }}
              sx={{
                width: "100%",
                height: 48,
                borderRadius: 2,
                background: "linear-gradient(135deg, #1DBF73 0%, #169c5f 100%)",
                boxShadow: "none",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  background: "linear-gradient(135deg, #169c5f 0%, #117a47 100%)",
                  boxShadow: "0 4px 12px rgba(29, 191, 115, 0.3)",
                  transform: "translateY(-2px)",
                },
                "&:active": {
                  transform: "translateY(0px)",
                },
              }}
            >
              <AddIcon sx={{ color: "white", fontSize: "1.2rem" }} />
            </Fab>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          marginLeft: { xs: 0, md: "280px" },
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 64px)",
        }}
      >

        {/* Profile Content */}
        <Box sx={{ 
          flex: 1, 
          display: "flex", 
          justifyContent: "center", 
          p: { xs: 1, sm: 2, md: 3 },
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#e5e7eb",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#d1d5db",
          },
        }}>
          <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        sx={{ p: 4, mb: 4, borderRadius: 4, textAlign: "center", boxShadow: 1 }}
      >
        <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
          <Avatar
            src={displayUser?.profilePicture || "/uploads/profile-pics/default.jpg"}
            sx={{
              width: 154,
              height: 154,
              border: "4px solid #1dbf73",
              boxShadow: 1,
            }}
          />
          {isViewingOwnProfile && (
            <label htmlFor="profile-pic-upload">
              <input
                accept="image/jpeg,image/png"
                style={{ display: "none" }}
                id="profile-pic-upload"
                type="file"
                onChange={handleFileChange}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  bgcolor: "rgba(0,0,0,0.7)",
                  borderRadius: "50%",
                  p: 1.2,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.2s",
                  "&:hover": { bgcolor: "#1dbf73" },
                }}
              >
                <CameraAltIcon sx={{ color: "#fff" }} />
              </Box>
            </label>
          )}
        </Box>
        {file && isViewingOwnProfile && (
          <Button
            variant="contained"
            color="success"
            onClick={handleUpload}
            sx={{
              mb: 2,
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: 5,
              px: 4,
              backgroundColor: "#1dbf73",
              boxShadow: 1,
            }}
          >
            Update Profile Picture
          </Button>
        )}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mt: 2,
            justifyContent: "center",
          }}
        >
          {editingUsername && isViewingOwnProfile ? (
            <>
              <TextField
                label="New Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  minWidth: 180,
                  "& .MuiOutlinedInput-root": { borderRadius: "25px" },
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderColor: "#1DBF73",
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#1DBF73" },
                }}
                autoFocus
              />
              <Button
                variant="contained"
                color="success"
                sx={{
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: 5,
                  px: 3,
                  backgroundColor: "#1dbf73",
                }}
                onClick={handleUsernameChange}
                disabled={!newUsername}
              >
                Update
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                sx={{ textTransform: "none", borderRadius: 5, px: 3 }}
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ mb: 0, fontWeight: 600 }}
              >
                {displayUser?.username || displayUser?.name || "Unknown User"}
              </Typography>
              {isViewingOwnProfile && (
                <IconButton
                  aria-label="Edit Username"
                  onClick={handleEditUsername}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </>
          )}
        </Box>
        {(message || userError) && (
          <Alert
            severity={userError ? "error" : "success"}
            sx={{ mt: 2, width: "100%", borderRadius: 2, fontWeight: 500 }}
          >
            {userError || message}
          </Alert>
        )}
        <Typography variant="body1" sx={{ mt: 3, color: "#555" }}>
          Email: <b>{displayUser?.email}</b>
        </Typography>
        
        {/* Follow/Unfollow Button and Stats */}
        {!isViewingOwnProfile && (
          <Box sx={{ mt: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Button
              variant={followStatus[userId] ? "outlined" : "contained"}
              color="success"
              onClick={followStatus[userId] ? handleUnfollow : handleFollow}
              disabled={userLoading}
              startIcon={followStatus[userId] ? <PersonRemoveIcon /> : <PersonAddIcon />}
              sx={{
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 5,
                px: 4,
                py: 1,
                backgroundColor: followStatus[userId] ? "transparent" : "#1dbf73",
                borderColor: "#1dbf73",
                color: followStatus[userId] ? "#1dbf73" : "white",
                "&:hover": {
                  backgroundColor: followStatus[userId] ? "#f0fdf4" : "#169c5f",
                  borderColor: "#1dbf73",
                },
              }}
            >
              {followStatus[userId] ? "Unfollow" : "Follow"}
            </Button>
            
            {/* Followers and Following Stats */}
            <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
              <Chip
                icon={<PeopleIcon />}
                label={`${followers?.length || 0} Followers`}
                onClick={handleOpenFollowers}
                sx={{
                  cursor: "pointer",
                  backgroundColor: "#f0fdf4",
                  color: "#1dbf73",
                  border: "1px solid #1dbf73",
                  "&:hover": {
                    backgroundColor: "#e0f2e9",
                  },
                }}
              />
              <Chip
                icon={<PeopleIcon />}
                label={`${following?.length || 0} Following`}
                onClick={handleOpenFollowing}
                sx={{
                  cursor: "pointer",
                  backgroundColor: "#f0fdf4",
                  color: "#1dbf73",
                  border: "1px solid #1dbf73",
                  "&:hover": {
                    backgroundColor: "#e0f2e9",
                  },
                }}
              />
            </Box>
          </Box>
        )}
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          {isViewingOwnProfile ? "Your Posts" : `${displayUser?.username || displayUser?.name || "User"}'s Posts`}
        </Typography>
        {postsError && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {postsError}
          </Alert>
        )}
        {userPosts?.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {userPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                showOfferButton={false}
                showDeleteButton={isViewingOwnProfile}
                onDelete={() => {
                  if (
                    (post.user && post.user._id === user._id) ||
                    post.user === user._id
                  ) {
                    setPostToDelete(post._id);
                    setDeleteDialogOpen(true);
                  }
                }}
                sx={{ boxShadow: 2, borderRadius: 3 }}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body1" sx={{ color: "#888", mt: 2 }}>
            {isViewingOwnProfile ? "You haven't posted anything yet." : `${displayUser?.username || displayUser?.name || "User"} hasn't posted anything yet.`}
          </Typography>
        )}
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Post</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this post?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeletePost}
            color="error"
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
          </Container>
        </Box>
      </Box>

      {/* Followers Dialog */}
      <Dialog
        open={followersDialogOpen}
        onClose={() => setFollowersDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 600, textAlign: "center" }}>
          Followers
        </DialogTitle>
        <DialogContent>
          {followers?.length > 0 ? (
            <List>
              {followers.map((follower) => (
                <ListItem key={follower._id} sx={{ px: 0 }}>
                  <ListItemButton
                    onClick={() => {
                      navigate(`/profile/${follower._id}`);
                      setFollowersDialogOpen(false);
                    }}
                    sx={{ borderRadius: 2 }}
                  >
                    <Avatar
                      src={follower.profilePicture}
                      sx={{ width: 40, height: 40, mr: 2 }}
                    >
                      {follower.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <ListItemText
                      primary={follower.username}
                      secondary={`Joined ${new Date(follower.createdAt).toLocaleDateString()}`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
              No followers yet
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Following Dialog */}
      <Dialog
        open={followingDialogOpen}
        onClose={() => setFollowingDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 600, textAlign: "center" }}>
          Following
        </DialogTitle>
        <DialogContent>
          {following?.length > 0 ? (
            <List>
              {following.map((user) => (
                <ListItem key={user._id} sx={{ px: 0 }}>
                  <ListItemButton
                    onClick={() => {
                      navigate(`/profile/${user._id}`);
                      setFollowingDialogOpen(false);
                    }}
                    sx={{ borderRadius: 2 }}
                  >
                    <Avatar
                      src={user.profilePicture}
                      sx={{ width: 40, height: 40, mr: 2 }}
                    >
                      {user.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <ListItemText
                      primary={user.username}
                      secondary={`Joined ${new Date(user.createdAt).toLocaleDateString()}`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
              Not following anyone yet
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <Fab
          size="small"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: { xs: 16, sm: 20 },
            right: { xs: 16, sm: 20 },
            backgroundColor: "white",
            color: "#1DBF73",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "#f0fdf4",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
            zIndex: 1000,
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
          }}
        >
          <KeyboardArrowUpIcon sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }} />
        </Fab>
      </Zoom>
    </Box>
  );
};

export default ProfilePage;
