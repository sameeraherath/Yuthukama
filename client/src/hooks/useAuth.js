import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  logoutUser,
  registerUser,
  checkUserSession,
} from "../features/auth/authAPI";

const useAuth = () => {
  const dispatch = useDispatch();

  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  // Add debug logs
  console.log("useAuth - Current Redux state:", {
    user,
    isAuthenticated,
    loading,
    error,
  });

  console.log("useAuth - LocalStorage user:", localStorage.getItem("user"));

  const login = (email, password) =>
    dispatch(loginUser({ email, password })).unwrap();

  const register = (username, email, password) =>
    dispatch(registerUser({ username, email, password })).unwrap();

  const logout = () => dispatch(logoutUser());

  const checkSession = () => dispatch(checkUserSession());

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    checkSession,
  };
};

export default useAuth;
