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
import { deletePost } from "../features/posts/postsAPI";

import {
  Avatar,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  CircularProgress,
  Grid,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

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
        <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
          <Avatar
            src={user?.profilePic || "/uploads/profile-pics/default.jpg"}
            sx={{ width: 154, height: 154 }}
          />
          <label htmlFor="profile-pic-upload">
            <input
              accept="image/jpeg,image/png"
              style={{ display: "none" }}
              id="profile-pic-upload"
              type="file"
              onChange={handleFileChange}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                bgcolor: "rgba(0,0,0,0.6)",
                borderRadius: "50%",
                p: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CameraAltIcon sx={{ color: "#fff" }} />
            </Box>
          </label>
        </Box>
        {file && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            sx={{
              mb: 2,
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: 5,
              padding: "10px 20px",
              backgroundColor: "#1dbf73",
            }}
          >
            Update Profile Picture
          </Button>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
          {editingUsername ? (
            <>
              <TextField
                label="New Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  minWidth: 180,
                  "& .MuiOutlinedInput-root": { borderRadius: "25px" },
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderColor: "#1DBF73",
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#1DBF73" },
                }}
              />
              <Button
                variant="contained"
                color="success"
                sx={{
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: 5,
                  padding: "10px 20px",
                  backgroundColor: "#1dbf73",
                }}
                onClick={async () => {
                  await handleUsernameChange();
                  setEditingUsername(false);
                }}
                disabled={!newUsername}
              >
                Update
              </Button>
              <Button
                variant="text"
                color="inherit"
                sx={{ textTransform: "none", borderRadius: 5 }}
                onClick={() => {
                  setEditingUsername(false);
                  setNewUsername("");
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ mb: 0 }}
              >
                {user?.username}
              </Typography>
              <IconButton
                aria-label="Edit Username"
                onClick={() => {
                  setEditingUsername(true);
                  setNewUsername(user?.username || "");
                }}
                size="small"
                sx={{ ml: 1 }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </>
          )}
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
        <>
          <Grid container spacing={3}>
            {userPosts.map((post) => (
              <Grid item xs={12} sm={6} md={6} key={post._id}>
                <PostCard
                  post={post}
                  showOfferButton={false}
                  onDelete={() => {
                    setPostToDelete(post._id);
                    setDeleteDialogOpen(true);
                  }}
                />
              </Grid>
            ))}
          </Grid>
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Delete Post</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this post?
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                color="inherit"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (postToDelete) {
                    await dispatch(deletePost(postToDelete));
                    dispatch(fetchUserPosts(user._id));
                  }
                  setDeleteDialogOpen(false);
                  setPostToDelete(null);
                }}
                color="error"
                variant="contained"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Typography variant="body1">
          You haven't posted anything yet.
        </Typography>
      )}
    </Container>
  );
};

export default ProfilePage;
