import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useNotifications } from "../hooks/useNotifications";

const MainLayout = ({ children }) => {
  useNotifications(); // Initialize notifications system
  const location = useLocation();

  // Check if current route is a chat page (no padding needed)
  const isChatPage =
    location.pathname.startsWith("/messages") ||
    location.pathname.startsWith("/chat");

  // Check if current route is home page (different layout)
  const isHomePage = location.pathname === "/home";

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: isHomePage ? "#f8fafc" : "white",
      }}
    >
      <Navbar />
      <div
        style={{
          flex: 1,
          overflow: isChatPage ? "hidden" : "auto",
          display: "flex",
          flexDirection: "column",
          backgroundColor: isHomePage ? "transparent" : "white",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
