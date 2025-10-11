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
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { deletePost } from "../features/posts/postsAPI";
import useAuth from "../hooks/useAuth";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MessageButton from "./MessageButton";
import Comments from "./Comments";
import { likePost } from "../features/posts/postsSlice";
import { useState } from "react";
import {
  COLORS,
  BORDER_RADIUS,
  COMMON_STYLES,
  SHADOWS,
  TRANSITIONS,
} from "../utils/styleConstants";
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
const PostCard = ({ post, onDelete, showDeleteButton = true }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);

  const isOwner =
    (user?.id && post?.user?._id && user.id === post.user._id) ||
    (user?.id && post?.user && user.id === post.user);
  const isLiked = post.likes?.includes(user?.id);
  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;
  const viewsCount = post.views || 0;

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
   * Handles post deletion with error handling
   * @async
   * @function
   */
  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setError(null);

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
      await dispatch(likePost(post._id)).unwrap();
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

  // Animation variants for card entrance and hover
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
    hover: {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    dispatch(
      showToast({
        message: isSaved ? "Post unsaved" : "Post saved",
        severity: "success",
      })
    );
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
      whileHover="hover"
      variants={cardVariants}
      sx={{
        maxWidth: "100%",
        borderRadius: 3,
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
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flex: 1 }}>
            <Avatar
              src={post.user?.avatar || post.user?.profilePicture}
              alt={post.user?.name || post.user?.username || "User"}
              sx={{ 
                width: 48, 
                height: 48,
                border: "2px solid #f3f4f6",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  borderColor: "#1DBF73",
                  transform: "scale(1.05)",
                },
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#1a1a1a",
                  fontSize: "1rem",
                  cursor: "pointer",
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
                  fontSize: "0.875rem",
                }}
              >
                Posted {getTimeAgo(post.createdAt || new Date())}
              </Typography>
            </Box>
          </Box>
          
          {/* More options button */}
          <IconButton
            size="small"
            sx={{
              color: "#9ca3af",
              "&:hover": {
                color: "#1DBF73",
                backgroundColor: "#f0fdf4",
              },
            }}
          >
            <Typography sx={{ fontSize: "1.2rem", fontWeight: 600 }}>⋯</Typography>
          </IconButton>
        </Box>
      </Box>

      {/* Post content */}
      <CardContent sx={{ p: 3, pt: 0, pb: 2 }}>
        <Typography
          variant="body1"
          component="p"
          sx={{
            lineHeight: 1.6,
            color: "#1a1a1a",
            fontSize: "1rem",
            mb: 2,
            fontWeight: 400,
          }}
        >
          {renderDescriptionWithHashtags(post.description || post.title)}
        </Typography>
      </CardContent>

      {/* Post image */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{ overflow: "hidden" }}
      >
        <CardMedia
          component="img"
          image={post.image}
          alt={`Image for ${post.title}`}
          loading="lazy"
          sx={{
            objectFit: "cover",
            width: "100%",
            maxHeight: 400,
          }}
        />
      </motion.div>

      {/* Actions bar */}
      <CardActions
        sx={{
          p: 3,
          pt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #f3f4f6",
          backgroundColor: "#fafafa",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 4 }}
          role="group"
          aria-label="Post actions"
        >
          {/* Likes */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <motion.div
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <IconButton
                onClick={handleLike}
                disabled={isLiking}
                size="small"
                sx={{ 
                  p: 1,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: isLiked ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                  },
                }}
                aria-label={isLiked ? "Unlike post" : "Like post"}
              >
                {isLiking ? (
                  <CircularProgress size={20} />
                ) : (
                  <motion.div
                    initial={false}
                    animate={isLiked ? { 
                      scale: [1, 1.3, 1],
                      rotate: [0, -10, 10, 0]
                    } : { scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    {isLiked ? (
                      <FavoriteIcon
                        sx={{ width: 22, height: 22, color: "#ef4444" }}
                      />
                    ) : (
                      <FavoriteIcon
                        sx={{ width: 22, height: 22, color: "#9ca3af" }}
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
                fontSize: "0.9rem",
                minWidth: "20px",
              }}
            >
              {likesCount}
            </Typography>
          </Box>

          {/* Comments */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={handleExpandClick}
              size="small"
              sx={{ 
                p: 1,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                },
              }}
              aria-label={expanded ? "Hide comments" : "Show comments"}
            >
              <ChatBubbleOutlineIcon
                sx={{ width: 22, height: 22, color: "#9ca3af" }}
              />
            </IconButton>
            <Typography
              variant="body2"
              sx={{ 
                color: "#4b5563", 
                fontWeight: 600, 
                fontSize: "0.9rem",
                minWidth: "20px",
              }}
            >
              {commentsCount}
            </Typography>
          </Box>

          {/* Views */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <VisibilityIcon sx={{ width: 22, height: 22, color: "#9ca3af" }} />
            <Typography
              variant="body2"
              sx={{ 
                color: "#4b5563", 
                fontWeight: 600, 
                fontSize: "0.9rem",
                minWidth: "20px",
              }}
            >
              {viewsCount.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* Right side actions */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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
                "&:hover": {
                  color: COLORS.error,
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                },
              }}
            >
              {isDeleting ? (
                <CircularProgress size={20} color="error" />
              ) : (
                <DeleteIcon sx={{ width: 20, height: 20 }} />
              )}
            </IconButton>
          )}
          <IconButton
            onClick={handleSave}
            size="small"
            sx={{
              color: "#4b5563",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#f3f4f6",
                color: "#1DBF73",
              },
            }}
          >
            {isSaved ? (
              <BookmarkIcon sx={{ width: 20, height: 20 }} />
            ) : (
              <BookmarkBorderIcon sx={{ width: 20, height: 20 }} />
            )}
          </IconButton>
        </Box>
      </CardActions>

      {/* Comments section */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0, borderTop: "1px solid #f3f4f6" }}>
          <Comments postId={post._id} comments={post.comments} />
        </CardContent>
      </Collapse>
    </MotionCard>
  );
};

export default PostCard;
