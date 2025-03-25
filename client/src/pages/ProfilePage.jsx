import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import PostCard from "../components/PostCard";

import {
  Avatar,
  Button,
  Container,
  Grid2,
  TextField,
  Typography,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/posts/user/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchUserPosts();
  }, [user]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/users/profile-pic`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser(response.data.user);
      setFile(null);
      setMessage("Profile picture updated successfully");
    } catch (error) {
      setMessage("Error uploading profile picture");
      console.error(error);
    }
  };

  const handleUsernameChange = async () => {
    if (!newUsername) {
      setMessage("Please enter a new username");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/users/username`,
        { username: newUsername },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUser(response.data.user);
      setNewUsername("");
      setMessage("Username updated successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating username");
      console.error(error);
    }
  };

  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Avatar
          src={user.profilePic || "/uploads/profile-pics/default.jpg"}
          sx={{ width: 128, height: 128, mb: 2 }}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          {user.username}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
          <input
            accept="image/jpeg,image/png"
            style={{ display: "none" }}
            id="profile-pic-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="profile-pic-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Choose File
            </Button>
          </label>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file}
          >
            Upload Profile Picture
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
          <TextField
            label="New Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            variant="outlined"
            size="small"
          />
          <Button
            variant="contained"
            color="success"
            onClick={handleUsernameChange}
          >
            Update Username
          </Button>
        </Box>

        {message && (
          <Typography
            variant="body2"
            color={message.includes("Error") ? "error" : "success"}
            sx={{ mt: 1 }}
          >
            {message}
          </Typography>
        )}
      </Box>

      <Paper elevation={1} sx={{ p: 2, mb: 4, textAlign: "center" }}>
        <Typography variant="body1">Email: {user.email}</Typography>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Your Posts
      </Typography>
      {posts.length > 0 ? (
        <Grid2 container spacing={2}>
          {posts.map((post) => (
            <Grid2 item xs={12} key={post._id}>
              <PostCard post={post} />
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <Typography variant="body1">
          You haven't posted anything yet.
        </Typography>
      )}
    </Container>
  );
};

export default ProfilePage;
