import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";

const LoginPage = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [loginError, setLoginError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setLoginError("");

    try {
      await login(formData.email, formData.password);
      navigate("/home");
    } catch (error) {
      setLoginError(
        error.message || "Failed to login. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
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
      <Paper
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
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{ color: "#333" }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Log in to your account to continue
          </Typography>
        </Box>

        {loginError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                },
                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                  borderColor: "#1DBF73",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#1DBF73",
                },
              }}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                },
                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                  borderColor: "#1DBF73",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#1DBF73",
                },
              }}
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={!!errors.password}
              helperText={errors.password}
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
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
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
              }}
            >
              {isLoading ? <CircularProgress size={24} /> : "Log In"}
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
