import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import usePosts from "../hooks/usePosts";
import SearchBar from "../components/SearchBar";
import PostCard from "../components/PostCard";
import GlobalLoadingSpinner from "../components/GlobalLoadingSpinner";

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
  const { posts, error } = usePosts(token);

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
    <>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <GlobalLoadingSpinner actions={["posts/fetchPosts"]} />
      {error ? (
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
