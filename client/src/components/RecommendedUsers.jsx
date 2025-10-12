import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchRecommendedUsers,
  followUser,
  unfollowUser,
} from "../features/auth/userSlice";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PeopleIcon from "@mui/icons-material/People";

/**
 * Component for displaying recommended users to follow
 * @component
 * @returns {JSX.Element} Recommended users section
 */
const RecommendedUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { recommendedUsers, loading, error, followStatus } = useSelector(
    (state) => state.user
  );
  const [followingUsers, setFollowingUsers] = useState(new Set());

  /**
   * Effect hook to fetch recommended users on component mount
   */
  useEffect(() => {
    dispatch(fetchRecommendedUsers(8)); // Fetch 8 recommended users
  }, [dispatch]);

  /**
   * Handle follow/unfollow action
   * @param {string} userId - ID of the user to follow/unfollow
   * @param {boolean} isFollowing - Current follow status
   */
  const handleFollowToggle = async (userId, isFollowing) => {
    try {
      if (isFollowing) {
        await dispatch(unfollowUser(userId));
        setFollowingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      } else {
        await dispatch(followUser(userId));
        setFollowingUsers((prev) => new Set(prev).add(userId));
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  /**
   * Handle user profile navigation
   * @param {string} userId - ID of the user to navigate to
   */
  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  /**
   * Check if user is being followed
   * @param {string} userId - User ID to check
   * @returns {boolean} Follow status
   */
  const isUserFollowed = (userId) => {
    return followStatus[userId] || followingUsers.has(userId);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "white",
        borderRadius: 2,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: "1px solid #e5e7eb" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <PeopleIcon sx={{ color: "#1DBF73", fontSize: "1.2rem" }} />
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ fontSize: "1rem", color: "#374151" }}
          >
            Recommended Users
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{ color: "#6b7280", fontSize: "0.875rem" }}
        >
          Discover new people to follow
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 0 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 3,
            }}
          >
            <CircularProgress size={24} sx={{ color: "#1DBF73" }} />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Alert severity="error" sx={{ fontSize: "0.875rem" }}>
              {error}
            </Alert>
          </Box>
        ) : recommendedUsers.length === 0 ? (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{ color: "#6b7280", fontSize: "0.875rem" }}
            >
              No recommended users found
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
            {recommendedUsers.map((recommendedUser, index) => {
              const isFollowing = isUserFollowed(recommendedUser._id);
              const isCurrentUser = recommendedUser._id === user?._id;

              return (
                <Box key={recommendedUser._id}>
                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      transition: "background-color 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#f9fafb",
                      },
                    }}
                  >
                    {/* Avatar */}
                    <Avatar
                      src={recommendedUser.profilePicture}
                      alt={recommendedUser.username}
                      sx={{
                        width: 40,
                        height: 40,
                        cursor: "pointer",
                        border: "2px solid #e5e7eb",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.05)",
                          borderColor: "#1DBF73",
                        },
                      }}
                      onClick={() => handleUserClick(recommendedUser._id)}
                    >
                      {recommendedUser.username?.charAt(0).toUpperCase()}
                    </Avatar>

                    {/* User Info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{
                          fontSize: "0.875rem",
                          color: "#374151",
                          cursor: "pointer",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          "&:hover": {
                            color: "#1DBF73",
                          },
                        }}
                        onClick={() => handleUserClick(recommendedUser._id)}
                      >
                        {recommendedUser.username}
                      </Typography>
                    </Box>

                    {/* Follow Button */}
                    {!isCurrentUser && (
                      <Button
                        size="small"
                        variant={isFollowing ? "outlined" : "contained"}
                        startIcon={
                          isFollowing ? (
                            <PersonRemoveIcon sx={{ fontSize: "1rem" }} />
                          ) : (
                            <PersonAddIcon sx={{ fontSize: "1rem" }} />
                          )
                        }
                        onClick={() =>
                          handleFollowToggle(recommendedUser._id, isFollowing)
                        }
                        sx={{
                          minWidth: "auto",
                          px: 1.5,
                          py: 0.5,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          borderRadius: 2,
                          textTransform: "none",
                          backgroundColor: isFollowing
                            ? "transparent"
                            : "#1DBF73",
                          color: isFollowing ? "#6b7280" : "white",
                          borderColor: isFollowing ? "#e5e7eb" : "#1DBF73",
                          "&:hover": {
                            backgroundColor: isFollowing
                              ? "#f3f4f6"
                              : "#169c5f",
                            borderColor: isFollowing ? "#d1d5db" : "#169c5f",
                          },
                        }}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                    )}
                  </Box>
                  {index < recommendedUsers.length - 1 && (
                    <Divider sx={{ mx: 2, borderColor: "#f3f4f6" }} />
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

    </Paper>
  );
};

export default RecommendedUsers;
