import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import useAuth from "../hooks/useAuth";
import PostCard from "../components/PostCard";
import { fetchUserPosts } from "../features/posts/postsSlice";
import {
  updateProfilePicture,
  updateUsername,
  clearMessage,
} from "../features/auth/userSlice";

import {
  Avatar,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  CircularProgress,
  Grid2,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [newUsername, setNewUsername] = useState("");

  const {
    loading: postsLoading,
    userPosts,
    error: postsError,
  } = useSelector((state) => state.posts);
  const {
    loading: userLoading,
    error: userError,
    message,
  } = useSelector((state) => state.user);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserPosts(user._id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    // Clear messages after 3 seconds
    if (message || userError) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, userError, dispatch]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);
    await dispatch(updateProfilePicture(formData));
    setFile(null);
  };

  const handleUsernameChange = async () => {
    if (!newUsername) return;
    await dispatch(updateUsername(newUsername));
    setNewUsername("");
  };

  if (postsLoading || userLoading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  }

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
          src={user?.profilePic || "/uploads/profile-pics/default.jpg"}
          sx={{ width: 154, height: 154, mb: 2 }}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          {user?.username}
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

        {(message || userError) && (
          <Alert
            severity={userError ? "error" : "success"}
            sx={{ mt: 2, width: "100%" }}
          >
            {userError || message}
          </Alert>
        )}
      </Box>

      <Paper elevation={1} sx={{ p: 2, mb: 4, textAlign: "center" }}>
        <Typography variant="body1">Email: {user?.email}</Typography>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Your Posts
      </Typography>

      {postsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {postsError}
        </Alert>
      )}

      {userPosts?.length > 0 ? (
        <Grid2 container spacing={2}>
          {userPosts.map((post) => (
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
