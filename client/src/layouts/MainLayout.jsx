import React from "react";
import Navbar from "../components/Navbar";
import { useNotifications } from "../hooks/useNotifications";

const MainLayout = ({ children }) => {
  useNotifications(); // Initialize notifications system

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: "20px" }}>{children}</div>
    </div>
  );
};

export default MainLayout;
