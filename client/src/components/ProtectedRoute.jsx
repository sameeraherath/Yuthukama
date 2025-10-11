import { Navigate, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "#1DBF73" }} />
      </Box>
    );
  }

  // Check authentication
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, message: "Please log in to continue" }}
        replace
      />
    );
  }

  // Auto-redirect admin to dashboard if they try to access regular pages
  if (
    user?.role === "admin" &&
    !location.pathname.includes("/admin/dashboard")
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Check admin requirement
  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
