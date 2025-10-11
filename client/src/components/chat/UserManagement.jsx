import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Block as BlockIcon,
  Report as ReportIcon,
  PersonRemove as PersonRemoveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";

/**
 * UserManagement component - Manages user interactions within conversations
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.user - User object to manage
 * @param {Object} props.conversation - Current conversation object
 * @param {Function} props.onBlockUser - Callback when user is blocked
 * @param {Function} props.onReportUser - Callback when user is reported
 * @param {Function} props.onRemoveUser - Callback when user is removed
 * @returns {JSX.Element} User management interface
 */
const UserManagement = ({ user, conversation, onBlockUser, onReportUser, onRemoveUser }) => {
  const { user: currentUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const open = Boolean(anchorEl);

  useEffect(() => {
    // Check if user is favorited (you can implement this based on your data structure)
    setIsFavorited(false);
    
    // Check if user is blocked (you can implement this based on your data structure)
    setIsBlocked(false);
    
    // Simulate online status (you can implement real-time status)
    setIsOnline(Math.random() > 0.5);
  }, [user]);

  /**
   * Handle menu open
   */
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Handle menu close
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handle favorite toggle
   */
  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
    handleMenuClose();
  };

  /**
   * Handle block user
   */
  const handleBlockUser = () => {
    setIsBlocked(true);
    if (onBlockUser) {
      onBlockUser(user);
    }
    handleMenuClose();
  };

  /**
   * Handle report user
   */
  const handleReportUser = () => {
    if (onReportUser) {
      onReportUser(user);
    }
    handleMenuClose();
  };

  /**
   * Handle remove user
   */
  const handleRemoveUser = () => {
    if (onRemoveUser) {
      onRemoveUser(user);
    }
    handleMenuClose();
  };

  /**
   * Get user display name
   */
  const getUserDisplayName = () => {
    return user?.username || user?.email || "Unknown User";
  };

  /**
   * Get user initials
   */
  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  /**
   * Get user status color
   */
  const getStatusColor = () => {
    if (isBlocked) return "#ef4444";
    if (isOnline) return "#10b981";
    return "#6b7280";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          backgroundColor: "white",
          borderBottom: "1px solid #e4e6eb",
          position: "relative",
        }}
      >
        {/* User Info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={user?.profilePicture}
              sx={{
                width: 48,
                height: 48,
                backgroundColor: "#1DBF73",
                border: "2px solid white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {getUserInitials()}
            </Avatar>
            
            {/* Online Status Indicator */}
            <Box
              sx={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: getStatusColor(),
                border: "2px solid white",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
            />
          </Box>

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  fontSize: "1rem",
                  color: "#050505",
                }}
              >
                {getUserDisplayName()}
              </Typography>
              
              {/* Status Chips */}
              <Box sx={{ display: "flex", gap: 0.5 }}>
                {isFavorited && (
                  <Chip
                    icon={<StarIcon />}
                    label="Favorite"
                    size="small"
                    sx={{
                      backgroundColor: "#fef3c7",
                      color: "#d97706",
                      fontSize: "0.7rem",
                      height: 20,
                    }}
                  />
                )}
                
                {isBlocked && (
                  <Chip
                    icon={<BlockIcon />}
                    label="Blocked"
                    size="small"
                    sx={{
                      backgroundColor: "#fee2e2",
                      color: "#dc2626",
                      fontSize: "0.7rem",
                      height: 20,
                    }}
                  />
                )}
                
                {isOnline && (
                  <Chip
                    label="Online"
                    size="small"
                    sx={{
                      backgroundColor: "#d1fae5",
                      color: "#059669",
                      fontSize: "0.7rem",
                      height: 20,
                    }}
                  />
                )}
              </Box>
            </Box>
            
            <Typography
              variant="body2"
              sx={{
                color: "#65676b",
                fontSize: "0.8rem",
              }}
            >
              {isOnline ? "Active now" : "Last seen recently"}
            </Typography>
          </Box>
        </Box>

        {/* Action Menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Favorite Button */}
          <Tooltip title={isFavorited ? "Remove from favorites" : "Add to favorites"}>
            <IconButton
              size="small"
              onClick={handleFavoriteToggle}
              sx={{
                color: isFavorited ? "#f59e0b" : "#6b7280",
                "&:hover": {
                  backgroundColor: "#fef3c7",
                  color: "#f59e0b",
                },
              }}
            >
              {isFavorited ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
          </Tooltip>

          {/* More Options Menu */}
          <Tooltip title="More options">
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{
                color: "#6b7280",
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                minWidth: 200,
              },
            }}
          >
            <MenuItem onClick={handleFavoriteToggle}>
              <ListItemIcon>
                {isFavorited ? <StarIcon sx={{ color: "#f59e0b" }} /> : <StarBorderIcon />}
              </ListItemIcon>
              <ListItemText>
                {isFavorited ? "Remove from favorites" : "Add to favorites"}
              </ListItemText>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleBlockUser} disabled={isBlocked}>
              <ListItemIcon>
                <BlockIcon sx={{ color: "#ef4444" }} />
              </ListItemIcon>
              <ListItemText>
                {isBlocked ? "Unblock user" : "Block user"}
              </ListItemText>
            </MenuItem>

            <MenuItem onClick={handleReportUser}>
              <ListItemIcon>
                <ReportIcon sx={{ color: "#f59e0b" }} />
              </ListItemIcon>
              <ListItemText>Report user</ListItemText>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleRemoveUser}>
              <ListItemIcon>
                <PersonRemoveIcon sx={{ color: "#ef4444" }} />
              </ListItemIcon>
              <ListItemText>Remove from conversation</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </motion.div>
  );
};

export default UserManagement;

