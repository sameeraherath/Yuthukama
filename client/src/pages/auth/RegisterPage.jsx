import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData); // Log the form data
    try {
      await register(formData.username, formData.email, formData.password);
      navigate("/home");
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Box className="flex justify-center items-center h-screen">
      <Box className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <Typography variant="h4" className="mb-6 text-center">
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="mb-4"
          />
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
            Register
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default RegisterPage;
