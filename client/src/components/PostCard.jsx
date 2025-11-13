import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  IconButton,
  Collapse,
  CircularProgress,
  Alert,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import {
  deletePost,
  toggleSavePost,
  reportPost,
} from "../features/posts/postsAPI";
import useAuth from "../hooks/useAuth";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReportIcon from "@mui/icons-material/Report";
import MessageButton from "./MessageButton";
import Comments from "./Comments";
import { likePost } from "../features/posts/postsSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, BORDER_RADIUS } from "../utils/styleConstants";
import { handleAsync, getErrorMessage, logError } from "../utils/errorHandler";
import { showToast } from "../features/ui/uiSlice";

// Create animated Card component
const MotionCard = motion(Card);

/**
 * Card component for displaying a post with image, title, and description
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.post - Post data
 * @param {string} props.post._id - Post ID
 * @param {string} props.post.title - Post title
 * @param {string} props.post.description - Post description
 * @param {string} props.post.image - Post image URL
 * @param {Object} props.post.user - Post author data
 * @param {string} props.post.user._id - Author ID
 * @param {Function} [props.onDelete] - Callback function when post is deleted
 * @param {boolean} [props.showDeleteButton=true] - Whether to show delete button
 * @returns {JSX.Element} Post card with image and content
 * @example
 * <PostCard
 *   post={{
 *     _id: "123",
 *     title: "My Post",
 *     description: "Post description",
 *     image: "image-url.jpg",
 *     user: { _id: "user123" }
 *   }}
 *   onDelete={(id) => console.log('Post deleted:', id)}
 * />
 */
