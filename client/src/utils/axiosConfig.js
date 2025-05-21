/**
 * Axios instance configuration and interceptors
 * @module axiosConfig
 */

import axios from "axios";

/**
 * Base URL for API requests
 * @type {string}
 */
axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// Add timeout configuration
axios.defaults.timeout = 10000; // 10 seconds timeout

/**
 * Request interceptor for adding authentication token
 * @function
 * @param {Object} config - Axios request configuration
 * @returns {Object} Modified request configuration
 * @throws {Error} If request configuration is invalid
 */
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for handling authentication errors
 * @function
 * @param {Object} response - Axios response object
 * @returns {Object} Response object
 * @throws {Error} If response contains authentication error
 */
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout:", error);
      return Promise.reject(new Error("Request timed out. Please try again."));
    }

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response error:", error.response.data);
      if (error.response.status === 401) {
        console.log("Authentication error:", error.response.data.message);
        // Optionally clear local storage and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      return Promise.reject(
        new Error("No response from server. Please check your connection.")
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axios;
