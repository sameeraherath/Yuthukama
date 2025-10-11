/**
 * Authentication utility functions
 */

/**
 * Validates if a token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is valid
 */
export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

/**
 * Safely gets user from localStorage
 * @returns {Object|null} User object or null
 */
export const getSafeUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

/**
 * Clears all auth data
 */
export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Safely stores user data
 * @param {Object} user - User object to store
 */
export const setUser = (user) => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Failed to store user data:", error);
  }
};

/**
 * Safely stores token
 * @param {string} token - JWT token to store
 */
export const setToken = (token) => {
  try {
    localStorage.setItem("token", token);
  } catch (error) {
    console.error("Failed to store token:", error);
  }
};

/**
 * Gets token from localStorage
 * @returns {string|null} Token or null
 */
export const getToken = () => {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};
