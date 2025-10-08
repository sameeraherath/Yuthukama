import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        const response = await axios.get("/api/users/recommended", {
          params: { limit },
          withCredentials: true,
        });
        setUsers(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching recommended users:", err);
        setError(err.response?.data?.message || "Failed to load recommended users");
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
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: "#1ac173" }} />
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

  if (users.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">
          No recommendations available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 2,
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <StarIcon sx={{ color: "#1ac173" }} />
        <Typography variant="h6" fontWeight="bold">
          Recommended for You
        </Typography>
      </Box>

      <List sx={{ p: 0 }}>
        {users.map((user, index) => (
          <ListItem
            key={user._id}
            sx={{
              borderBottom: index < users.length - 1 ? "1px solid #f0f0f0" : "none",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 1.5,
              py: 2,
              px: 2.5,
              "&:hover": {
                backgroundColor: "rgba(26, 193, 115, 0.05)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                gap: 2,
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={user.profilePicture}
                  alt={user.username}
                  sx={{ width: 48, height: 48 }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="600">
                    {user.username}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={user.role}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.75rem",
                        backgroundColor:
                          user.role === "mentor" ? "#e3f2fd" : user.role === "mentee" ? "#fff3e0" : "#f5f5f5",
                        color:
                          user.role === "mentor" ? "#1976d2" : user.role === "mentee" ? "#f57c00" : "inherit",
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                }
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {user.bio && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    mr: 2,
                  }}
                >
                  {user.bio}
                </Typography>
              )}
              
              <Button
                size="small"
                variant="outlined"
                startIcon={<PersonAddIcon />}
                onClick={() => handleViewProfile(user._id)}
                sx={{
                  borderColor: "#1ac173",
                  color: "#1ac173",
                  textTransform: "none",
                  borderRadius: 2,
                  "&:hover": {
                    borderColor: "#158f5e",
                    backgroundColor: "rgba(26, 193, 115, 0.1)",
                  },
                }}
              >
                View
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default RecommendedUsers;
