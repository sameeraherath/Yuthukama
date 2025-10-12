import { useEffect, useState } from "react";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
  Button,
  Divider,
  Avatar,
  ListItemIcon,
  ListItemText,
  Chip,
  Tooltip,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MessageIcon from "@mui/icons-material/Message";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../features/notifications/notificationsSlice";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const NotificationMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, unreadCount, loading } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Get icon for notification type
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

  // Get color for notification type
  const getNotificationColor = (type) => {
    switch (type) {
      case "like":
        return "#e91e63";
      case "comment":
        return "#2196f3";
      case "follow":
        return "#4caf50";
      case "message":
        return "#ff9800";
      case "mention":
        return "#9c27b0";
      default:
        return "#666";
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
    handleClose();
  };

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    await dispatch(deleteNotification(notificationId));
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllNotificationsAsRead());
  };

  const handleDeleteAll = async () => {
    await dispatch(deleteAllNotifications());
    handleClose();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{ fontSize: "28px", color: "#1DBF73" }} />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 2,
            width: 360,
            maxHeight: 400,
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Notifications</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {unreadCount > 0 && (
              <Button size="small" onClick={handleMarkAllAsRead}>
                Mark all as read
              </Button>
            )}
            {items.length > 0 && (
              <Tooltip title="Delete all notifications">
                <IconButton size="small" onClick={handleDeleteAll}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
        <Divider />
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress size={24} sx={{ color: "#1DBF73" }} />
          </Box>
        ) : items.length > 0 ? (
          items.map((notification) => (
            <MenuItem
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                whiteSpace: "normal",
                bgcolor: notification.isRead ? "transparent" : "action.hover",
                position: "relative",
                py: 1.5,
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
                      bgcolor: getNotificationColor(notification.type),
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
                    <Chip
                      label={notification.type}
                      size="small"
                      sx={{
                        bgcolor: getNotificationColor(notification.type),
                        color: "white",
                        fontSize: "0.7rem",
                        height: 20,
                      }}
                    />
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
              <Tooltip title="Delete notification">
                <IconButton
                  size="small"
                  onClick={(e) => handleDeleteNotification(e, notification._id)}
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </MenuItem>
          ))
        ) : (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationMenu;
