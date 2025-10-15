/**
 * Centralized token management system to prevent race conditions and intermittent JWT errors
 * @module tokenManager
 */

/**
 * TokenManager class - Single source of truth for token operations
 * Prevents race conditions and ensures consistent token state across the application
 */
class TokenManager {
  constructor() {
    this.token = null;
    this.isValidating = false;
    this.validationPromise = null;
    this.isInitialized = false;
  }

  /**
   * Initialize token from localStorage
   * @returns {void}
   */
  initialize() {
    if (this.isInitialized) return;
    
    try {
      this.token = localStorage.getItem("token");
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize token from localStorage:", error);
      this.token = null;
    }
  }

  /**
   * Get current token with validation
   * @returns {Promise<string|null>} Valid token or null
   */
  async getToken() {
    this.initialize();

    // If already validating, wait for the current validation
    if (this.isValidating && this.validationPromise) {
      const isValid = await this.validationPromise;
      return isValid ? this.token : null;
    }

    // If no token, return null
    if (!this.token) {
      return null;
    }

    // Validate token if not already validating
    if (!this.isValidating) {
      this.isValidating = true;
      this.validationPromise = this.validateToken();
      
      const isValid = await this.validationPromise;
      this.isValidating = false;
      this.validationPromise = null;

      if (!isValid) {
        console.warn("Token validation failed, clearing auth data");
        this.clearToken();
        return null;
      }
    }

    return this.token;
  }

  /**
   * Validate token format and expiration
   * @returns {Promise<boolean>} True if token is valid
   */
  async validateToken() {
    if (!this.token) return false;
    
    try {
      // Check if token has proper JWT format (3 parts separated by dots)
      const parts = this.token.split('.');
      if (parts.length !== 3) {
        console.warn('Invalid JWT format - expected 3 parts, got', parts.length);
        return false;
      }
      
      // Validate each part exists and is not empty
      if (!parts[0] || !parts[1] || !parts[2]) {
        console.warn('JWT parts are empty');
        return false;
      }
      
      // Decode and validate expiration
      const payload = JSON.parse(atob(parts[1]));
      const isExpired = payload.exp * 1000 <= Date.now();
      
      if (isExpired) {
        console.warn('Token has expired');
        return false;
      }
      
      return true;
    } catch (error) {
      console.warn('Token validation failed:', error.message);
      return false;
    }
  }

  /**
   * Set new token
   * @param {string} token - JWT token to store
   * @returns {void}
   */
  setToken(token) {
    try {
      this.token = token;
      localStorage.setItem("token", token);
      console.log("Token stored successfully");
    } catch (error) {
      console.error("Failed to store token:", error);
      this.token = null;
    }
  }

  /**
   * Clear token and user data
   * @returns {void}
   */
  clearToken() {
    try {
      this.token = null;
      this.isValidating = false;
      this.validationPromise = null;
      
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      console.log("Token and user data cleared");
    } catch (error) {
      console.error("Failed to clear token:", error);
    }
  }

  /**
   * Check if token exists without validation
   * @returns {boolean} True if token exists
   */
  hasToken() {
    this.initialize();
    return !!this.token;
  }

  /**
   * Get token synchronously (for non-critical operations)
   * @returns {string|null} Token or null
   */
  getTokenSync() {
    this.initialize();
    return this.token;
  }
}

// Create singleton instance
export const tokenManager = new TokenManager();

// Export for backward compatibility
export const getToken = () => tokenManager.getTokenSync();
export const setToken = (token) => tokenManager.setToken(token);
export const clearAuthData = () => tokenManager.clearToken();
export const isTokenValid = async (token) => {
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};
