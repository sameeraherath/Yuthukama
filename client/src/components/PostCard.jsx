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

const PostCard = ({ post, showOfferButton = true, onDelete }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isOwner = user?._id && post?.user?._id && user._id === post.user._id;

  console.log("User ID:", user?._id);
  console.log("Post User ID:", post?.user);
  console.log("Is Owner:", isOwner);

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
        {showOfferButton && (
          <Button
            size="small"
            variant="contained"
            sx={{
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: 5,
              padding: "10px 20px",
              backgroundColor: "#1dbf73",
            }}
          >
            Offer Support
          </Button>
        )}
        {isOwner && (
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            sx={{
              border: "none",
              padding: "5px 15px",
            }}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default PostCard;
