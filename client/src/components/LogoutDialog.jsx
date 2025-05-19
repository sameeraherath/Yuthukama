import React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

/**
 * Dialog component for confirming user logout
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to call when dialog is closed
 * @param {Function} props.onLogout - Function to call when logout is confirmed
 * @returns {JSX.Element} Material-UI Dialog component
 * @example
 * <LogoutDialog
 *   open={showLogoutDialog}
 *   onClose={() => setShowLogoutDialog(false)}
 *   onLogout={handleLogout}
 * />
 */
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
