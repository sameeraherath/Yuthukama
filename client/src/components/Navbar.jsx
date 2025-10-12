import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  CircularProgress,
} from "@mui/material";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import PostAddIcon from "@mui/icons-material/PostAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExploreIcon from "@mui/icons-material/Explore";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MessageIcon from "@mui/icons-material/Message";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { formatDistanceToNow } from "date-fns";
import PostDialog from "./PostDialog";
import LogoutDialog from "./LogoutDialog";
import AIChatBot from "./AIChatBot";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../features/notifications/notificationsSlice";

/**
 * Navigation bar component that provides main navigation and actions
 * @component
 * @returns {JSX.Element} The navigation bar with action buttons
 * @example
 * // In MainLayout.jsx
 * <Navbar />
 */
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const dispatch = useDispatch();
  const { items: notifications, unreadCount, loading: notificationsLoading } = useSelector(
    (state) => state.notifications
  );
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

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
   * Opens the post creation dialog
   * @function
   */
  const handleClickOpen = () => {
    setOpen(true);
  };

  /**
   * Closes the post creation dialog
   * @function
   */
  const handleClose = () => {
    setOpen(false);
  };

  /**
   * Handles post submission and resets form
   * @function
   * @param {Object} values - Form values
   * @param {Object} actions - Form actions
   */
  const handlePostSubmit = (values, actions) => {
    actions.resetForm();
    handleClose();
  };


  /**
   * Toggles the mobile menu drawer
   * @function
   */
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  /**
   * Handles navigation from mobile menu
   * @function
   * @param {string} path - Path to navigate to
   */
  const handleMobileNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  /**
   * Opens the logout confirmation dialog
   * @function
   */
  const handleLogoutClick = () => {
    setLogoutConfirmOpen(true);
  };

  /**
   * Closes the logout confirmation dialog
   * @function
   */
  const handleLogoutConfirmClose = () => {
    setLogoutConfirmOpen(false);
  };

  /**
   * Handles user logout and navigation
   * @function
   */
  const handleLogout = () => {
    logout();
    setLogoutConfirmOpen(false);
    navigate("/");
  };

  return (
    <div>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "#fff",
          color: "#404145",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar>
          {/* Logo */}
          <Typography
            variant="h6"
            onClick={() => navigate("/home")}
            sx={{
              flexGrow: 1,
              color: "#1DBF73",
              fontWeight: "bold",
              fontSize: { xs: "1.3rem", sm: "1.7rem" },
              cursor: "pointer",
            }}
          >
            Yuthukama
          </Typography>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {isAdmin ? (
              <IconButton
                color="inherit"
                onClick={handleLogoutClick}
                sx={{
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "rgba(29, 191, 115, 0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <LogoutIcon sx={{ fontSize: "28px", color: "#1DBF73" }} />
              </IconButton>
            ) : (
              <IconButton
                color="inherit"
                onClick={handleClickOpen}
                aria-label="Create post"
                sx={{
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "rgba(29, 191, 115, 0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <PostAddIcon sx={{ fontSize: "28px", color: "#1DBF73" }} />
              </IconButton>
            )}
          </Box>

          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              color="inherit"
              aria-label="Open menu"
              onClick={toggleMobileMenu}
              sx={{
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "rgba(29, 191, 115, 0.1)",
                },
              }}
            >
              <MenuIcon sx={{ fontSize: "28px", color: "#1DBF73" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>


      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: "#fff",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* User Profile Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3,
              pb: 2,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Avatar
              src={user?.profilePicture}
              alt={user?.username}
              sx={{
                width: 48,
                height: 48,
                border: "2px solid #1DBF73",
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {user?.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>

          {/* Mobile Menu Items */}
          <List>
            {isAdmin ? (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleMobileNavigation("/admin/dashboard")}
                >
                  <ListItemIcon>
                    <DashboardIcon sx={{ color: "#1DBF73" }} />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleMobileNavigation("/home")}
                  >
                    <ListItemIcon>
                      <HomeIcon sx={{ color: "#1DBF73" }} />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleMobileNavigation("/explore")}
                  >
                    <ListItemIcon>
                      <ExploreIcon sx={{ color: "#1DBF73" }} />
                    </ListItemIcon>
                    <ListItemText primary="Explore" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowNotifications(true);
                      dispatch(fetchNotifications());
                    }}
                  >
                    <ListItemIcon>
                      <NotificationsIcon sx={{ color: "#1DBF73" }} />
                    </ListItemIcon>
                    <ListItemText primary="Notifications" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleMobileNavigation("/messages")}
                  >
                    <ListItemIcon>
                      <ChatIcon sx={{ color: "#1DBF73" }} />
                    </ListItemIcon>
                    <ListItemText primary="Messages" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleMobileNavigation("/saved")}
                  >
                    <ListItemIcon>
                      <BookmarkIcon sx={{ color: "#1DBF73" }} />
                    </ListItemIcon>
                    <ListItemText primary="Saved" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleMobileNavigation("/profile")}
                  >
                    <ListItemIcon>
                      <AccountCircleIcon sx={{ color: "#1DBF73" }} />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleClickOpen();
                    }}
                  >
                    <ListItemIcon>
                      <PostAddIcon sx={{ color: "#1DBF73" }} />
                    </ListItemIcon>
                    <ListItemText primary="Create Post" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowAIChat(true);
                    }}
                  >
                    <ListItemIcon>
                      <SmartToyIcon sx={{ color: "#1DBF73" }} />
                    </ListItemIcon>
                    <ListItemText primary="AI Assistant" />
                  </ListItemButton>
                </ListItem>

                <Divider sx={{ my: 1 }} />

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleMobileNavigation("/settings")}
                  >
                    <ListItemIcon>
                      <SettingsIcon sx={{ color: "#1DBF73" }} />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                  </ListItemButton>
                </ListItem>
              </>
            )}

            <Divider sx={{ my: 1 }} />

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogoutClick();
                }}
                sx={{
                  color: "#FF6B6B",
                  "&:hover": {
                    backgroundColor: "rgba(255, 107, 107, 0.1)",
                  },
                }}
              >
                <ListItemIcon>
                  <LogoutIcon sx={{ color: "#FF6B6B" }} />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

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

      {/* Dialogs */}
      <LogoutDialog
        open={logoutConfirmOpen}
        onClose={handleLogoutConfirmClose}
        onLogout={handleLogout}
      />
      <PostDialog
        open={open}
        handleClose={handleClose}
        handlePostSubmit={handlePostSubmit}
      />
      {showAIChat && <AIChatBot onClose={() => setShowAIChat(false)} />}
    </div>
  );
};

export default Navbar;
