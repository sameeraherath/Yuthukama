import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Alert,
  Container,
  Grid,
  Fab,
  Zoom,
  Chip,
  Fade,
  Tabs,
  Tab,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Avatar,
  Badge,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

import useAuth from "../hooks/useAuth";
import useFeed from "../hooks/useFeed";
import SearchBar from "../components/SearchBar";
import PostCard from "../components/PostCard";
import EnhancedSkeleton from "../components/LoadingStates/EnhancedSkeleton";
import EmptyState from "../components/EmptyState";
import PostDialog from "../components/PostDialog";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import SettingsIcon from "@mui/icons-material/Settings";
import ExploreIcon from "@mui/icons-material/Explore";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import GroupIcon from "@mui/icons-material/Group";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MessageIcon from "@mui/icons-material/Message";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDistanceToNow } from "date-fns";
import NotificationMenu from "../components/NotificationMenu";
import AIChatBot from "../components/AIChatBot";
import RecommendedUsers from "../components/RecommendedUsers";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../features/notifications/notificationsSlice";

/**
 * Modern social media home screen with three-column layout
 * @component
 * @returns {JSX.Element} The redesigned home screen with sidebar navigation and main feed
 */
const HomeScreen = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // Feed types mapping
  const feedTypes = ['forYou', 'following'];
  const currentFeedType = feedTypes[activeTab] || 'forYou';
  const [showAIChat, setShowAIChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPostDialog, setShowPostDialog] = useState(false);
  const dispatch = useDispatch();
  const { items: notifications, unreadCount, loading: notificationsLoading } = useSelector(
    (state) => state.notifications
  );

  /**
   * Effect hook to redirect unauthenticated users to login
   */
  useEffect(() => {
    console.log("HomeScreen - Auth state:", { isAuthenticated, user });
    if (!isAuthenticated) {
      console.log("HomeScreen - Not authenticated, redirecting to login");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch notifications when drawer opens
  useEffect(() => {
    if (showNotifications) {
      dispatch(fetchNotifications());
    }
  }, [showNotifications, dispatch]);

  // Helper functions for notifications
  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <FavoriteIcon sx={{ color: "#e91e63" }} />;
      case "comment":
        return <CommentIcon sx={{ color: "#2196f3" }} />;
      case "follow":
        return <PersonAddIcon sx={{ color: "#4caf50" }} />;
      case "message":
        return <MessageIcon sx={{ color: "#ff9800" }} />;
      case "mention":
        return <AlternateEmailIcon sx={{ color: "#9c27b0" }} />;
      default:
        return <NotificationsIcon />;
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await dispatch(markNotificationAsRead(notification._id));
    }

    // Navigate based on notification type
    switch (notification.type) {
      case "like":
      case "comment":
      case "mention":
        if (notification.relatedPost) {
          navigate(`/post/${notification.relatedPost._id}`);
        }
        break;
      case "follow":
        navigate(`/profile/${notification.sender._id}`);
        break;
      case "message":
        navigate(`/messages/${notification.sender._id}`);
        break;
      default:
        break;
    }
    setShowNotifications(false);
  };

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    await dispatch(deleteNotification(notificationId));
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllNotificationsAsRead());
  };

  /**
   * Handles post submission and resets form
   * @function
   * @param {Object} values - Form values
   * @param {Object} actions - Form actions
   */
  const handlePostSubmit = (values, actions) => {
    actions.resetForm();
    setShowPostDialog(false);
  };

  // Use the new feed hook
  const { posts, error, loading } = useFeed(currentFeedType);

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
   * Filters posts based on search term
   * Note: Feed type filtering is now handled by the useFeed hook
   */
  const filteredPosts = posts.filter((post) => {
    if (!searchTerm) return true;
    
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  /**
   * Handle tab change
   */
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // The useFeed hook will automatically fetch the new feed type
    // when currentFeedType changes due to activeTab change
  };

  /**
   * Navigation items for sidebar
   */
  const navigationItems = [
    { icon: <HomeIcon />, label: "Home", path: "/home", active: true },
    { icon: <ExploreIcon />, label: "Explore", path: "/explore" },
    { icon: <NotificationsIcon />, label: "Notifications", component: "notification" },
    { icon: <ChatIcon />, label: "Messages", path: "/messages" },
    { icon: <BookmarkIcon />, label: "Saved", path: "/saved" },
    { icon: <PersonIcon />, label: "Profile", path: "/profile" },
    { icon: <SettingsIcon />, label: "Settings", path: "/settings" },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

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
                      setShowNotifications(true);
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
                      setShowNotifications(true);
                      setMobileDrawerOpen(false);
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
          marginRight: { xs: 0, lg: "320px" },
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 64px)",
        }}
      >

        {/* Feed Content */}
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
          <Box sx={{ 
            width: "100%", 
            maxWidth: { xs: "100%", sm: 600, md: 700 },
            minHeight: "fit-content",
          }}>
            {/* Feed Tabs */}
            <Paper
              elevation={0}
              sx={{
                mb: { xs: 2, sm: 3 },
                backgroundColor: "white",
                borderRadius: 2,
                border: "1px solid #e5e7eb",
                overflow: "hidden",
              }}
            >
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: { xs: "0.875rem", sm: "0.95rem" },
                    minWidth: "auto",
                    px: { xs: 1, sm: 2 },
                    py: 1.5,
                  },
                  "& .Mui-selected": {
                    color: "#1DBF73",
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#1DBF73",
                    height: 3,
                  },
                }}
              >
                <Tab label="For You" />
                <Tab label="Following" />
              </Tabs>
            </Paper>

            {/* Search Bar */}
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </Box>

            {/* Posts Feed */}
            {error ? (
                <Alert
                  severity="error"
                  icon={<ErrorOutlineIcon />}
                sx={{ 
                  borderRadius: 2, 
                  mb: 2,
                  mx: { xs: 1, sm: 0 }
                }}
                >
                  <Typography variant="body2">{error}</Typography>
                </Alert>
            ) : loading ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: { xs: 1.5, sm: 2 },
                  alignItems: "center",
                  width: "100%",
                  px: { xs: 1, sm: 0 }
                }}>
                  <AnimatePresence mode="popLayout">
                    {[1, 2, 3].map((index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        layout
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        style={{ width: "100%" }}
                      >
                        <EnhancedSkeleton variant="post" count={1} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Box>
              </motion.div>
            ) : filteredPosts.length === 0 ? (
              <Box sx={{ px: { xs: 1, sm: 0 } }}>
                  <EmptyState
                    variant={searchTerm ? "no-search-results" : "no-posts"}
                    searchTerm={searchTerm}
                    onAction={
                      searchTerm
                        ? () => setSearchTerm("")
                        : () => setShowPostDialog(true)
                    }
                  />
              </Box>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: { xs: 1.5, sm: 2 },
                  alignItems: "center",
                  width: "100%",
                  px: { xs: 1, sm: 0 }
                }}>
                  <AnimatePresence mode="popLayout">
                    {filteredPosts.map((post, index) => (
                      <motion.div
                        key={post._id}
                        variants={itemVariants}
                        layout
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        style={{ width: "100%" }}
                      >
                        <PostCard post={post} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Box>
              </motion.div>
            )}
          </Box>
        </Box>
      </Box>

      {/* Right Sidebar - Desktop Only */}
              <Box
                sx={{
          width: { xs: 0, lg: 320 },
          display: { xs: "none", lg: "block" },
          position: "fixed",
          right: 0,
          top: 64,
          height: "calc(100vh - 64px)",
          overflowY: "auto",
          p: { lg: 2, xl: 3 },
          backgroundColor: "transparent",
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
          gap: { lg: 2.5, xl: 3 },
          maxWidth: 280,
        }}>
          {/* Recommended Users */}
          <RecommendedUsers />
                  </Box>
              </Box>

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
      
      {/* Notification Drawer */}
      <Drawer
        anchor="right"
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: 400 },
            maxWidth: "100vw",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1DBF73" }}>
              Notifications
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {unreadCount > 0 && (
                <IconButton size="small" onClick={handleMarkAllAsRead} title="Mark all as read">
                  <NotificationsIcon />
                </IconButton>
              )}
              <IconButton onClick={() => setShowNotifications(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {notificationsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={24} sx={{ color: "#1DBF73" }} />
            </Box>
          ) : notifications.length > 0 ? (
            <List sx={{ p: 0 }}>
              {notifications.map((notification) => (
                <ListItem
                  key={notification._id}
                  disablePadding
                  sx={{ mb: 1 }}
                >
                  <ListItemButton
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      borderRadius: 2,
                      bgcolor: notification.isRead ? "transparent" : "#f0fdf4",
                      border: notification.isRead ? "none" : "1px solid #1DBF73",
                      py: 1.5,
                      px: 2,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#f0fdf4",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {notification.sender?.profilePicture ? (
                        <Avatar
                          src={notification.sender.profilePicture}
                          sx={{ width: 32, height: 32 }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            bgcolor: "#1DBF73",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {getNotificationIcon(notification.type)}
                        </Box>
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="body2" sx={{ flexGrow: 1 }}>
                            {notification.content}
                          </Typography>
                          {!notification.isRead && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: "#1DBF73",
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </Typography>
                      }
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => handleDeleteNotification(e, notification._id)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No notifications
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
      
      {/* AI Chatbot */}
      {showAIChat && <AIChatBot onClose={() => setShowAIChat(false)} />}
      
      {/* Post Dialog */}
      <PostDialog
        open={showPostDialog}
        handleClose={() => setShowPostDialog(false)}
        handlePostSubmit={handlePostSubmit}
      />
    </Box>
  );
};

export default HomeScreen;
