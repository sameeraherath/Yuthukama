import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Drawer,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PostDialog from "./PostDialog";
import LogoutDialog from "./LogoutDialog";
import NotificationMenu from "./NotificationMenu";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useSelector } from "react-redux";
import AIChatBot from "./AIChatBot";

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
  const [showAIChat, setShowAIChat] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";
  const profileMenuOpen = Boolean(profileAnchorEl);

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
   * Opens the profile menu
   * @function
   */
  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  /**
   * Closes the profile menu
   * @function
   */
  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  /**
   * Navigates to profile page
   * @function
   */
  const handleProfileNavigation = () => {
    navigate("/profile");
    setProfileAnchorEl(null);
  };

  /**
   * Navigates to settings page
   * @function
   */
  const handleSettingsNavigation = () => {
    navigate("/settings");
    setProfileAnchorEl(null);
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
    setProfileAnchorEl(null);
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
            onClick={() => navigate(isAdmin ? "/admin/dashboard" : "/home")}
            sx={{
              flexGrow: 1,
              color: "#1DBF73",
              fontWeight: "bold",
              fontSize: { xs: "1.3rem", sm: "1.7rem" },
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            Yuthukama
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
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
              <>
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

                <NotificationMenu />

                <IconButton
                  color="inherit"
                  onClick={() => setShowAIChat((prev) => !prev)}
                  aria-label="AI Chat"
                  sx={{
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(29, 191, 115, 0.1)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <SmartToyIcon sx={{ fontSize: "28px", color: "#1DBF73" }} />
                </IconButton>

                {/* Profile Menu Button */}
                <IconButton
                  onClick={handleProfileMenuOpen}
                  aria-label="Profile menu"
                  aria-controls={profileMenuOpen ? "profile-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={profileMenuOpen ? "true" : undefined}
                  sx={{
                    ml: 1,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <Avatar
                    src={user?.profilePicture}
                    alt={user?.username}
                    sx={{
                      width: 36,
                      height: 36,
                      border: "2px solid #1DBF73",
                      cursor: "pointer",
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </>
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

      {/* Profile Dropdown Menu */}
      <Menu
        id="profile-menu"
        anchorEl={profileAnchorEl}
        open={profileMenuOpen}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
      >
        {/* User Info */}
        <Box sx={{ px: 2, py: 1.5, pb: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {user?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 0.5 }} />

        {/* Profile Link */}
        <MenuItem onClick={handleProfileNavigation} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" sx={{ color: "#1DBF73" }} />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        {/* Settings Link */}
        <MenuItem onClick={handleSettingsNavigation} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" sx={{ color: "#1DBF73" }} />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        {/* Logout */}
        <MenuItem
          onClick={() => {
            setProfileAnchorEl(null);
            handleLogoutClick();
          }}
          sx={{
            py: 1.5,
            color: "#FF6B6B",
            "&:hover": {
              backgroundColor: "rgba(255, 107, 107, 0.1)",
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: "#FF6B6B" }} />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

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
                <ListItemButton onClick={() => handleMobileNavigation("/admin/dashboard")}>
                  <ListItemIcon>
                    <DashboardIcon sx={{ color: "#1DBF73" }} />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleMobileNavigation("/home")}>
                    <ListItemIcon>
                      <HomeIcon sx={{ color: "#1DBF73" }} />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleMobileNavigation("/profile")}>
                    <ListItemIcon>
                      <AccountCircleIcon sx={{ color: "#1DBF73" }} />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleMobileNavigation("/chat")}>
                    <ListItemIcon>
                      <ChatIcon sx={{ color: "#1DBF73" }} />
                    </ListItemIcon>
                    <ListItemText primary="Messages" />
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
                  <ListItemButton onClick={() => handleMobileNavigation("/settings")}>
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
