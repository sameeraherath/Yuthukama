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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

import useAuth from "../hooks/useAuth";
import usePosts from "../hooks/usePosts";
import SearchBar from "../components/SearchBar";
import PostCard from "../components/PostCard";
import TrendingPosts from "../components/TrendingPosts";
import RecommendedUsers from "../components/RecommendedUsers";
import EnhancedSkeleton from "../components/LoadingStates/EnhancedSkeleton";
import EmptyState from "../components/EmptyState";
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
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupIcon from "@mui/icons-material/Group";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import NotificationMenu from "../components/NotificationMenu";
import AIChatBot from "../components/AIChatBot";

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
  const [showAIChat, setShowAIChat] = useState(false);

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

  const token = localStorage.getItem("token");
  const { posts, error, loading } = usePosts(token);

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
   * Filters posts based on search term and active tab
   */
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Add tab-based filtering logic here if needed
    return matchesSearch;
  });

  /**
   * Handle tab change
   */
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  /**
   * Navigation items for sidebar
   */
  const navigationItems = [
    { icon: <HomeIcon />, label: "Home", path: "/home", active: true },
    { icon: <ExploreIcon />, label: "Explore", path: "/explore" },
    { icon: <NotificationsIcon />, label: "Notifications", component: "notification" },
    { icon: <ChatIcon />, label: "Messages", path: "/chat" },
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
      }}
    >
      {/* Left Sidebar Navigation - Desktop */}
      <Paper
        elevation={0}
        sx={{
          width: { xs: 0, md: 280 },
          minHeight: "100vh",
          backgroundColor: "white",
          borderRight: "1px solid #e5e7eb",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          position: "fixed",
          left: 0,
          top: 64, // Account for navbar height
          zIndex: 100,
        }}
      >
        {/* User Profile Section */}
        <Box sx={{ p: 3, borderBottom: "1px solid #e5e7eb" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
        </Box>

        {/* Navigation Menu */}
        <Box sx={{ flex: 1, p: 2 }}>
          <List>
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
                    "&:hover": {
                      backgroundColor: "#f0fdf4",
                      color: "#1DBF73",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: item.active ? "#1DBF73" : "#6b7280",
                      minWidth: 40,
                    }}
                  >
                    {item.component === "notification" ? (
                      <NotificationMenu />
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: item.active ? 600 : 500,
                      fontSize: "0.95rem",
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
                  "&:hover": {
                    backgroundColor: "#f0fdf4",
                    color: "#1DBF73",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "#6b7280",
                    minWidth: 40,
                  }}
                >
                  <SmartToyIcon />
                </ListItemIcon>
                <ListItemText
                  primary="AI Assistant"
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        {/* Create Post Button */}
        <Box sx={{ p: 2, borderTop: "1px solid #e5e7eb" }}>
          <Fab
            size="medium"
            onClick={() => navigate("/create-post")}
            sx={{
              width: "100%",
              height: 48,
              borderRadius: 2,
              background: "linear-gradient(135deg, #1DBF73 0%, #169c5f 100%)",
              boxShadow: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #169c5f 0%, #117a47 100%)",
                boxShadow: "0 4px 12px rgba(29, 191, 115, 0.3)",
              },
            }}
          >
            <AddIcon sx={{ color: "white" }} />
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
            width: 280,
            backgroundColor: "white",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" fontWeight={700} color="#1DBF73">
              Yuthukama
            </Typography>
            <IconButton onClick={() => setMobileDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {/* User Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, p: 2, backgroundColor: "#f9fafb", borderRadius: 2 }}>
            <Avatar
              src={user?.profilePicture}
              alt={user?.username}
              sx={{ width: 48, height: 48, border: "2px solid #1DBF73" }}
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

          {/* Navigation */}
          <List>
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
                    "&:hover": {
                      backgroundColor: "#f0fdf4",
                      color: "#1DBF73",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: item.active ? "#1DBF73" : "#6b7280", minWidth: 40 }}>
                    {item.component === "notification" ? (
                      <NotificationMenu />
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: item.active ? 600 : 500,
                      fontSize: "0.95rem",
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
                  "&:hover": {
                    backgroundColor: "#f0fdf4",
                    color: "#1DBF73",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#6b7280", minWidth: 40 }}>
                  <SmartToyIcon />
                </ListItemIcon>
                <ListItemText
                  primary="AI Assistant"
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          marginLeft: { xs: 0, md: "280px" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Mobile Header */}
            <Box
              sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            backgroundColor: "white",
            borderBottom: "1px solid #e5e7eb",
                position: "sticky",
                top: 64,
                zIndex: 10,
          }}
        >
          <IconButton onClick={() => setMobileDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700} color="#1DBF73">
            Yuthukama
          </Typography>
          <IconButton onClick={() => navigate("/create-post")}>
            <AddIcon />
          </IconButton>
        </Box>

        {/* Feed Content */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", p: { xs: 2, md: 3 } }}>
          <Box sx={{ width: "100%", maxWidth: 600 }}>
            {/* Feed Tabs */}
            <Paper
              elevation={0}
              sx={{
                mb: 3,
                backgroundColor: "white",
                borderRadius: 2,
                border: "1px solid #e5e7eb",
              }}
            >
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="standard"
                centered
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    minWidth: "auto",
                    px: 3,
                  },
                  "& .Mui-selected": {
                    color: "#1DBF73",
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#1DBF73",
                  },
                }}
              >
                <Tab label="For You" />
                <Tab label="Following" />
                <Tab label="Trending" />
              </Tabs>
            </Paper>

            {/* Search Bar */}
            <Box sx={{ mb: 3 }}>
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </Box>

            {/* Posts Feed */}
            {error ? (
                <Alert
                  severity="error"
                  icon={<ErrorOutlineIcon />}
                sx={{ borderRadius: 2, mb: 2 }}
                >
                  <Typography variant="body2">{error}</Typography>
                </Alert>
            ) : loading ? (
              <Box sx={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: 2,
                alignItems: "center",
                width: "100%"
              }}>
                <EnhancedSkeleton variant="post" count={3} />
              </Box>
            ) : filteredPosts.length === 0 ? (
                  <EmptyState
                    variant={searchTerm ? "no-search-results" : "no-posts"}
                    searchTerm={searchTerm}
                    onAction={
                      searchTerm
                        ? () => setSearchTerm("")
                        : () => navigate("/create-post")
                    }
                  />
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: 2,
                  alignItems: "center",
                  width: "100%"
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
          p: 3,
          backgroundColor: "transparent",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <RecommendedUsers limit={5} />
                    <TrendingPosts limit={5} days={7} />
                  </Box>
              </Box>

      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <Fab
          size="small"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            backgroundColor: "white",
            color: "#1DBF73",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "#f0fdf4",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
            zIndex: 1000,
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
      {/* AI Chatbot */}
      {showAIChat && <AIChatBot onClose={() => setShowAIChat(false)} />}
    </Box>
  );
};

export default HomeScreen;
