import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  logoutUser,
  registerUser,
  checkUserSession,
} from "../features/auth/authAPI";

/**
 * Custom hook for managing authentication state and operations
 * @returns {Object} Authentication state and methods
 * @property {Object} user - Current user object
 * @property {boolean} isAuthenticated - Whether user is authenticated
 * @property {boolean} loading - Loading state of auth operations
 * @property {string|null} error - Error message if any
 * @property {Function} login - Function to log in user
 * @property {Function} register - Function to register new user
 * @property {Function} logout - Function to log out user
 * @property {Function} checkSession - Function to check current session
 * @example
 * const { user, login, logout } = useAuth();
 *
 * // Login
 * await login('user@example.com', 'password123');
 *
 * // Logout
 * logout();
 */
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

  /**
   * Logs in a user with provided credentials
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<Object>} User data and token
   */
  const login = (email, password) =>
    dispatch(loginUser({ email, password })).unwrap();

  /**
   * Registers a new user
   * @param {string} username - Desired username
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<Object>} User data and token
   */
  const register = (username, email, password) =>
    dispatch(registerUser({ username, email, password })).unwrap();

  /**
   * Logs out the current user
   * @returns {Promise<void>}
   */
  const logout = () => dispatch(logoutUser());

  /**
   * Checks the current user session
   * @returns {Promise<Object>} User data if session is valid
   */
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
