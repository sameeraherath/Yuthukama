import { useEffect, useState } from "react";
import { Box, Typography, Alert, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import usePosts from "../hooks/usePosts";
import SearchBar from "../components/SearchBar";
import PostCard from "../components/PostCard";
import { PostCardSkeleton } from "../components/LoadingStates/SkeletonLoader";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SearchOffIcon from "@mui/icons-material/SearchOff";

/**
 * Home screen component that displays a grid of posts with search functionality
 * @component
 * @returns {JSX.Element} The home screen layout with posts grid
 * @example
 * // In App.jsx
 * <Route path="/home" element={<HomeScreen />} />
 */
const HomeScreen = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Effect hook to redirect unauthenticated users to login
   * @effect
   * @listens {isAuthenticated} - Authentication status
   * @listens {navigate} - Navigation function
   */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const token = localStorage.getItem("token");
  const { posts, error, loading } = usePosts(token);

  /**
   * Filters posts based on search term
   * @type {Array<Object>}
   * @property {string} title - Post title
   * @property {string} description - Post description
   */
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {error ? (
        <Alert
          severity="error"
          icon={<ErrorOutlineIcon />}
          sx={{
            mt: 4,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body1" fontWeight={500}>
            Error loading posts: {error}
          </Typography>
        </Alert>
      ) : loading ? (
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
            mt: 3,
          }}
          role="status"
          aria-label="Loading posts"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </Box>
      ) : filteredPosts.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            gap: 2,
          }}
          role="status"
        >
          <SearchOffIcon sx={{ fontSize: 80, color: "text.disabled" }} />
          <Typography variant="h6" color="text.secondary">
            {searchTerm
              ? "No posts found matching your search"
              : "No posts available"}
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Be the first to create a post!"}
          </Typography>
        </Box>
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
            mt: 3,
          }}
          role="feed"
          aria-label="Posts feed"
        >
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default HomeScreen;
