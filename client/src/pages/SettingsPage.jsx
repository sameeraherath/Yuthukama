import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import axios from "../utils/axiosConfig";
import LogoutDialog from "../components/LogoutDialog";

/**
 * SettingsPage component - Comprehensive user settings management
 * @component
 * @returns {JSX.Element} The settings page with various user preferences
 */
const SettingsPage = () => {
  const { user, updateUser, logout } = useAuth();
  const dispatch = useDispatch();
  
  // State management
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    profilePicture: "",
  });
  
  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    profileVisibility: "public",
    showEmail: false,
    showLocation: true,
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    allowMessages: "everyone",
    allowComments: true,
    allowMentions: true,
    showOnlineStatus: true,
    dataSharing: false,
  });
  
  // Theme settings
  const [themeSettings, setThemeSettings] = useState({
    theme: "light",
    language: "en",
    fontSize: "medium",
    animations: true,
  });

  // Initialize form data
  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
        profilePicture: user.profilePicture || "",
      });
    }
  }, [user]);

  /**
   * Handle profile data changes
   */
  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Handle account settings changes
   */
  const handleAccountChange = (field, value) => {
    setAccountSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Handle privacy settings changes
   */
  const handlePrivacyChange = (field, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Handle theme settings changes
   */
  const handleThemeChange = (field, value) => {
    setThemeSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Save profile changes
   */
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await axios.put("/api/users/profile", profileData);
      updateUser(response.data.user);
      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success"
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update profile",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Save account settings
   */
  const handleSaveAccountSettings = async () => {
    setSaving(true);
    try {
      await axios.put("/api/users/settings/account", accountSettings);
      setSnackbar({
        open: true,
        message: "Account settings saved!",
        severity: "success"
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to save settings",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Save privacy settings
   */
  const handleSavePrivacySettings = async () => {
    setSaving(true);
    try {
      await axios.put("/api/users/settings/privacy", privacySettings);
      setSnackbar({
        open: true,
        message: "Privacy settings saved!",
        severity: "success"
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to save settings",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Save theme settings
   */
  const handleSaveThemeSettings = async () => {
    setSaving(true);
    try {
      await axios.put("/api/users/settings/theme", themeSettings);
      setSnackbar({
        open: true,
        message: "Theme settings saved!",
        severity: "success"
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to save settings",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle account deletion
   */
  const handleDeleteAccount = async () => {
    setSaving(true);
    try {
      await axios.delete("/api/users/account");
      // Redirect to login or landing page
      window.location.href = "/";
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to delete account",
        severity: "error"
      });
      setSaving(false);
    }
  };

  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    try {
      await logout();
      setLogoutDialog(false);
      // Redirect to landing page
      window.location.href = "/";
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to logout. Please try again.",
        severity: "error"
      });
    }
  };

  /**
   * Handle profile picture upload
   */
  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    setSaving(true);
    try {
      const response = await axios.post("/api/users/upload-profile-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setProfileData(prev => ({
        ...prev,
        profilePicture: response.data.profilePicture
      }));
      
      updateUser({ ...user, profilePicture: response.data.profilePicture });
      
      setSnackbar({
        open: true,
        message: "Profile picture updated!",
        severity: "success"
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to upload picture",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "#f8fafc",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
          {/* Header */}
          <motion.div variants={itemVariants}>
            <Typography
              variant="h4"
              fontWeight={700}
              color="#1f2937"
              sx={{ mb: 3, fontSize: { xs: "1.75rem", sm: "2rem" } }}
            >
              Settings
            </Typography>
          </motion.div>

          {/* Profile Settings */}
          <motion.div variants={itemVariants}>
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              <CardHeader
                avatar={<PersonIcon sx={{ color: "#1DBF73" }} />}
                title="Profile Information"
                subheader="Manage your personal information and profile"
                sx={{ backgroundColor: "#f9fafb" }}
              />
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Profile Picture */}
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Avatar
                        src={profileData.profilePicture}
                        sx={{
                          width: 120,
                          height: 120,
                          border: "4px solid #1DBF73",
                          mb: 2,
                        }}
                      >
                        {profileData.username?.charAt(0).toUpperCase()}
                      </Avatar>
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="profile-picture-upload"
                        type="file"
                        onChange={handleProfilePictureUpload}
                      />
                      <label htmlFor="profile-picture-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<PhotoCameraIcon />}
                          sx={{
                            borderColor: "#1DBF73",
                            color: "#1DBF73",
                            "&:hover": {
                              borderColor: "#169c5f",
                              backgroundColor: "#f0fdf4",
                            },
                          }}
                        >
                          Change Photo
                        </Button>
                      </label>
                    </Box>
                  </Grid>
                  
                  {/* Profile Form */}
                  <Grid item xs={12} sm={8}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Username"
                          value={profileData.username}
                          onChange={(e) => handleProfileChange("username", e.target.value)}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleProfileChange("email", e.target.value)}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Bio"
                          multiline
                          rows={3}
                          value={profileData.bio}
                          onChange={(e) => handleProfileChange("bio", e.target.value)}
                          variant="outlined"
                          placeholder="Tell us about yourself..."
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Location"
                          value={profileData.location}
                          onChange={(e) => handleProfileChange("location", e.target.value)}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Website"
                          value={profileData.website}
                          onChange={(e) => handleProfileChange("website", e.target.value)}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    sx={{
                      backgroundColor: "#1DBF73",
                      "&:hover": { backgroundColor: "#169c5f" },
                    }}
                  >
                    {saving ? "Saving..." : "Save Profile"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Settings */}
          <motion.div variants={itemVariants}>
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              <CardHeader
                avatar={<SecurityIcon sx={{ color: "#1DBF73" }} />}
                title="Account Settings"
                subheader="Manage your account preferences and security"
                sx={{ backgroundColor: "#f9fafb" }}
              />
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={accountSettings.emailNotifications}
                          onChange={(e) => handleAccountChange("emailNotifications", e.target.checked)}
                          sx={{ "& .MuiSwitch-thumb": { backgroundColor: "#1DBF73" } }}
                        />
                      }
                      label="Email Notifications"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={accountSettings.pushNotifications}
                          onChange={(e) => handleAccountChange("pushNotifications", e.target.checked)}
                          sx={{ "& .MuiSwitch-thumb": { backgroundColor: "#1DBF73" } }}
                        />
                      }
                      label="Push Notifications"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={accountSettings.marketingEmails}
                          onChange={(e) => handleAccountChange("marketingEmails", e.target.checked)}
                          sx={{ "& .MuiSwitch-thumb": { backgroundColor: "#1DBF73" } }}
                        />
                      }
                      label="Marketing Emails"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Profile Visibility</InputLabel>
                      <Select
                        value={accountSettings.profileVisibility}
                        onChange={(e) => handleAccountChange("profileVisibility", e.target.value)}
                        label="Profile Visibility"
                      >
                        <MenuItem value="public">Public</MenuItem>
                        <MenuItem value="private">Private</MenuItem>
                        <MenuItem value="friends">Friends Only</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    onClick={handleSaveAccountSettings}
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    sx={{
                      backgroundColor: "#1DBF73",
                      "&:hover": { backgroundColor: "#169c5f" },
                    }}
                  >
                    {saving ? "Saving..." : "Save Settings"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div variants={itemVariants}>
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              <CardHeader
                avatar={<NotificationsIcon sx={{ color: "#1DBF73" }} />}
                title="Privacy Settings"
                subheader="Control who can see and interact with your content"
                sx={{ backgroundColor: "#f9fafb" }}
              />
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Who can message you</InputLabel>
                      <Select
                        value={privacySettings.allowMessages}
                        onChange={(e) => handlePrivacyChange("allowMessages", e.target.value)}
                        label="Who can message you"
                      >
                        <MenuItem value="everyone">Everyone</MenuItem>
                        <MenuItem value="friends">Friends Only</MenuItem>
                        <MenuItem value="none">No One</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={privacySettings.allowComments}
                          onChange={(e) => handlePrivacyChange("allowComments", e.target.checked)}
                          sx={{ "& .MuiSwitch-thumb": { backgroundColor: "#1DBF73" } }}
                        />
                      }
                      label="Allow Comments"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={privacySettings.allowMentions}
                          onChange={(e) => handlePrivacyChange("allowMentions", e.target.checked)}
                          sx={{ "& .MuiSwitch-thumb": { backgroundColor: "#1DBF73" } }}
                        />
                      }
                      label="Allow Mentions"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={privacySettings.showOnlineStatus}
                          onChange={(e) => handlePrivacyChange("showOnlineStatus", e.target.checked)}
                          sx={{ "& .MuiSwitch-thumb": { backgroundColor: "#1DBF73" } }}
                        />
                      }
                      label="Show Online Status"
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    onClick={handleSavePrivacySettings}
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    sx={{
                      backgroundColor: "#1DBF73",
                      "&:hover": { backgroundColor: "#169c5f" },
                    }}
                  >
                    {saving ? "Saving..." : "Save Settings"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Theme Settings */}
          <motion.div variants={itemVariants}>
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              <CardHeader
                avatar={<PaletteIcon sx={{ color: "#1DBF73" }} />}
                title="Appearance & Language"
                subheader="Customize your app experience"
                sx={{ backgroundColor: "#f9fafb" }}
              />
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Theme</InputLabel>
                      <Select
                        value={themeSettings.theme}
                        onChange={(e) => handleThemeChange("theme", e.target.value)}
                        label="Theme"
                      >
                        <MenuItem value="light">Light</MenuItem>
                        <MenuItem value="dark">Dark</MenuItem>
                        <MenuItem value="auto">Auto</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={themeSettings.language}
                        onChange={(e) => handleThemeChange("language", e.target.value)}
                        label="Language"
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Spanish</MenuItem>
                        <MenuItem value="fr">French</MenuItem>
                        <MenuItem value="de">German</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Font Size</InputLabel>
                      <Select
                        value={themeSettings.fontSize}
                        onChange={(e) => handleThemeChange("fontSize", e.target.value)}
                        label="Font Size"
                      >
                        <MenuItem value="small">Small</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="large">Large</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={themeSettings.animations}
                          onChange={(e) => handleThemeChange("animations", e.target.checked)}
                          sx={{ "& .MuiSwitch-thumb": { backgroundColor: "#1DBF73" } }}
                        />
                      }
                      label="Enable Animations"
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    onClick={handleSaveThemeSettings}
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    sx={{
                      backgroundColor: "#1DBF73",
                      "&:hover": { backgroundColor: "#169c5f" },
                    }}
                  >
                    {saving ? "Saving..." : "Save Settings"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Danger Zone */}
          <motion.div variants={itemVariants}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                overflow: "hidden",
                border: "2px solid #fecaca",
              }}
            >
              <CardHeader
                avatar={<DeleteIcon sx={{ color: "#ef4444" }} />}
                title="Danger Zone"
                subheader="Irreversible and destructive actions"
                sx={{ backgroundColor: "#fef2f2" }}
              />
              <CardContent sx={{ p: 3 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  These actions are permanent and cannot be undone.
                </Alert>
                
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<LogoutIcon />}
                    onClick={() => setLogoutDialog(true)}
                    sx={{
                      borderColor: "#ef4444",
                      color: "#ef4444",
                      "&:hover": {
                        borderColor: "#dc2626",
                        backgroundColor: "#fef2f2",
                      },
                    }}
                  >
                    Logout
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteDialog(true)}
                    sx={{
                      borderColor: "#ef4444",
                      color: "#ef4444",
                      "&:hover": {
                        borderColor: "#dc2626",
                        backgroundColor: "#fef2f2",
                      },
                    }}
                  >
                    Delete Account
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </motion.div>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
            All your posts, comments, and data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={saving}
          >
            {saving ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Logout Dialog */}
      <LogoutDialog
        open={logoutDialog}
        onClose={() => setLogoutDialog(false)}
        onLogout={handleLogout}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;
