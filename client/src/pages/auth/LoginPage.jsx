import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import GlobalLoadingSpinner from "../../components/GlobalLoadingSpinner";

/**
 * Login page component that handles user authentication
 * @component
 * @returns {JSX.Element} The login form with email and password fields
 * @example
 * // In App.jsx
 * <Route path="/login" element={<LoginPage />} />
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  /**
   * Form data state
   * @type {Object}
   * @property {string} email - User's email address
   * @property {string} password - User's password
   */
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  /**
   * Validates the login form data
   * @function
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission and user login
   * @async
   * @function
   * @param {Event} e - Form submission event
   * @throws {Error} If login fails
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoginError("");

    try {
      const userData = await login(formData.email, formData.password);
      console.log("User data:", userData);

      // Check if user is admin and navigate accordingly
      if (userData?.user?.role === "admin") {
        console.log("Admin user detected, navigating to admin dashboard");
        navigate("/admin/dashboard", { replace: true });
      } else {
        console.log("Regular user detected, navigating to home");
        navigate("/home", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: { xs: 2, sm: 4 },
      }}
    >
      <GlobalLoadingSpinner actions={["auth/loginUser"]} />

      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          width: "100%",
          maxWidth: "450px",
          p: 4,
          borderRadius: 6,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography
            component={motion.h1}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            variant="h4"
            fontWeight="bold"
            sx={{ color: "#333" }}
          >
            Welcome Back
          </Typography>
          <Typography
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            variant="body1"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Log in to your account to continue
          </Typography>
        </Box>

        <AnimatePresence mode="wait">
          {loginError && (
            <Alert
              component={motion.div}
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              severity="error"
            >
              {loginError}
            </Alert>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <TextField
              component={motion.div}
              animate={errors.email ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                  transition: "all 0.3s ease",
                },
                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                  borderColor: "#1DBF73",
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#1DBF73" },
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px white inset",
                  WebkitTextFillColor: "#000",
                },
                "& input:-webkit-autofill:focus": {
                  WebkitBoxShadow: "0 0 0 100px white inset",
                  WebkitTextFillColor: "#000",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              component={motion.div}
              animate={errors.password ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={!!errors.password}
              helperText={errors.password}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                  transition: "all 0.3s ease",
                },
                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                  borderColor: "#1DBF73",
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#1DBF73" },
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px white inset",
                  WebkitTextFillColor: "#000",
                },
                "& input:-webkit-autofill:focus": {
                  WebkitBoxShadow: "0 0 0 100px white inset",
                  WebkitTextFillColor: "#000",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: -1,
                color: "#1976d2",
              }}
            >
              <Link
                to="/forgot-password"
                style={{
                  color: "#1DBF73",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              component={motion.button}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                mt: 1,
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: 8,
                fontSize: "1rem",
                backgroundColor: "#1DBF73",
                "&:hover": {
                  backgroundColor: "#19a666",
                },
                transition: "background-color 0.3s ease",
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: "white" }} />
                  <span>Logging in...</span>
                </Box>
              ) : (
                "Log In"
              )}
            </Button>
          </Box>
        </form>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#1DBF73",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Register here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
