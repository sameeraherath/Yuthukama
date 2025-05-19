import axios from "axios";

/**
 * Sets up default axios configuration with authentication headers
 * @function setupAxiosAuth
 * @returns {Object} Axios configuration object with headers
 * @property {Object} headers - Request headers
 * @property {string} headers.Content-Type - Content type header
 * @property {string} [headers.Authorization] - Bearer token if available
 */
export const setupAxiosAuth = () => {
  const token = localStorage.getItem("token");

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  return defaultOptions;
};

/**
 * Creates an axios instance with authentication configuration
 * @function apiWithAuth
 * @returns {import('axios').AxiosInstance} Configured axios instance
 * @example
 * const api = apiWithAuth();
 * const response = await api.get('/api/protected-route');
 */
export const apiWithAuth = () => {
  const options = setupAxiosAuth();
  const instance = axios.create(options);

  return instance;
};
