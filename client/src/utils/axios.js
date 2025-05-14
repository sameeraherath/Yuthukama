import axios from "axios";

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

export const apiWithAuth = () => {
  const options = setupAxiosAuth();
  const instance = axios.create(options);

  return instance;
};
