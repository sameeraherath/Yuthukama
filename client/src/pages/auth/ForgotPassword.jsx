import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  CircularProgress,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

/**
 * ForgotPassword component - Allows users to request a password reset
 * @component
 * @returns {JSX.Element} Forgot password form
 */
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(
        "/api/auth/forgot-password",
        { email },
        { withCredentials: true }
      );
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        padding: 2,
      }}
    >
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={3}
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <EmailIcon sx={{ fontSize: 60, color: "#1ac173", mb: 2 }} />
          </motion.div>
          <Typography
            component={motion.h1}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            variant="h4"
            fontWeight="bold"
            gutterBottom
          >
            Forgot Password?
          </Typography>
          <Typography
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            variant="body2"
            color="text.secondary"
          >
            {success
              ? "Check your email for reset instructions"
              : "Enter your email address and we'll send you a link to reset your password"}
          </Typography>
        </Box>

        {success ? (
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            sx={{ textAlign: "center" }}
          >
            <Alert severity="success" sx={{ mb: 3 }}>
              If an account exists with {email}, you will receive a password
              reset link shortly.
            </Alert>
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{
                borderColor: "#1ac173",
                color: "#1ac173",
                "&:hover": {
                  borderColor: "#158f5e",
                  backgroundColor: "rgba(26, 193, 115, 0.1)",
                },
              }}
            >
              Return to Login
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {error && (
                <Alert
                  component={motion.div}
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  severity="error"
                >
                  {error}
                </Alert>
              )}
            </AnimatePresence>

            <TextField
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#1ac173",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#1ac173",
                },
              }}
            />

            <Button
              component={motion.button}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !email}
              sx={{
                backgroundColor: "#1ac173",
                py: 1.5,
                transition: "background-color 0.3s ease",
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                mb: 2,
                "&:hover": {
                  backgroundColor: "#158f5e",
                },
                "&:disabled": {
                  backgroundColor: "#ccc",
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: "white" }} />
                  <span>Sending...</span>
                </Box>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => navigate("/login")}
                sx={{
                  color: "#1ac173",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                <ArrowBackIcon fontSize="small" />
                Back to Login
              </Link>
            </Box>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
