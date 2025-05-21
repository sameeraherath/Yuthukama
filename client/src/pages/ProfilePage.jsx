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

/**
 * Profile page component that displays user information and posts
 * @component
 * @returns {JSX.Element} Profile page with user details and posts grid
 * @example
 * // In App.jsx
 * <Route path="/profile" element={<ProfilePage />} />
 */
const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  /**
   * Effect hook to log user state changes
   * @effect
   * @listens {user} - Current user data
   */
  useEffect(() => {
    console.log("Current user state:", user);
    console.log("Profile picture URL:", user?.profilePicture);
  }, [user]);

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

  console.log("ProfilePage userPosts:", userPosts);

  /**
   * Effect hook to fetch user posts when user ID changes
   * @effect
   * @listens {user?.id} - User ID
   * @listens {dispatch} - Redux dispatch function
   */
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserPosts(user.id));
    }
  }, [dispatch, user?.id]);

  /**
   * Effect hook to clear messages after timeout
   * @effect
   * @listens {message} - Success message
   * @listens {userError} - Error message
   * @listens {dispatch} - Redux dispatch function
   */
  useEffect(() => {
    if (message || userError) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, userError, dispatch]);

  /**
   * Handles file selection for profile picture
   * @function
   * @param {Event} e - File input change event
   */
  const handleFileChange = (e) => {
    console.log("Selected file:", e.target.files[0]);
    setFile(e.target.files[0]);
  };

  /**
   * Handles profile picture upload
   * @async
   * @function
   */
  const handleUpload = async () => {
    if (!file) return;
    console.log("Uploading file:", file);
    const formData = new FormData();
    formData.append("profilePic", file);
    try {
      const result = await dispatch(updateProfilePicture(formData));
      console.log("Profile picture update result:", result);
      setFile(null);
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  /**
   * Handles username update
   * @async
   * @function
   */
  const handleUsernameChange = async () => {
    if (!newUsername) return;
    await dispatch(updateUsername(newUsername));
    setNewUsername("");
    setEditingUsername(false);
  };

  /**
   * Initiates username editing mode
   * @function
   */
  const handleEditUsername = () => {
    setEditingUsername(true);
    setNewUsername(user?.username || "");
  };

  /**
   * Cancels username editing
   * @function
   */
  const handleCancelEdit = () => {
    setEditingUsername(false);
    setNewUsername("");
  };

  /**
   * Handles post deletion
   * @async
   * @function
   */
  const handleDeletePost = async () => {
    if (postToDelete) {
      await dispatch(deletePost(postToDelete));
      dispatch(fetchUserPosts(user.id));
    }
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  if (postsLoading || userLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        sx={{ p: 4, mb: 4, borderRadius: 4, textAlign: "center", boxShadow: 1 }}
      >
        <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
          <Avatar
            src={user?.profilePicture || "/uploads/profile-pics/default.jpg"}
            sx={{
              width: 154,
              height: 154,
              border: "4px solid #1dbf73",
              boxShadow: 1,
            }}
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
                bgcolor: "rgba(0,0,0,0.7)",
                borderRadius: "50%",
                p: 1.2,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
                "&:hover": { bgcolor: "#1dbf73" },
              }}
            >
              <CameraAltIcon sx={{ color: "#fff" }} />
            </Box>
          </label>
        </Box>
        {file && (
          <Button
            variant="contained"
            color="success"
            onClick={handleUpload}
            sx={{
              mb: 2,
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: 5,
              px: 4,
              backgroundColor: "#1dbf73",
              boxShadow: 1,
            }}
          >
            Update Profile Picture
          </Button>
        )}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mt: 2,
            justifyContent: "center",
          }}
        >
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
                autoFocus
              />
              <Button
                variant="contained"
                color="success"
                sx={{
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: 5,
                  px: 3,
                  backgroundColor: "#1dbf73",
                }}
                onClick={handleUsernameChange}
                disabled={!newUsername}
              >
                Update
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                sx={{ textTransform: "none", borderRadius: 5, px: 3 }}
                onClick={handleCancelEdit}
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
                sx={{ mb: 0, fontWeight: 600 }}
              >
                {user?.username}
              </Typography>
              <IconButton
                aria-label="Edit Username"
                onClick={handleEditUsername}
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
            sx={{ mt: 2, width: "100%", borderRadius: 2, fontWeight: 500 }}
          >
            {userError || message}
          </Alert>
        )}
        <Typography variant="body1" sx={{ mt: 3, color: "#555" }}>
          Email: <b>{user?.email}</b>
        </Typography>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Your Posts
        </Typography>
        {postsError && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {postsError}
          </Alert>
        )}
        {userPosts?.length > 0 ? (
          <Grid container spacing={3}>
            {userPosts.map((post) => (
              <Grid item xs={12} sm={6} md={6} key={post._id}>
                <PostCard
                  post={post}
                  showOfferButton={false}
                  onDelete={() => {
                    if (
                      (post.user && post.user._id === user._id) ||
                      post.user === user._id
                    ) {
                      setPostToDelete(post._id);
                      setDeleteDialogOpen(true);
                    } else {
                      alert("You are not authorized to delete this post.");
                    }
                  }}
                  sx={{ boxShadow: 2, borderRadius: 3 }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" sx={{ color: "#888", mt: 2 }}>
            You haven't posted anything yet.
          </Typography>
        )}
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Post</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this post?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeletePost}
            color="error"
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
