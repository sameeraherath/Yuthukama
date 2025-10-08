import { useEffect, useState } from "react";
import { Box, Typography, Alert, Container, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import usePosts from "../hooks/usePosts";
import SearchBar from "../components/SearchBar";
import AdvancedSearch from "../components/AdvancedSearch";
import PostCard from "../components/PostCard";
import TrendingPosts from "../components/TrendingPosts";
import RecommendedUsers from "../components/RecommendedUsers";
import EnhancedSkeleton from "../components/LoadingStates/EnhancedSkeleton";
import EmptyState from "../components/EmptyState";
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
      {/* Advanced search */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <AdvancedSearch />
      </Box>

      {/* Main content with sidebar */}
      <Grid container spacing={3}>
        {/* Main posts feed */}
        <Grid item xs={12} lg={8}>
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
                  md: "repeat(2, 1fr)",
                },
                gap: 3,
                mt: 3,
              }}
              role="status"
              aria-label="Loading posts"
            >
              <EnhancedSkeleton variant="post" count={6} />
            </Box>
          ) : filteredPosts.length === 0 ? (
            <EmptyState
              variant={searchTerm ? "no-search-results" : "no-posts"}
              searchTerm={searchTerm}
              onAction={
                searchTerm
                  ? () => setSearchTerm("")
                  : () => navigate("/create-post")
              }
            />
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "repeat(2, 1fr)",
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
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <RecommendedUsers limit={5} />
            <TrendingPosts limit={5} days={7} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomeScreen;
