import { tokenManager } from './tokenManager.js';

/**
 * Validates if a token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is valid
 * @deprecated Use tokenManager.validateToken() instead
 */
export const isTokenValid = async (token) => {
  if (!token) return false;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Invalid JWT format - expected 3 parts, got', parts.length);
      return false;
    }
    
    if (!parts[0] || !parts[1] || !parts[2]) {
      console.warn('JWT parts are empty');
      return false;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    console.warn('Token validation failed:', error.message);
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
 * @deprecated Use tokenManager.clearToken() instead
 */
export const clearAuthData = () => {
  tokenManager.clearToken();
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
 * @deprecated Use tokenManager.setToken() instead
 */
export const setToken = (token) => {
  tokenManager.setToken(token);
};

/**
 * Gets token from localStorage
 * @returns {string|null} Token or null
 * @deprecated Use tokenManager.getTokenSync() instead
 */
export const getToken = () => {
  return tokenManager.getTokenSync();
};