const PostCard = ({ post, onDelete, showDeleteButton = true, onLike }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isReporting, setIsReporting] = useState(false);

  const isOwner =
    (user?.id && post?.user?._id && user.id === post.user._id) ||
    (user?.id && post?.user && user.id === post.user);
  const isLiked = post.likes?.includes(user?.id);
  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;
  const viewsCount = post.views || 0;

  // Report reason options
  const reportReasons = [
    { value: "spam", label: "Spam" },
    { value: "inappropriate", label: "Inappropriate Content" },
    { value: "harassment", label: "Harassment" },
    { value: "hate_speech", label: "Hate Speech" },
    { value: "violence", label: "Violence" },
    { value: "false_information", label: "False Information" },
    { value: "copyright", label: "Copyright Violation" },
    { value: "other", label: "Other" },
  ];

  // Helper function to format time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const seconds = Math.floor((now - postDate) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return postDate.toLocaleDateString();
  };

  /**
   * Handles menu open
   * @function
   */
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  /**
   * Handles menu close
   * @function
   */
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  /**
   * Handles delete confirmation dialog open
   * @function
   */
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  /**
   * Handles delete confirmation dialog close
   * @function
   */
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  /**
   * Handles report dialog open
   * @function
   */
  const handleReportClick = () => {
    setReportDialogOpen(true);
    handleMenuClose();
  };

  /**
   * Handles report dialog close
   * @function
   */
  const handleReportDialogClose = () => {
    setReportDialogOpen(false);
    setReportReason("");
    setReportDescription("");
  };

  /**
   * Handles post report submission
   * @async
   * @function
   */
  const handleReport = async () => {
    if (!user) {
      dispatch(
        showToast({
          message: "Please login to report posts",
          severity: "warning",
        })
      );
      return;
    }

    if (!reportReason) {
      dispatch(
        showToast({
          message: "Please select a reason for reporting",
          severity: "warning",
        })
      );
      return;
    }

    if (isReporting) return;

    setIsReporting(true);
    setError(null);

    const [err] = await handleAsync(async () => {
      await dispatch(
        reportPost({
          postId: post._id,
          reason: reportReason,
          description: reportDescription,
        })
      ).unwrap();

      dispatch(
        showToast({
          message:
            "Post reported successfully. Thank you for helping keep our community safe.",
          severity: "success",
        })
      );

      handleReportDialogClose();
    }, "PostCard.handleReport");

    if (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      dispatch(
        showToast({
          message: "Failed to report post",
          severity: "error",
        })
      );
      logError(err, "PostCard.handleReport");
    }

    setIsReporting(false);
  };

  /**
   * Handles post deletion with error handling
   * @async
   * @function
   */
  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setError(null);
    setDeleteDialogOpen(false);

    const [err] = await handleAsync(async () => {
      await dispatch(deletePost(post._id)).unwrap();
      dispatch(
        showToast({
          message: "Post deleted successfully",
          severity: "success",
        })
      );
      if (onDelete) onDelete(post._id);
    }, "PostCard.handleDelete");

    if (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      dispatch(
        showToast({
          message: errorMessage,
          severity: "error",
        })
      );
      logError(err, "PostCard.handleDelete");
    }

    setIsDeleting(false);
  };

  /**
   * Handles post like/unlike with error handling
   * @async
   * @function
   */
  const handleLike = async () => {
    if (!user) {
      dispatch(
        showToast({
          message: "Please login to like posts",
          severity: "warning",
        })
      );
      return;
    }

    if (isLiking) return;

    setIsLiking(true);
    setError(null);

    const [err] = await handleAsync(async () => {
      if (onLike) {
        // Use custom like handler if provided
        await onLike(post._id);
      } else {
        // Use default Redux like handler
        await dispatch(likePost(post._id)).unwrap();
      }
    }, "PostCard.handleLike");

    if (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      dispatch(
        showToast({
          message: "Failed to update like",
          severity: "error",
        })
      );
      logError(err, "PostCard.handleLike");
    }

    setIsLiking(false);
  };

  /**
   * Handles comment section expand/collapse
   * @function
   */
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  /**
   * Handles navigation to user profile
   * @function
   */
  const handleProfileClick = () => {
    const userId = post.user?._id || post.user;
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  // Animation variants for card entrance
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  /**
   * Handles post save/unsave with error handling
   * @async
   * @function
   */
  const handleSave = async () => {
    if (!user) {
      dispatch(
        showToast({
          message: "Please login to save posts",
          severity: "warning",
        })
      );
      return;
    }

    if (isSaving) return;

    setIsSaving(true);
    setError(null);

    const [err] = await handleAsync(async () => {
      const result = await toggleSavePost(post._id);
      setIsSaved(result.isSaved);
      dispatch(
        showToast({
          message: result.message,
          severity: "success",
        })
      );
    }, "PostCard.handleSave");

    if (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      dispatch(
        showToast({
          message: "Failed to save post",
          severity: "error",
        })
      );
      logError(err, "PostCard.handleSave");
    }

    setIsSaving(false);
  };

  // Extract hashtags from description
  const renderDescriptionWithHashtags = (text) => {
    const parts = text.split(/(#\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith("#")) {
        return (
          <span key={index} style={{ color: "#10b981", fontWeight: 500 }}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <MotionCard
      key={post._id}
      component="article"
      role="article"
      aria-label={`Post: ${post.title}`}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      sx={{
        maxWidth: "100%",
        borderRadius: { xs: 2, sm: 3 },
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        position: "relative",
        bgcolor: "#ffffff",
        border: "1px solid #f3f4f6",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderColor: "#e5e7eb",
        },
      }}
    >
      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{ m: 2, borderRadius: BORDER_RADIUS.medium }}
        >
          {error}
        </Alert>
      )}

      {/* Header with user info */}
      <Box sx={{ p: { xs: 2, sm: 3 }, pb: { xs: 1.5, sm: 2 } }}>
        <Box
          sx={{
            display: "flex",
            gap: { xs: 1.5, sm: 2 },
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1.5, sm: 2 },
              alignItems: "center",
              flex: 1,
              minWidth: 0,
            }}
          >
            <Avatar
              src={post.user?.avatar || post.user?.profilePicture}
              alt={post.user?.name || post.user?.username || "User"}
              onClick={handleProfileClick}
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                border: "2px solid #f3f4f6",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  borderColor: "#1DBF73",
                  transform: "scale(1.05)",
                },
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                onClick={handleProfileClick}
                sx={{
                  fontWeight: 600,
                  color: "#1a1a1a",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  cursor: "pointer",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  transition: "color 0.2s ease-in-out",
                  "&:hover": {
                    color: "#1DBF73",
                  },
                }}
              >
                {post.user?.name || post.user?.username || "Unknown User"}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#9ca3af",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Posted {getTimeAgo(post.createdAt || new Date())}
              </Typography>
            </Box>
          </Box>

          {/* More options button */}
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{
              color: "#9ca3af",
              p: { xs: 0.5, sm: 1 },
              "&:hover": {
                color: "#1DBF73",
                backgroundColor: "#f0fdf4",
              },
            }}
          >
            <MoreVertIcon sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }} />
          </IconButton>
        </Box>
      </Box>

      {/* Post content */}
      <CardContent
        sx={{
          p: { xs: 2, sm: 3 },
          pt: { xs: 0.5, sm: 1 },
          pb: { xs: 1.5, sm: 2 },
        }}
      >
        {/* Title */}
        {post.title && (
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 700,
              color: "#111827",
              mb: 1,
              fontSize: { xs: "1.05rem", sm: "1.25rem" },
              lineHeight: 1.3,
              wordBreak: "break-word",
            }}
          >
            {post.title}
          </Typography>
        )}

        {/* Description */}
        {post.description && (
          <Typography
            variant="body1"
            component="p"
            sx={{
              lineHeight: 1.6,
              color: "#1a1a1a",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              mb: { xs: 1.5, sm: 2 },
              fontWeight: 400,
              wordBreak: "break-word",
            }}
          >
            {renderDescriptionWithHashtags(post.description)}
          </Typography>
        )}
      </CardContent>

      {/* Post image */}
      <div style={{ overflow: "hidden" }}>
        <CardMedia
          component="img"
          image={post.image}
          alt={`Image for ${post.title}`}
          loading="lazy"
          sx={{
            objectFit: "cover",
            width: "100%",
            maxHeight: { xs: 250, sm: 350, md: 400 },
            height: { xs: 250, sm: 350, md: 400 },
          }}
        />
      </div>

      {/* Actions bar */}
      <CardActions
        sx={{
          p: { xs: 2, sm: 3 },
          pt: { xs: 1.5, sm: 2 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #f3f4f6",
          backgroundColor: "#fafafa",
          flexWrap: "wrap",
          gap: { xs: 1, sm: 0 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 2, sm: 4 },
            flexWrap: "wrap",
          }}
          role="group"
          aria-label="Post actions"
        >
          {/* Likes */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <motion.div
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <IconButton
                onClick={handleLike}
                disabled={isLiking}
                size="small"
                sx={{
                  p: { xs: 0.5, sm: 1 },
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: isLiked
                      ? "rgba(239, 68, 68, 0.1)"
                      : "rgba(16, 185, 129, 0.1)",
                  },
                }}
                aria-label={isLiked ? "Unlike post" : "Like post"}
              >
                {isLiking ? (
                  <CircularProgress size={18} />
                ) : (
                  <motion.div
                    initial={false}
                    animate={
                      isLiked
                        ? {
                            scale: [1, 1.3, 1],
                            rotate: [0, -10, 10, 0],
                          }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.4 }}
                  >
                    {isLiked ? (
                      <FavoriteIcon
                        sx={{
                          width: { xs: 18, sm: 22 },
                          height: { xs: 18, sm: 22 },
                          color: "#ef4444",
                        }}
                      />
                    ) : (
                      <FavoriteIcon
                        sx={{
                          width: { xs: 18, sm: 22 },
                          height: { xs: 18, sm: 22 },
                          color: "#9ca3af",
                        }}
                      />
                    )}
                  </motion.div>
                )}
              </IconButton>
            </motion.div>
            <Typography
              variant="body2"
              sx={{
                color: "#4b5563",
                fontWeight: 600,
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                minWidth: "20px",
              }}
            >
              {likesCount}
            </Typography>
          </Box>

          {/* Comments */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconButton
              onClick={handleExpandClick}
              size="small"
              sx={{
                p: { xs: 0.5, sm: 1 },
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                },
              }}
              aria-label={expanded ? "Hide comments" : "Show comments"}
            >
              <ChatBubbleOutlineIcon
                sx={{
                  width: { xs: 18, sm: 22 },
                  height: { xs: 18, sm: 22 },
                  color: "#9ca3af",
                }}
              />
            </IconButton>
            <Typography
              variant="body2"
              sx={{
                color: "#4b5563",
                fontWeight: 600,
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                minWidth: "20px",
              }}
            >
              {commentsCount}
            </Typography>
          </Box>

          {/* Views */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <VisibilityIcon
              sx={{
                width: { xs: 18, sm: 22 },
                height: { xs: 18, sm: 22 },
                color: "#9ca3af",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "#4b5563",
                fontWeight: 600,
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                minWidth: "20px",
              }}
            >
              {viewsCount.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* Right side actions */}
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          {!isOwner && <MessageButton user={post.user} />}
          {isOwner && showDeleteButton && (
            <IconButton
              size="small"
              onClick={handleDelete}
              disabled={isDeleting}
              aria-label="Delete post"
              sx={{
                color: "#9ca3af",
                borderRadius: 2,
                p: { xs: 0.5, sm: 1 },
                "&:hover": {
                  color: COLORS.error,
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                },
              }}
            >
              {isDeleting ? (
                <CircularProgress size={18} color="error" />
              ) : (
                <DeleteIcon
                  sx={{ width: { xs: 16, sm: 20 }, height: { xs: 16, sm: 20 } }}
                />
              )}
            </IconButton>
          )}
          <IconButton
            onClick={handleSave}
            disabled={isSaving}
            size="small"
            sx={{
              color: isSaved ? "#1DBF73" : "#4b5563",
              borderRadius: 2,
              p: { xs: 0.5, sm: 1 },
              "&:hover": {
                backgroundColor: isSaved
                  ? "rgba(29, 191, 115, 0.1)"
                  : "#f3f4f6",
                color: "#1DBF73",
              },
            }}
            aria-label={isSaved ? "Unsave post" : "Save post"}
          >
            {isSaving ? (
              <CircularProgress size={16} />
            ) : isSaved ? (
              <BookmarkIcon
                sx={{ width: { xs: 16, sm: 20 }, height: { xs: 16, sm: 20 } }}
              />
            ) : (
              <BookmarkBorderIcon
                sx={{ width: { xs: 16, sm: 20 }, height: { xs: 16, sm: 20 } }}
              />
            )}
          </IconButton>
        </Box>
      </CardActions>

      {/* Comments section */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent
          sx={{
            pt: 0,
            borderTop: "1px solid #f3f4f6",
            p: { xs: 2, sm: 3 },
            backgroundColor: "#fafafa",
          }}
        >
          <Comments postId={post._id} comments={post.comments} />
        </CardContent>
      </Collapse>

      {/* More options menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e5e7eb",
            minWidth: 160,
          },
        }}
      >
        {isOwner && (
          <MenuItem
            onClick={handleDeleteClick}
            sx={{
              color: "#ef4444",
              "&:hover": {
                backgroundColor: "rgba(239, 68, 68, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <DeleteIcon sx={{ color: "#ef4444" }} />
            </ListItemIcon>
            <ListItemText primary="Delete Post" />
          </MenuItem>
        )}
        {!isOwner && (
          <MenuItem
            onClick={handleReportClick}
            sx={{
              color: "#f59e0b",
              "&:hover": {
                backgroundColor: "rgba(245, 158, 11, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <ReportIcon sx={{ color: "#f59e0b" }} />
            </ListItemIcon>
            <ListItemText primary="Report Post" />
          </MenuItem>
        )}
      </Menu>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <DialogTitle
          id="delete-dialog-title"
          sx={{ color: "#1a1a1a", fontWeight: 600 }}
        >
          Delete Post
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="delete-dialog-description"
            sx={{ color: "#6b7280" }}
          >
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleDeleteDialogClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              borderColor: "#e5e7eb",
              color: "#6b7280",
              "&:hover": {
                borderColor: "#d1d5db",
                backgroundColor: "#f9fafb",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              backgroundColor: "#ef4444",
              "&:hover": {
                backgroundColor: "#dc2626",
              },
              "&:disabled": {
                backgroundColor: "#fca5a5",
              },
            }}
          >
            {isDeleting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Report dialog */}
      <Dialog
        open={reportDialogOpen}
        onClose={handleReportDialogClose}
        aria-labelledby="report-dialog-title"
        aria-describedby="report-dialog-description"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <DialogTitle
          id="report-dialog-title"
          sx={{ color: "#1a1a1a", fontWeight: 600 }}
        >
          Report Post
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText
            id="report-dialog-description"
            sx={{ color: "#6b7280", mb: 3 }}
          >
            Help us keep our community safe by reporting content that violates
            our guidelines.
          </DialogContentText>

          <FormControl component="fieldset" fullWidth>
            <Typography
              variant="subtitle2"
              sx={{ mb: 2, fontWeight: 600, color: "#374151" }}
            >
              What's the issue with this post?
            </Typography>
            <RadioGroup
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              sx={{ mb: 3 }}
            >
              {reportReasons.map((reason) => (
                <FormControlLabel
                  key={reason.value}
                  value={reason.value}
                  control={<Radio size="small" />}
                  label={reason.label}
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.9rem",
                      color: "#374151",
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Additional details (optional)"
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": {
                  borderColor: "#e5e7eb",
                },
                "&:hover fieldset": {
                  borderColor: "#d1d5db",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1DBF73",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleReportDialogClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              borderColor: "#e5e7eb",
              color: "#6b7280",
              "&:hover": {
                borderColor: "#d1d5db",
                backgroundColor: "#f9fafb",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReport}
            disabled={isReporting || !reportReason}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              backgroundColor: "#f59e0b",
              "&:hover": {
                backgroundColor: "#d97706",
              },
              "&:disabled": {
                backgroundColor: "#fbbf24",
              },
            }}
          >
            {isReporting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              "Report Post"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </MotionCard>
  );
};

export default PostCard;
