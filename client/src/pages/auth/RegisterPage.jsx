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
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import GlobalLoadingSpinner from "../../components/GlobalLoadingSpinner";

/**
 * Registration page component that handles new user signup
 * @component
 * @returns {JSX.Element} The registration form with username, email, and password fields
 * @example
 * // In App.jsx
 * <Route path="/register" element={<RegisterPage />} />
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  /**
   * Form data state
   * @type {Object}
   * @property {string} username - Desired username
   * @property {string} email - User's email address
   * @property {string} password - User's password
   */
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState(null);

  /**
   * Validates the registration form data
   * @function
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters long";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission and user registration
   * @async
   * @function
   * @param {Event} e - Form submission event
   * @throws {Error} If registration fails
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setRegisterError("");

    try {
      await register(formData.username, formData.email, formData.password);
      navigate("/home");
    } catch (error) {
      setRegisterError(error);
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
      <GlobalLoadingSpinner actions={["auth/register"]} />
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
            Create an Account
          </Typography>
          <Typography
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            variant="body1"
            sx={{ color: "#666", mt: 1 }}
          >
            Sign up to get started
          </Typography>
        </Box>

        <AnimatePresence mode="wait">
          {registerError && (
            <Alert
              component={motion.div}
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              severity="error"
            >
              {registerError}
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
              animate={errors.username ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              fullWidth
              label="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              error={!!errors.username}
              helperText={errors.username}
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
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />

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
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

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
                "&:hover": { backgroundColor: "#19a666" },
                transition: "background-color 0.3s ease",
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: "white" }} />
                  <span>Creating account...</span>
                </Box>
              ) : (
                "Sign Up"
              )}
            </Button>

            <Typography variant="body2" sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#1DBF73" }}>
                Login
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
