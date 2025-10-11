import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import EnhancedSkeleton from "./LoadingStates/EnhancedSkeleton";

/**
 * RecommendedUsers component - Displays recommended users to connect with
 * @component
 * @param {Object} props - Component props
 * @param {number} props.limit - Number of users to display (default: 10)
 * @returns {JSX.Element} Recommended users section
 */
const RecommendedUsers = ({ limit = 10 }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendedUsers = async () => {
      try {
        setLoading(true);
        console.log("Fetching recommended users with limit:", limit);

        const response = await axios.get("/api/users/recommended", {
          params: { limit },
        });

        console.log("Recommended users response:", response.data);

        // Handle both response.data and response.data.users formats
        const usersData = Array.isArray(response.data)
          ? response.data
          : response.data?.users || [];

        console.log(
          "Users data extracted:",
          usersData,
          "Length:",
          usersData.length
        );
        setUsers(usersData);
        setError(null);
      } catch (err) {
        console.error("Error fetching recommended users:", err);
        console.error("Error response:", err.response?.data);
        setError(
          err.response?.data?.message || "Failed to load recommended users"
        );
        setUsers([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedUsers();
  }, [limit]);

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

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
            Recommended for You
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.8,
            }}
          >
            {[1, 2, 3].map((i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.2,
                }}
              >
                <Box
                  sx={{
                    width: 45,
                    height: 45,
                    bgcolor: "#f3f4f6",
                    borderRadius: "50%",
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      width: "70%",
                      height: 14,
                      bgcolor: "#f3f4f6",
                      borderRadius: 1,
                      mb: 0.5,
                    }}
                  />
                  <Box
                    sx={{
                      width: "50%",
                      height: 12,
                      bgcolor: "#f3f4f6",
                      borderRadius: 1,
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    width: 50,
                    height: 28,
                    bgcolor: "#f3f4f6",
                    borderRadius: 2,
                  }}
                />
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
            Recommended for You
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
          <PersonAddIcon sx={{ fontSize: 20, color: "#10b981" }} />
          Recommended for You
        </Typography>

        {/* Empty State */}
        {!Array.isArray(users) || users.length === 0 ? (
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
              <PersonAddIcon
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
              No recommendations
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#9ca3af",
                fontSize: "0.85rem",
              }}
            >
              Check back later for user suggestions
            </Typography>
          </Box>
        ) : (
          /* Users List */
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.8,
            }}
          >
            {users.map((user) => (
              <Box
                key={user._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.2,
                  borderRadius: 2,
                  transition: "all 0.2s",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "#f9fafb",
                  },
                }}
              >
                {/* Avatar */}
                <Avatar
                  src={user.profilePicture}
                  alt={user.username || user.name}
                  sx={{
                    width: 45,
                    height: 45,
                    border: "2px solid #f3f4f6",
                  }}
                >
                  {(user.username || user.name || "?").charAt(0).toUpperCase()}
                </Avatar>

                {/* User Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#1f2937",
                      fontSize: "0.875rem",
                      lineHeight: 1.2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.name || user.username}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#9ca3af",
                      fontSize: "0.75rem",
                    }}
                  >
                    @{user.username}
                  </Typography>
                </Box>

                {/* View Button */}
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleViewProfile(user._id)}
                  sx={{
                    bgcolor: "#10b981",
                    color: "white",
                    textTransform: "none",
                    borderRadius: 2,
                    fontSize: "0.75rem",
                    px: 1.8,
                    py: 0.5,
                    minWidth: "auto",
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "#059669",
                      boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                    },
                  }}
                >
                  View
                </Button>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedUsers;
