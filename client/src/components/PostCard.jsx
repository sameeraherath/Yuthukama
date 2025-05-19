import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { deletePost } from "../features/posts/postsAPI";
import useAuth from "../hooks/useAuth";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const isOwner = user?._id && post?.user?._id && user._id === post.user._id;

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
    <Card key={post._id} sx={{ maxWidth: 420, borderRadius: 5 }}>
      <CardMedia
        component="img"
        height="200"
        image={post.image}
        alt={post.title}
        sx={{
          objectFit: "cover",
          aspectRatio: "16/9",
          width: "100%",
        }}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post.description}
        </Typography>
      </CardContent>
      <CardActions>
        {!isOwner && <MessageButton user={post.user} />}
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
