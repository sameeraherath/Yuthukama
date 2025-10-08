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
} from "@mui/material";
import { useDispatch } from "react-redux";
import { deletePost } from "../features/posts/postsAPI";
import useAuth from "../hooks/useAuth";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShortTextIcon from "@mui/icons-material/ShortText";
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
  const [error, setError] = useState(null);

  const isOwner =
    (user?.id && post?.user?._id && user.id === post.user._id) ||
    (user?.id && post?.user && user.id === post.user);
  const isLiked = post.likes?.includes(user?.id);
  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;

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

  return (
    <Card
      key={post._id}
      component="article"
      role="article"
      aria-label={`Post: ${post.title}`}
      sx={{
        maxWidth: 420,
        borderRadius: BORDER_RADIUS.large,
        boxShadow: SHADOWS.card,
        transition: `${TRANSITIONS.transform}, ${TRANSITIONS.shadow}`,
        ...COMMON_STYLES.cardHoverEffect,
        overflow: "hidden",
        position: "relative",
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

      <CardMedia
        component="img"
        height="240"
        image={post.image}
        alt={`Image for ${post.title}`}
        loading="lazy"
        sx={{
          objectFit: "cover",
          aspectRatio: "16/9",
          width: "100%",
          transition: TRANSITIONS.transform,
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: COLORS.text.primary,
            mb: 2,
          }}
        >
          {post.title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          component="p"
          sx={{
            lineHeight: 1.6,
            color: COLORS.text.secondary,
            ...COMMON_STYLES.textEllipsis(3),
          }}
        >
          {post.description}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          p: 2,
          pt: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2 }}
          role="group"
          aria-label="Post actions"
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={handleLike}
              disabled={isLiking}
              color={isLiked ? "error" : "default"}
              aria-label={isLiked ? "Unlike post" : "Like post"}
              aria-pressed={isLiked}
              size="medium"
            >
              {isLiking ? (
                <CircularProgress size={24} />
              ) : isLiked ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <Typography
              variant="body2"
              color="text.secondary"
              aria-label={`${likesCount} likes`}
            >
              {likesCount}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label={expanded ? "Hide comments" : "Show comments"}
              size="medium"
            >
              <ShortTextIcon />
            </IconButton>
            <Typography
              variant="body2"
              color="text.secondary"
              aria-label={`${commentsCount} comments`}
            >
              {commentsCount}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          {!isOwner && <MessageButton user={post.user} />}
          {isOwner && showDeleteButton && (
            <IconButton
              size="small"
              color="error"
              onClick={handleDelete}
              disabled={isDeleting}
              aria-label="Delete post"
              sx={{
                color: COLORS.text.disabled,
                "&:hover": {
                  color: COLORS.error,
                },
              }}
            >
              {isDeleting ? (
                <CircularProgress size={24} color="error" />
              ) : (
                <DeleteIcon />
              )}
            </IconButton>
          )}
        </Box>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Comments postId={post._id} comments={post.comments} />
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default PostCard;
