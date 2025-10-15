import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment, deleteComment } from "../features/posts/postsAPI";
import useAuth from "../hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { COLORS, BORDER_RADIUS, COMMON_STYLES } from "../utils/styleConstants";
import { handleAsync, getErrorMessage, logError } from "../utils/errorHandler";
import { showToast } from "../features/ui/uiSlice";
import { CommentsSkeleton } from "./LoadingStates/SkeletonLoader";

const Comments = ({ postId, comments = [] }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading] = useState(false); // For future implementation

  /**
   * Handles comment submission with error handling
   * @async
   * @function
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!newComment.trim()) {
      dispatch(
        showToast({
          message: "Comment cannot be empty",
          severity: "warning",
        })
      );
      return;
    }

    if (newComment.length > 1000) {
      dispatch(
        showToast({
          message: "Comment must be 1000 characters or less",
          severity: "warning",
        })
      );
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const [err] = await handleAsync(async () => {
      await dispatch(addComment({ postId, content: newComment })).unwrap();
      setNewComment("");
      dispatch(
        showToast({
          message: "Comment added successfully",
          severity: "success",
        })
      );
    }, "Comments.handleSubmit");

    if (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      dispatch(
        showToast({
          message: errorMessage,
          severity: "error",
        })
      );
      logError(err, "Comments.handleSubmit");
    }

    setIsSubmitting(false);
  };

  /**
   * Handles comment deletion with error handling
   * @async
   * @function
   */
  const handleDelete = async (commentId) => {
    if (deletingCommentId) return;

    setDeletingCommentId(commentId);
    setError(null);

    const [err] = await handleAsync(async () => {
      await dispatch(deleteComment({ postId, commentId })).unwrap();
      dispatch(
        showToast({
          message: "Comment deleted successfully",
          severity: "success",
        })
      );
    }, "Comments.handleDelete");

    if (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      dispatch(
        showToast({
          message: errorMessage,
          severity: "error",
        })
      );
      logError(err, "Comments.handleDelete");
    }

    setDeletingCommentId(null);
  };

  return (
    <Box sx={{ mt: 2 }} role="region" aria-label="Comments section">
      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{ mb: 2, borderRadius: BORDER_RADIUS.medium }}
        >
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} aria-label="Add comment form">
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            variant="outlined"
            disabled={isSubmitting}
            inputProps={{
              "aria-label": "Comment text",
              maxLength: 1000,
            }}
            helperText={`${newComment.length}/1000 characters`}
            error={newComment.length > 1000}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: BORDER_RADIUS.large,
                "&.Mui-focused fieldset": {
                  borderColor: COLORS.primary,
                },
                "&:hover fieldset": {
                  borderColor: COLORS.primary,
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={!newComment.trim() || newComment.length > 1000 || isSubmitting}
            aria-label="Post comment"
            sx={{
              bgcolor: COLORS.primary,
              "&:hover": {
                bgcolor: COLORS.primaryHover,
              },
              borderRadius: BORDER_RADIUS.large,
              textTransform: "none",
              minWidth: 60,
              height: 32,
              fontSize: "0.75rem",
              px: 1.5,
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              "Post"
            )}
          </Button>
        </Box>
      </form>

      {isLoading ? (
        <CommentsSkeleton count={3} />
      ) : (
        <List role="list" aria-label="Comments list">
          {comments.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 2 }}
              role="status"
            >
              No comments yet. Be the first to comment!
            </Typography>
          ) : (
            comments.map((comment) => (
              <ListItem
                key={comment._id}
                alignItems="flex-start"
                secondaryAction={
                  (comment.user._id === user?.id ||
                    comment.user === user?.id) && (
                    <IconButton
                      edge="end"
                      aria-label={`Delete comment by ${comment.user.username}`}
                      onClick={() => handleDelete(comment._id)}
                      disabled={deletingCommentId === comment._id}
                      size="small"
                      sx={{
                        color: COLORS.text.disabled,
                        "&:hover": {
                          color: COLORS.error,
                        },
                      }}
                    >
                      {deletingCommentId === comment._id ? (
                        <CircularProgress size={20} color="error" />
                      ) : (
                        <DeleteIcon fontSize="small" />
                      )}
                    </IconButton>
                  )
                }
                sx={{ px: 0 }}
                role="listitem"
              >
                <ListItemAvatar>
                  <Avatar
                    src={comment.user.profilePicture}
                    alt={`${comment.user.username}'s avatar`}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="subtitle2"
                        component="span"
                        fontWeight={600}
                      >
                        {comment.user.username}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        component="time"
                        dateTime={comment.createdAt}
                      >
                        • {formatDistanceToNow(new Date(comment.createdAt))} ago
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{ mt: 0.5, wordBreak: "break-word" }}
                      component="p"
                    >
                      {comment.content}
                    </Typography>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      )}
    </Box>
  );
};

export default Comments;
