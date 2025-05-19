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

const PostCard = ({
  post,
  showOfferButton = true,
  onDelete,
  showDeleteButton = true,
}) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwner = user?._id && post?.user?._id && user._id === post.user._id;
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
