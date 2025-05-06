import React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

const LogoutDialog = ({ open, onClose, onLogout }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Are you sure you want to log out?</DialogTitle>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          No
        </Button>
        <Button onClick={onLogout} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialog;
