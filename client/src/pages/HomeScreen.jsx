import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";
import usePosts from "../hooks/usePosts";
import SearchBar from "../components/SearchBar";

const HomeScreen = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const { posts, loading, error } = usePosts(localStorage.getItem("token"));

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          Error loading posts: {error}
        </Typography>
      ) : (
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
            padding: 3,
            px: { lg: 10 },
          }}
        >
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </Box>
      )}
    </>
  );
};

export default HomeScreen;
