import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PostDialog from "./PostDialog";
import LogoutDialog from "./LogoutDialog";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePostSubmit = (values, actions) => {
    actions.resetForm();
    handleClose();
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogoutClick = () => {
    setLogoutConfirmOpen(true);
  };

  const handleLogoutConfirmClose = () => {
    setLogoutConfirmOpen(false);
  };

  const handleLogout = () => {
    logout();
    setLogoutConfirmOpen(false);
    navigate("/");
  };

  return (
    <div>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "#fff",
          color: "#404145",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            onClick={() => navigate("/home")}
            sx={{
              flexGrow: 1,
              color: "#404145",
              fontWeight: "bold",
              fontSize: "1.7rem",
              cursor: "pointer",
            }}
          >
            Yuthukama
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton color="inherit" onClick={handleClickOpen}>
              <PostAddIcon sx={{ fontSize: "32px" }} />
            </IconButton>
            <IconButton color="inherit" onClick={handleProfileClick}>
              <AccountCircleIcon sx={{ fontSize: "32px" }} />
            </IconButton>
            <IconButton color="inherit" onClick={handleLogoutClick}>
              <LogoutIcon sx={{ fontSize: "32px" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Using the new LogoutDialog component */}
      <LogoutDialog
        open={logoutConfirmOpen}
        onClose={handleLogoutConfirmClose}
        onLogout={handleLogout}
      />

      <PostDialog
        open={open}
        handleClose={handleClose}
        handlePostSubmit={handlePostSubmit}
      />
    </div>
  );
};

export default Navbar;
