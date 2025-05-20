import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    user?.role === "admin" &&
    !location.pathname.includes("/admin/dashboard")
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (requireAdmin && (!user || user.role !== "admin")) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
