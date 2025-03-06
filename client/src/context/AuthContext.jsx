import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app load
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await axios.get("/api/auth/check", {
          withCredentials: true,
        });
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
    const { data } = await axios.post("/api/auth/register", {
      username,
      email,
      password,
    });
    setUser(data);
  };

  // Login user
  const login = async (email, password) => {
    const { data } = await axios.post("/api/auth/login", { email, password });
    setUser(data);
  };

  // Logout user
  const logout = async () => {
    await axios.post("/api/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
