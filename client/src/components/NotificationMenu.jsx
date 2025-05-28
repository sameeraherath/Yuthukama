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
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
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
        if (notification.relatedPost) {
          navigate(`/post/${notification.relatedPost._id}`);
        }
        break;
      case "follow":
        navigate(`/profile/${notification.sender._id}`);
        break;
      case "message":
        navigate(`/chat/${notification.sender._id}`);
        break;
      default:
        break;
    }
    handleClose();
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllNotificationsAsRead());
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
          {unreadCount > 0 && (
            <Button size="small" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
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
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Typography variant="body2">{notification.content}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </Typography>
              </Box>
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
