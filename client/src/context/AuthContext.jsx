import { useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app load
  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          return;
        }

        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/check`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(data);
      } catch (err) {
        console.log(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Register user
  const register = async (username, email, password) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/auth/register`,
      { username, email, password }
    );
    localStorage.setItem("token", data.token); // Store the token
    setUser(data);
    return data;
  };

  // Login user
  const login = async (email, password) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/auth/login`,
      { email, password }
    );
    localStorage.setItem("token", data.token); // Store the token
    setUser(data);
    return data;
  };

  // Logout user
  const logout = async () => {
    await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/logout`);
    localStorage.removeItem("token"); // Remove the token
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
