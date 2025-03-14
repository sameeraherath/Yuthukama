import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

const HomeScreen = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/posts`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        console.log(data);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPost();
  }, []);

  return (
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
      {posts.map((post) => {
        return <PostCard key={post._id} post={post} />;
      })}
    </Box>
  );
};

export default HomeScreen;
