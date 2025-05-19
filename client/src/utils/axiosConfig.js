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
    if (error.response && error.response.status === 401) {
      console.log("Authentication error:", error.response.data.message);
    }

    return Promise.reject(error);
  }
);

export default axios;
