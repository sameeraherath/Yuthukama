/**
 * Axios instance configuration and interceptors
 * @module axiosConfig
 */

import axios from "axios";

/**
 * Base URL for API requests
 * @type {string}
 */
const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
console.log("API URL:", API_URL); // Debug log

axios.defaults.baseURL = API_URL;

// Add timeout configuration
axios.defaults.timeout = 15000; // Increased to 15 seconds timeout

// Add retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

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

    // Add retry count to config if not present
    config.retryCount = config.retryCount || 0;

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
  async (error) => {
    const config = error.config;

    // If the error is a timeout or network error and we haven't exceeded max retries
    if (
      (error.code === "ECONNABORTED" || !error.response) &&
      config.retryCount < MAX_RETRIES
    ) {
      config.retryCount += 1;
      console.log(`Retrying request (${config.retryCount}/${MAX_RETRIES})...`);

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));

      // Retry the request
      return axios(config);
    }

    if (error.code === "ECONNABORTED") {
      console.error("Request timeout after retries:", error);
      return Promise.reject(
        new Error(
          "Server is taking too long to respond. Please try again later."
        )
      );
    }

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response error:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url,
      });

      if (error.response.status === 401) {
        console.log("Authentication error:", error.response.data.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else if (error.response.status === 404) {
        return Promise.reject(
          new Error(
            "The requested resource was not found. Please check the server URL."
          )
        );
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", {
        url: error.config.url,
        method: error.config.method,
      });
      return Promise.reject(
        new Error(
          "Unable to connect to the server. Please check your internet connection and try again."
        )
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axios;
