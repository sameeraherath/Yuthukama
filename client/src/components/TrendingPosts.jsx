import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import axios from "../utils/axiosConfig";
import EnhancedSkeleton from "./LoadingStates/EnhancedSkeleton";

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
        console.log("Fetching trending posts with params:", { limit, days });

        const response = await axios.get("/api/posts/trending", {
          params: { limit, days },
        });

        console.log("Trending posts response:", response.data);

        // Handle both response.data and response.data.posts formats
        const postsData = Array.isArray(response.data)
          ? response.data
          : response.data?.posts || [];

        console.log(
          "Posts data extracted:",
          postsData,
          "Length:",
          postsData.length
        );
        setPosts(postsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching trending posts:", err);
        console.error("Error response:", err.response?.data);
        setError(
          err.response?.data?.message || "Failed to load trending posts"
        );
        setPosts([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, [limit, days]);

  if (loading) {
    return (
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          overflow: "hidden",
          bgcolor: "#ffffff",
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#374151",
              mb: 2.5,
              fontSize: "1rem",
            }}
          >
            Trending Posts
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8 }}>
            {[1, 2, 3].map((i) => (
              <Box
                key={i}
                sx={{ display: "flex", gap: 1.2, alignItems: "center", p: 1.2 }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: "#f3f4f6",
                    borderRadius: "50%",
                  }}
                />
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: "#f3f4f6",
                    borderRadius: 2,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      width: "85%",
                      height: 12,
                      bgcolor: "#f3f4f6",
                      borderRadius: 1,
                      mb: 0.8,
                    }}
                  />
                  <Box
                    sx={{
                      width: "50%",
                      height: 10,
                      bgcolor: "#f3f4f6",
                      borderRadius: 1,
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          bgcolor: "#ffffff",
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#374151",
              mb: 2,
              fontSize: "1rem",
            }}
          >
            Trending Posts
          </Typography>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        overflow: "hidden",
        bgcolor: "#ffffff",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 2.5, height: "100%" }}>
        {/* Header */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#1f2937",
            mb: 2.5,
            fontSize: "1.05rem",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <TrendingUpIcon sx={{ fontSize: 20, color: "#10b981" }} />
          Trending Posts
        </Typography>

        {/* Empty State */}
        {!Array.isArray(posts) || posts.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 3,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                bgcolor: "rgba(16, 185, 129, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <TrendingUpIcon
                sx={{
                  fontSize: 36,
                  color: "#10b981",
                }}
              />
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "#374151",
                mb: 0.5,
                fontSize: "0.95rem",
              }}
            >
              No trending posts
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#9ca3af",
                fontSize: "0.85rem",
              }}
            >
              Be the first to create engaging content!
            </Typography>
          </Box>
        ) : (
          /* Posts List */
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            {posts.map((post, index) => (
              <Box
                key={post._id}
                sx={{
                  display: "flex",
                  gap: 1.2,
                  alignItems: "center",
                  p: 1.2,
                  borderRadius: 2,
                  transition: "all 0.2s",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "#f9fafb",
                    transform: "translateX(2px)",
                  },
                }}
              >
                {/* Rank Number */}
                <Box
                  sx={{
                    minWidth: 28,
                    height: 28,
                    borderRadius: "50%",
                    bgcolor: index < 3 ? "#10b981" : "#e5e7eb",
                    color: index < 3 ? "white" : "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                  }}
                >
                  {index + 1}
                </Box>

                {/* Post Image */}
                <Box
                  component="img"
                  src={post.image}
                  alt={post.title}
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 2,
                    objectFit: "cover",
                    flexShrink: 0,
                    border: "2px solid #f3f4f6",
                  }}
                />

                {/* Post Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#1f2937",
                      mb: 0.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      fontSize: "0.8rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1.2,
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#9ca3af",
                        fontSize: "0.7rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.3,
                      }}
                    >
                      ❤️ {post.likes?.length || 0}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#9ca3af",
                        fontSize: "0.7rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.3,
                      }}
                    >
                      💬 {post.comments?.length || 0}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingPosts;
