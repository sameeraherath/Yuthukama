import React from "react";
import { Link } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";

function LandingPage() {
  return (
    <Box className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <Typography variant="h3" className="mb-8 text-center text-gray-800">
        Welcome to Yuthukama
      </Typography>
      <Box className="flex gap-4">
        {/* Button to navigate to Login Page */}
        <Button
          component={Link}
          to="/login"
          variant="contained"
          className="bg-blue-500 hover:bg-blue-600"
        >
          Login
        </Button>
        <Button
          component={Link}
          to="/register"
          variant="outlined"
          className="text-blue-500 border-blue-500 hover:bg-blue-50"
        >
          Register
        </Button>
      </Box>
    </Box>
  );
}

export default LandingPage;
