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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment, deleteComment } from "../features/posts/postsAPI";
import useAuth from "../hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

const Comments = ({ postId, comments = [] }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await dispatch(addComment({ postId, content: newComment }));
    setNewComment("");
  };

  const handleDelete = async (commentId) => {
    await dispatch(deleteComment({ postId, commentId }));
  };

  return (
    <Box sx={{ mt: 2 }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
                "&.Mui-focused fieldset": {
                  borderColor: "#1DBF73",
                },
                "&:hover fieldset": {
                  borderColor: "#1DBF73",
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!newComment.trim()}
            sx={{
              bgcolor: "#1DBF73",
              "&:hover": {
                bgcolor: "#18a364",
              },
              borderRadius: 4,
              textTransform: "none",
            }}
          >
            Post
          </Button>
        </Box>
      </form>

      <List>
        {comments.map((comment) => (
          <ListItem
            key={comment._id}
            alignItems="flex-start"
            secondaryAction={
              (comment.user._id === user?.id || comment.user === user?.id) && (
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(comment._id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )
            }
            sx={{ px: 0 }}
          >
            <ListItemAvatar>
              <Avatar
                src={comment.user.profilePicture}
                alt={comment.user.username}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="subtitle2" component="span">
                    {comment.user.username}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    component="span"
                  >
                    • {formatDistanceToNow(new Date(comment.createdAt))} ago
                  </Typography>
                </Box>
              }
              secondary={
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ mt: 0.5 }}
                >
                  {comment.content}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Comments;
