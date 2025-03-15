import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
} from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Yuthukama
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit">
            <PostAddIcon />
          </IconButton>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
          <IconButton color="inherit">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
