import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(true);

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
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        console.log(err);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const register = async (username, email, password) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/auth/register`,
      { username, email, password }
    );
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const login = async (email, password) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/auth/login`,
      { email, password }
    );
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = async () => {
    await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/logout`);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
