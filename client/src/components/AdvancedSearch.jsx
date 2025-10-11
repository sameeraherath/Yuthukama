import React, { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  CircularProgress,
  Chip,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ArticleIcon from "@mui/icons-material/Article";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EmptyState from "./EmptyState";

/**
 * AdvancedSearch component - Search for users and posts
 * @component
 * @returns {JSX.Element} Advanced search interface
 */
const AdvancedSearch = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("users");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      if (searchType === "users") {
        const response = await axios.get("/api/users/search", {
          params: { query: searchQuery },
          withCredentials: true,
        });
        // Handle both array and object with users property
        const usersData = Array.isArray(response.data)
          ? response.data
          : response.data?.users || [];
        setResults(usersData);
      } else {
        const response = await axios.get("/api/posts/search", {
          params: { query: searchQuery },
          withCredentials: true,
        });
        // Handle both array and object with posts property
        const postsData = Array.isArray(response.data)
          ? response.data
          : response.data?.posts || [];
        setResults(postsData);
      }
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Debounced search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      setSearchType(newType);
      setResults([]);
      if (query.trim()) {
        handleSearch(query);
      }
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    setShowResults(false);
    setQuery("");
  };

  const handlePostClick = (postId) => {
    navigate(`/home?post=${postId}`);
    setShowResults(false);
    setQuery("");
  };

  return (
    <Box sx={{ position: "relative", width: "100%", maxWidth: 600 }}>
      {/* Search type toggle */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <ToggleButtonGroup
          value={searchType}
          exclusive
          onChange={handleTypeChange}
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <ToggleButton
            value="users"
            sx={{
              px: 3,
              "&.Mui-selected": {
                backgroundColor: "#1ac173",
                color: "white",
                "&:hover": {
                  backgroundColor: "#158f5e",
                },
              },
            }}
          >
            <PersonIcon sx={{ mr: 1 }} />
            Users
          </ToggleButton>
          <ToggleButton
            value="posts"
            sx={{
              px: 3,
              "&.Mui-selected": {
                backgroundColor: "#1ac173",
                color: "white",
                "&:hover": {
                  backgroundColor: "#158f5e",
                },
              },
            }}
          >
            <ArticleIcon sx={{ mr: 1 }} />
            Posts
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Search input */}
      <TextField
        fullWidth
        value={query}
        onChange={handleQueryChange}
        placeholder={`Search ${searchType}...`}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#1ac173" }} />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setShowResults(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            backgroundColor: "white",
            "&:hover fieldset": {
              borderColor: "#1ac173",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1ac173",
              borderWidth: 2,
            },
          },
        }}
      />

      {/* Search results */}
      {showResults && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: 400,
            overflowY: "auto",
            zIndex: 1000,
            borderRadius: 2,
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress sx={{ color: "#1ac173" }} />
            </Box>
          ) : !Array.isArray(results) || results.length === 0 ? (
            <EmptyState
              variant={
                searchType === "users" ? "no-users" : "no-search-results"
              }
              searchTerm={query}
              onAction={() => setQuery("")}
            />
          ) : (
            <List>
              {searchType === "users"
                ? results.map((user) => (
                    <ListItem
                      key={user._id}
                      button
                      onClick={() => handleUserClick(user._id)}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(26, 193, 115, 0.1)",
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={user.profilePicture} alt={user.username}>
                          {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.username}
                        secondary={
                          <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                            <Chip
                              label={user.role}
                              size="small"
                              sx={{
                                height: 20,
                                backgroundColor:
                                  user.role === "mentor"
                                    ? "#e8f5e9"
                                    : "#f5f5f5",
                                color:
                                  user.role === "mentor"
                                    ? "#1DBF73"
                                    : "inherit",
                              }}
                            />
                            {user.email && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {user.email}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))
                : results.map((post) => (
                    <ListItem
                      key={post._id}
                      button
                      onClick={() => handlePostClick(post._id)}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(26, 193, 115, 0.1)",
                        },
                      }}
                    >
                      <ListItemText
                        primary={post.title}
                        secondary={
                          <>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {post.description}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                              {post.category && (
                                <Chip
                                  label={post.category}
                                  size="small"
                                  sx={{ height: 20 }}
                                />
                              )}
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                by {post.author?.username || "Unknown"}
                              </Typography>
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
            </List>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default AdvancedSearch;
