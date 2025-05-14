import axios from "axios";

axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

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
