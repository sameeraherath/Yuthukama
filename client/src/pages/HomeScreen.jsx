import Navbar from "../components/Navbar";
import { Box } from "@mui/material";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";

const postsData = [
  {
    id: 1,
    title: "Post 1",
    image: "https://placehold.co/600x400",
    description: "This is post 1.",
  },
  {
    id: 2,
    title: "Post 2",
    image: "https://placehold.co/600x400",
    description: "This is post 2.",
  },
  {
    id: 3,
    title: "Post 3",
    image: "https://placehold.co/600x400",
    description: "This is post 3.",
  },
  {
    id: 4,
    title: "Post 4",
    image: "https://placehold.co/600x400",
    description: "This is post 4.",
  },
  {
    id: 5,
    title: "Post 5",
    image: "https://placehold.co/600x400",
    description: "This is post 5.",
  },
];

const HomeScreen = () => {
  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 3,
          p: 3,
          px: { lg: 10 },
        }}
      >
        {postsData.map((post) => (
          <Card key={post.id} sx={{ maxWidth: 420, borderRadius: 5 }}>
            <CardMedia
              component="img"
              height="200"
              image={post.image}
              alt={post.title}
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
              <Button size="small" color="primary">
                Like
              </Button>
              <Button size="small" color="primary">
                Share
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </>
  );
};

export default HomeScreen;
