import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { TextField, Button, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };

  return (
    <Box className="flex justify-center items-center h-screen">
      <Box className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <Typography variant="h4" className="mb-6 text-center">
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="mb-4"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="mb-4"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="bg-blue-500 hover:bg-blue-600"
          >
            Login
          </Button>
          {/* Register Button */}
          <Typography variant="body2" className="text-center mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Register here
            </Link>
          </Typography>
        </form>
      </Box>
    </Box>
  );
};

export default LoginPage;
