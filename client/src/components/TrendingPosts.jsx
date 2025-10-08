import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import axios from "axios";
import PostCard from "./PostCard";
import EnhancedSkeleton from "./LoadingStates/EnhancedSkeleton";
import EmptyState from "./EmptyState";

/**
 * TrendingPosts component - Displays trending posts based on engagement
 * @component
 * @param {Object} props - Component props
 * @param {number} props.limit - Number of trending posts to display (default: 5)
 * @param {number} props.days - Number of days to look back (default: 7)
 * @returns {JSX.Element} Trending posts section
 */
const TrendingPosts = ({ limit = 5, days = 7 }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/posts/trending", {
          params: { limit, days },
          withCredentials: true,
        });
        setPosts(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching trending posts:", err);
        setError(
          err.response?.data?.message || "Failed to load trending posts"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, [limit, days]);

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <EnhancedSkeleton variant="post" count={limit} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (posts.length === 0) {
    return <EmptyState variant="no-trending" />;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 3,
          px: 2,
        }}
      >
        <TrendingUpIcon sx={{ color: "#1ac173", fontSize: 28 }} />
        <Typography variant="h5" fontWeight="bold" sx={{ color: "#1ac173" }}>
          Trending Posts
        </Typography>
        <Chip
          label={`Last ${days} days`}
          size="small"
          sx={{
            backgroundColor: "rgba(26, 193, 115, 0.1)",
            color: "#1ac173",
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {posts.map((post, index) => (
          <Box key={post._id} sx={{ position: "relative" }}>
            {/* Trending rank badge */}
            <Chip
              label={`#${index + 1}`}
              size="small"
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                zIndex: 1,
                backgroundColor: "#1ac173",
                color: "white",
                fontWeight: "bold",
              }}
            />
            <PostCard post={post} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TrendingPosts;
