import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";

const PostCard = ({ post, showOfferButton = true }) => {
  console.log(post);
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
      {showOfferButton && (
        <CardActions>
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
        </CardActions>
      )}
    </Card>
  );
};

export default PostCard;
