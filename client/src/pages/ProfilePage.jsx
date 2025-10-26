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
  Card,
  CardContent,
  CardMedia,
  LinearProgress,
  Tooltip,
  Fade,
  Backdrop,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EnhancedSkeleton from "../components/LoadingStates/EnhancedSkeleton";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import SettingsIcon from "@mui/icons-material/Settings";
import ExploreIcon from "@mui/icons-material/Explore";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MenuIcon from "@mui/icons-material/Menu";
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
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log("Selected file:", selectedFile);
      setFile(selectedFile);
      
      // Create preview URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setShowProfileDialog(true);
    }
  };

  /**
   * Cleans up preview URL when component unmounts or file changes
   */
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  /**
   * Handles profile picture upload
   * @async
   * @function
   */
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    console.log("Uploading file:", file);
    const formData = new FormData();
    formData.append("profilePic", file);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await dispatch(updateProfilePicture(formData));
      console.log("Profile picture update result:", result);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Clean up after successful upload
      setTimeout(() => {
      setFile(null);
        setPreviewUrl(null);
        setShowProfileDialog(false);
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error("Error updating profile picture:", error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  /**
   * Cancels profile picture upload
   * @function
   */
  const handleCancelUpload = () => {
    setFile(null);
    setPreviewUrl(null);
    setShowProfileDialog(false);
    setIsUploading(false);
    setUploadProgress(0);
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
   * Initiates comprehensive profile editing mode
   * @function
   */
  const handleEditProfile = () => {
    setEditFormData({
      username: user?.username || "",
      email: user?.email || ""
    });
    setShowEditProfileDialog(true);
  };

  /**
   * Handles form data changes in edit profile dialog
   * @function
   */
  const handleFormDataChange = (field) => (e) => {
    const value = e.target.value;
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  /**
   * Validates form data
   * @function
   */
  const validateForm = () => {
    const errors = {};
    
    // Username validation
    if (!editFormData.username.trim()) {
      errors.username = "Username is required";
    } else if (editFormData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (editFormData.username.length > 20) {
      errors.username = "Username must be less than 20 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(editFormData.username)) {
      errors.username = "Username can only contain letters, numbers, and underscores";
    }
    
    // Email validation
    if (!editFormData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handles profile update submission
   * @async
   * @function
   */
  const handleProfileUpdate = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update username if changed
      if (editFormData.username !== user?.username) {
        await dispatch(updateUsername(editFormData.username));
      }
      
      // Update email if changed
      if (editFormData.email !== user?.email) {
        // Here you would add email update logic
        // For now, we'll just show a message
        console.log("Email update would be implemented here:", editFormData.email);
      }
      
      setShowEditProfileDialog(false);
      setFormErrors({});
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Cancels profile editing
   * @function
   */
  const handleCancelProfileEdit = () => {
    setShowEditProfileDialog(false);
    setEditFormData({
      username: "",
      email: ""
    });
    setFormErrors({});
    setIsSubmitting(false);
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
      {/* Modern Profile Header Card */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          border: "1px solid rgba(29, 191, 115, 0.1)",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Profile Picture Section */}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 3,
              background: "linear-gradient(135deg, #1DBF73 0%, #169c5f 100%)",
              color: "white",
            }}
      >
        <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
          <Avatar
            src={displayUser?.profilePicture || "/uploads/profile-pics/default.jpg"}
            sx={{
                  width: 120,
                  height: 120,
                  border: "4px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 6px 24px rgba(0, 0, 0, 0.2)",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  },
            }}
          />
          {isViewingOwnProfile && (
                <Tooltip title="Update Profile Picture" arrow>
            <label htmlFor="profile-pic-upload">
              <input
                      accept="image/jpeg,image/png,image/webp"
                style={{ display: "none" }}
                id="profile-pic-upload"
                type="file"
                onChange={handleFileChange}
              />
               <Box
                 sx={{
                   position: "absolute",
                   bottom: 6,
                   right: 6,
                   bgcolor: "rgba(255, 255, 255, 0.9)",
                   borderRadius: "50%",
                   p: 0.8,
                   cursor: "pointer",
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "center",
                   transition: "all 0.3s ease-in-out",
                   backdropFilter: "blur(10px)",
                   boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                   "&:hover": {
                     bgcolor: "#1DBF73",
                     transform: "scale(1.1)",
                     boxShadow: "0 3px 12px rgba(0, 0, 0, 0.3)",
                     "& .MuiSvgIcon-root": {
                       color: "white",
                     },
                   },
                 }}
               >
                 <PhotoCameraIcon sx={{ color: "#1DBF73", fontSize: "1rem", transition: "color 0.3s ease-in-out" }} />
               </Box>
            </label>
                </Tooltip>
          )}
        </Box>

            {/* User Info Section */}
            <Box sx={{ textAlign: "center", mb: 1 }}>
              <Typography
                variant="h4"
                component="h1"
            sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
                  mb: 0.5,
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                {displayUser?.username || displayUser?.name || "Unknown User"}
              </Typography>
              <Typography
                variant="body1"
          sx={{
                  opacity: 0.9,
                  fontWeight: 400,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                {displayUser?.email}
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons Section */}
          <Box sx={{ p: 2, bgcolor: "white" }}>
            {isViewingOwnProfile && (
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
                <Button
                variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditProfile}
                sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 0.8,
                    borderColor: "#1DBF73",
                    color: "#1DBF73",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "0.9rem",
                    "&:hover": {
                      borderColor: "#169c5f",
                      backgroundColor: "rgba(29, 191, 115, 0.04)",
                    },
                  }}
                >
                  Edit Profile
              </Button>
        </Box>
            )}
        
        {/* Follow/Unfollow Button and Stats */}
        {!isViewingOwnProfile && (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Button
              variant={followStatus[userId] ? "outlined" : "contained"}
              color="success"
              onClick={followStatus[userId] ? handleUnfollow : handleFollow}
              disabled={userLoading}
              startIcon={followStatus[userId] ? <PersonRemoveIcon /> : <PersonAddIcon />}
              sx={{
                    fontWeight: 600,
                textTransform: "none",
                    borderRadius: 2,
                    px: 3,
                py: 1,
                    fontSize: "0.9rem",
                    backgroundColor: followStatus[userId] ? "transparent" : "#1DBF73",
                    borderColor: "#1DBF73",
                    color: followStatus[userId] ? "#1DBF73" : "white",
                    boxShadow: followStatus[userId] ? "none" : "0 3px 12px rgba(29, 191, 115, 0.3)",
                "&:hover": {
                  backgroundColor: followStatus[userId] ? "#f0fdf4" : "#169c5f",
                      borderColor: "#1DBF73",
                      boxShadow: followStatus[userId] ? "0 2px 6px rgba(29, 191, 115, 0.2)" : "0 4px 16px rgba(29, 191, 115, 0.4)",
                      transform: "translateY(-1px)",
                },
                    transition: "all 0.3s ease-in-out",
              }}
            >
              {followStatus[userId] ? "Unfollow" : "Follow"}
            </Button>
            
            {/* Followers and Following Stats */}
                <Box sx={{ display: "flex", gap: 1.5 }}>
              <Chip
                icon={<PeopleIcon />}
                label={`${followers?.length || 0} Followers`}
                onClick={handleOpenFollowers}
                    size="small"
                sx={{
                  cursor: "pointer",
                  backgroundColor: "#f0fdf4",
                      color: "#1DBF73",
                      border: "1px solid #1DBF73",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                  "&:hover": {
                    backgroundColor: "#e0f2e9",
                        transform: "translateY(-1px)",
                        boxShadow: "0 3px 8px rgba(29, 191, 115, 0.2)",
                  },
                      transition: "all 0.3s ease-in-out",
                }}
              />
              <Chip
                icon={<PeopleIcon />}
                label={`${following?.length || 0} Following`}
                onClick={handleOpenFollowing}
                    size="small"
                sx={{
                  cursor: "pointer",
                  backgroundColor: "#f0fdf4",
                      color: "#1DBF73",
                      border: "1px solid #1DBF73",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                  "&:hover": {
                    backgroundColor: "#e0f2e9",
                        transform: "translateY(-1px)",
                        boxShadow: "0 3px 8px rgba(29, 191, 115, 0.2)",
                  },
                      transition: "all 0.3s ease-in-out",
                }}
              />
            </Box>
          </Box>
        )}

            {/* Success/Error Messages */}
            {(message || userError) && (
              <Fade in={!!(message || userError)}>
                <Alert
                  severity={userError ? "error" : "success"}
                  sx={{
                    mt: 2,
                    borderRadius: 3,
                    fontWeight: 500,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {userError || message}
                </Alert>
              </Fade>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Modern Profile Picture Upload Dialog */}
      <Dialog
        open={showProfileDialog}
        onClose={handleCancelUpload}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 16px 48px rgba(0, 0, 0, 0.15)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #1DBF73 0%, #169c5f 100%)",
            color: "white",
            textAlign: "center",
            fontWeight: 700,
            fontSize: "1.5rem",
            py: 3,
          }}
        >
          Update Profile Picture
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: "center" }}>
            {/* Preview Section */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, fontSize: "1.1rem" }}>
                Preview
              </Typography>
              <Avatar
                src={previewUrl}
                sx={{
                  width: 100,
                  height: 100,
                  mx: "auto",
                  border: "3px solid #1DBF73",
                  boxShadow: "0 6px 20px rgba(29, 191, 115, 0.3)",
                }}
              />
            </Box>

            {/* Upload Progress */}
            {isUploading && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: "0.85rem" }}>
                  Uploading... {uploadProgress}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: "#f0fdf4",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#1DBF73",
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            )}

            {/* File Info */}
            {file && (
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "#f8fafc",
                  borderRadius: 2,
                  border: "1px solid #e5e7eb",
                  mb: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: "0.8rem" }}>
                  Selected File:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>
            )}

            {/* Instructions */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: "0.85rem" }}>
              Choose a clear, high-quality image for your profile picture. 
              Supported formats: JPEG, PNG, WebP
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1.5 }}>
          <Button
            onClick={handleCancelUpload}
            variant="outlined"
            disabled={isUploading}
            startIcon={<CloseIcon />}
            sx={{
              borderRadius: 2,
              px: 2,
              py: 0.8,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "0.9rem",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!file || isUploading}
            startIcon={isUploading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
            sx={{
              borderRadius: 2,
              px: 2,
              py: 0.8,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "0.9rem",
              backgroundColor: "#1DBF73",
              boxShadow: "0 3px 12px rgba(29, 191, 115, 0.3)",
              "&:hover": {
                backgroundColor: "#169c5f",
                boxShadow: "0 4px 16px rgba(29, 191, 115, 0.4)",
              },
            }}
          >
            {isUploading ? "Uploading..." : "Upload Picture"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Username Edit Dialog */}
      <Dialog
        open={editingUsername}
        onClose={handleCancelEdit}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 16px 48px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #1DBF73 0%, #169c5f 100%)",
            color: "white",
            textAlign: "center",
            fontWeight: 700,
            fontSize: "1.5rem",
            py: 3,
          }}
        >
          Edit Username
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            label="New Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            variant="outlined"
            fullWidth
            autoFocus
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&.Mui-focused fieldset": {
                  borderColor: "#1DBF73",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#1DBF73",
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1.5 }}>
          <Button
            onClick={handleCancelEdit}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 2,
              py: 0.8,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "0.9rem",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUsernameChange}
            variant="contained"
            disabled={!newUsername}
            startIcon={<CheckIcon />}
            sx={{
              borderRadius: 2,
              px: 2,
              py: 0.8,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "0.9rem",
              backgroundColor: "#1DBF73",
              boxShadow: "0 3px 12px rgba(29, 191, 115, 0.3)",
              "&:hover": {
                backgroundColor: "#169c5f",
                boxShadow: "0 4px 16px rgba(29, 191, 115, 0.4)",
              },
            }}
          >
            Update Username
          </Button>
        </DialogActions>
      </Dialog>

      {/* Comprehensive Edit Profile Dialog */}
      <Dialog
        open={showEditProfileDialog}
        onClose={handleCancelProfileEdit}
        maxWidth="sm"
        fullWidth
        fullScreen={window.innerWidth < 768}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 4 },
            boxShadow: { xs: "none", sm: "0 16px 48px rgba(0, 0, 0, 0.15)" },
            overflow: "hidden",
            maxHeight: { xs: "100vh", sm: "85vh" },
            margin: { xs: 0, sm: "auto" },
            width: { xs: "100%", sm: "95%", md: "500px" },
            height: { xs: "100%", sm: "auto" },
            maxWidth: { xs: "100%", sm: "500px" },
            mx: { xs: 0, sm: 2 },
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #1DBF73 0%, #169c5f 100%)",
            color: "white",
            textAlign: "center",
            fontWeight: 700,
            fontSize: { xs: "1.1rem", sm: "1.5rem" },
            py: { xs: 3, sm: 3 },
            px: { xs: 2, sm: 3 },
            position: "sticky",
            top: 0,
            zIndex: 1,
            minHeight: { xs: "70px", sm: "auto" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Edit Profile
        </DialogTitle>
        <DialogContent 
          sx={{ 
            p: { xs: 2, sm: 4 },
            pt: { xs: 5, sm: 5 },
            pb: { xs: 2, sm: 3 },
            overflowY: "auto",
            flex: 1,
            minHeight: { xs: "calc(100vh - 140px)", sm: "auto" },
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
          <Box sx={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: { xs: 2.5, sm: 3.5 },
            mt: { xs: 2, sm: 2 },
            px: { xs: 1, sm: 0 }
          }}>
              {/* Username Field */}
              <TextField
                label="Username"
                value={editFormData.username}
                onChange={handleFormDataChange("username")}
                variant="outlined"
                fullWidth
                required
                error={!!formErrors.username}
                helperText={formErrors.username}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    fontSize: { xs: "16px", sm: "14px" },
                    minHeight: { xs: "56px", sm: "56px" },
                    "&.Mui-focused fieldset": {
                      borderColor: formErrors.username ? "#ef4444" : "#1DBF73",
                      borderWidth: 2,
                    },
                    "&.Mui-error fieldset": {
                      borderColor: "#ef4444",
                      borderWidth: 2,
                    },
                    "& input": {
                      padding: { xs: "16px 14px", sm: "14px" },
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "16px", sm: "14px" },
                    transform: { xs: "translate(14px, 16px) scale(1)", sm: "translate(14px, -9px) scale(0.75)" },
                    "&.Mui-focused": {
                      transform: { xs: "translate(14px, 8px) scale(0.75)", sm: "translate(14px, -9px) scale(0.75)" },
                    },
                    "&.MuiFormLabel-filled": {
                      transform: { xs: "translate(14px, 8px) scale(0.75)", sm: "translate(14px, -9px) scale(0.75)" },
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: formErrors.username ? "#ef4444" : "#1DBF73",
                  },
                  "& .MuiInputLabel-root.Mui-error": {
                    color: "#ef4444",
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: { xs: "13px", sm: "12px" },
                    marginLeft: { xs: "14px", sm: "14px" },
                  },
                }}
              />

              {/* Email Field */}
              <TextField
                label="Email"
                value={editFormData.email}
                onChange={handleFormDataChange("email")}
                variant="outlined"
                fullWidth
                type="email"
                required
                error={!!formErrors.email}
                helperText={formErrors.email}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    fontSize: { xs: "16px", sm: "14px" },
                    minHeight: { xs: "56px", sm: "56px" },
                    "&.Mui-focused fieldset": {
                      borderColor: formErrors.email ? "#ef4444" : "#1DBF73",
                      borderWidth: 2,
                    },
                    "&.Mui-error fieldset": {
                      borderColor: "#ef4444",
                      borderWidth: 2,
                    },
                    "& input": {
                      padding: { xs: "16px 14px", sm: "14px" },
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "16px", sm: "14px" },
                    transform: { xs: "translate(14px, 16px) scale(1)", sm: "translate(14px, -9px) scale(0.75)" },
                    "&.Mui-focused": {
                      transform: { xs: "translate(14px, 8px) scale(0.75)", sm: "translate(14px, -9px) scale(0.75)" },
                    },
                    "&.MuiFormLabel-filled": {
                      transform: { xs: "translate(14px, 8px) scale(0.75)", sm: "translate(14px, -9px) scale(0.75)" },
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: formErrors.email ? "#ef4444" : "#1DBF73",
                  },
                  "& .MuiInputLabel-root.Mui-error": {
                    color: "#ef4444",
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: { xs: "13px", sm: "12px" },
                    marginLeft: { xs: "14px", sm: "14px" },
                  },
                }}
              />
            </Box>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 2, sm: 4 }, 
          pt: { xs: 1.5, sm: 3 },
          pb: { xs: 2, sm: 3 },
          gap: { xs: 1.5, sm: 2.5 }, 
          borderTop: "1px solid #e5e7eb",
          position: "sticky",
          bottom: 0,
          backgroundColor: "white",
          zIndex: 1,
          flexDirection: { xs: "column", sm: "row" },
          px: { xs: 2, sm: 3 },
        }}>
          <Button
            onClick={handleCancelProfileEdit}
            variant="outlined"
            startIcon={<CloseIcon />}
            sx={{
              borderRadius: 3,
              px: { xs: 3, sm: 3 },
              py: { xs: 1.5, sm: 1 },
              fontWeight: 600,
              textTransform: "none",
              fontSize: { xs: "16px", sm: "14px" },
              borderColor: "#6b7280",
              color: "#6b7280",
              width: { xs: "100%", sm: "auto" },
              minHeight: { xs: "52px", sm: "44px" },
              borderWidth: { xs: "2px", sm: "1px" },
              "&:hover": {
                borderColor: "#374151",
                backgroundColor: "#f9fafb",
                borderWidth: { xs: "2px", sm: "1px" },
              },
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleProfileUpdate}
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <CheckIcon />}
            disabled={isSubmitting}
            sx={{
              borderRadius: 3,
              px: { xs: 3, sm: 3 },
              py: { xs: 1.5, sm: 1 },
              fontWeight: 600,
              textTransform: "none",
              fontSize: { xs: "16px", sm: "14px" },
              backgroundColor: "#1DBF73",
              boxShadow: { xs: "0 4px 12px rgba(29, 191, 115, 0.3)", sm: "0 3px 12px rgba(29, 191, 115, 0.3)" },
              width: { xs: "100%", sm: "auto" },
              minHeight: { xs: "52px", sm: "44px" },
              "&:hover": {
                backgroundColor: "#169c5f",
                boxShadow: { xs: "0 6px 16px rgba(29, 191, 115, 0.4)", sm: "0 4px 16px rgba(29, 191, 115, 0.4)" },
              },
              "&:active": {
                transform: "scale(0.98)",
                boxShadow: { xs: "0 2px 8px rgba(29, 191, 115, 0.3)", sm: "0 2px 8px rgba(29, 191, 115, 0.3)" },
              },
              "&:disabled": {
                backgroundColor: "#9ca3af",
                boxShadow: "none",
              },
            }}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modern Posts Section */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          border: "1px solid rgba(29, 191, 115, 0.1)",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #1DBF73 0%, #169c5f 100%)",
              color: "white",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, textAlign: "center" }}>
          {isViewingOwnProfile ? "Your Posts" : `${displayUser?.username || displayUser?.name || "User"}'s Posts`}
        </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
        {postsError && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2, 
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
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
                    sx={{ 
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)", 
                      borderRadius: 3,
                      border: "1px solid rgba(29, 191, 115, 0.1)",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                        transform: "translateY(-2px)",
                      },
                    }}
              />
            ))}
          </Box>
        ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: "#6b7280", 
                    fontWeight: 500,
                    mb: 1,
                    fontSize: "1rem",
                  }}
                >
                  {isViewingOwnProfile ? "No posts yet" : "No posts available"}
          </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: "#9ca3af",
                    fontSize: "0.85rem",
                  }}
                >
                  {isViewingOwnProfile 
                    ? "Start sharing your thoughts with the community!" 
                    : `${displayUser?.username || displayUser?.name || "User"} hasn't shared anything yet.`
                  }
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Modern Delete Post Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ 
          sx: { 
            borderRadius: 4, 
            boxShadow: "0 16px 48px rgba(0, 0, 0, 0.15)",
            overflow: "hidden",
          } 
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            color: "white",
            textAlign: "center",
            fontWeight: 700,
            fontSize: "1.5rem",
            py: 3,
          }}
        >
          Delete Post
        </DialogTitle>
        <DialogContent sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Are you sure you want to delete this post?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeletePost}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 16px rgba(239, 68, 68, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 20px rgba(239, 68, 68, 0.4)",
              },
            }}
          >
            Delete Post
          </Button>
        </DialogActions>
      </Dialog>
          </Container>
        </Box>
      </Box>

      {/* Modern Followers Dialog */}
      <Dialog
        open={followersDialogOpen}
        onClose={() => setFollowersDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: 4,
            boxShadow: "0 16px 48px rgba(0, 0, 0, 0.15)",
            overflow: "hidden",
          } 
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #1DBF73 0%, #169c5f 100%)",
            color: "white",
            textAlign: "center",
            fontWeight: 700,
            fontSize: "1.5rem",
            py: 3,
          }}
        >
          Followers
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {followers?.length > 0 ? (
            <List sx={{ p: 2 }}>
              {followers.map((follower) => (
                <ListItem key={follower._id} sx={{ px: 0, mb: 1 }}>
                  <ListItemButton
                    onClick={() => {
                      navigate(`/profile/${follower._id}`);
                      setFollowersDialogOpen(false);
                    }}
                    sx={{ 
                      borderRadius: 3,
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#f0fdf4",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Avatar
                      src={follower.profilePicture}
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        mr: 2,
                        border: "2px solid #1DBF73",
                      }}
                    >
                      {follower.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {follower.username}
                        </Typography>
                      }
                      secondary={`Joined ${new Date(follower.createdAt).toLocaleDateString()}`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography variant="h6" sx={{ color: "#6b7280", fontWeight: 500 }}>
              No followers yet
            </Typography>
              <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                Start connecting with others to build your community!
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Modern Following Dialog */}
      <Dialog
        open={followingDialogOpen}
        onClose={() => setFollowingDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: 4,
            boxShadow: "0 16px 48px rgba(0, 0, 0, 0.15)",
            overflow: "hidden",
          } 
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #1DBF73 0%, #169c5f 100%)",
            color: "white",
            textAlign: "center",
            fontWeight: 700,
            fontSize: "1.5rem",
            py: 3,
          }}
        >
          Following
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {following?.length > 0 ? (
            <List sx={{ p: 2 }}>
              {following.map((user) => (
                <ListItem key={user._id} sx={{ px: 0, mb: 1 }}>
                  <ListItemButton
                    onClick={() => {
                      navigate(`/profile/${user._id}`);
                      setFollowingDialogOpen(false);
                    }}
                    sx={{ 
                      borderRadius: 3,
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#f0fdf4",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Avatar
                      src={user.profilePicture}
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        mr: 2,
                        border: "2px solid #1DBF73",
                      }}
                    >
                      {user.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {user.username}
                        </Typography>
                      }
                      secondary={`Joined ${new Date(user.createdAt).toLocaleDateString()}`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography variant="h6" sx={{ color: "#6b7280", fontWeight: 500 }}>
              Not following anyone yet
            </Typography>
              <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                Discover interesting people to follow!
              </Typography>
            </Box>
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
