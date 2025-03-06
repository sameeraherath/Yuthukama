import { useAuth } from "../context/AuthContext";
import { Typography, Box, Button } from "@mui/material";

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <Box className="flex justify-center items-center h-screen">
      <Box className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <Typography variant="h4" className="mb-6 text-center">
          Profile
        </Typography>
        <Typography variant="body1" className="mb-4">
          Username:{user?.username}
        </Typography>
        <Typography variant="body1" className="mb-4">
          Email:{user?.email}
        </Typography>
        <Button
          onClick={logout}
          variant="contained"
          fullWidth
          className="bg-red-500 hover:bg-red-600"
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default ProfilePage;
