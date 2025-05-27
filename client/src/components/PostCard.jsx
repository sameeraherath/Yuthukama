import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { deletePost } from "../features/posts/postsAPI";
import useAuth from "../hooks/useAuth";
import DeleteIcon from "@mui/icons-material/Delete";
import MessageButton from "./MessageButton";

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
  const isOwner =
    (user?.id && post?.user?._id && user.id === post.user._id) ||
    (user?.id && post?.user && user.id === post.user);

  /**
   * Handles post deletion
   * @async
   * @function
   */
  const handleDelete = async () => {
    await dispatch(deletePost(post._id));
    if (onDelete) onDelete(post._id);
  };

  return (
    <Card
      key={post._id}
      sx={{
        maxWidth: 420,
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        },
        overflow: "hidden",
        position: "relative",
      }}
    >
      <CardMedia
        component="img"
        height="240"
        image={post.image}
        alt={post.title}
        sx={{
          objectFit: "cover",
          aspectRatio: "16/9",
          width: "100%",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: "#2c3e50",
            mb: 2,
          }}
        >
          {post.title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            lineHeight: 1.6,
            color: "#666",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
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
        <Box sx={{ display: "flex", gap: 1 }}>
          {!isOwner && <MessageButton user={post.user} />}
        </Box>
        {isOwner && showDeleteButton && (
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon style={{ fontSize: "28px" }} />}
            onClick={handleDelete}
            sx={{
              border: "none",
              padding: "5px 15px",
              color: "#B0B0B0",
            }}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default PostCard;
