import { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { AddCircle, AccountCircle, Logout } from "@mui/icons-material";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/posts`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPost();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Yuthukama
          </Typography>

          <IconButton color="inherit" onClick={() => navigate("/create-post")}>
            <AddCircle fontSize="large" />
          </IconButton>

          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle fontSize="large" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
            <MenuItem
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Log Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

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
          p: 3,
          px: { lg: 10 },
        }}
      >
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </Box>
    </>
  );
};

export default HomeScreen;
