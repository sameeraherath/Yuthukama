import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

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
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 1,
          minWidth: 400,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          color: "#1DBF73",
          fontSize: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <LogoutIcon />
        Confirm Logout
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ color: "#404145" }}>
          Are you sure you want to log out of your account? You will need to log
          in again to access your account.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ mt: 2, justifyContent: "flex-end" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onLogout}
          variant="contained"
          sx={{
            backgroundColor: "#1DBF73",
            color: "white",
            borderRadius: 3,
            fontWeight: 600,
            textTransform: "none",
            px: 3,
            ml: 1,
            boxShadow: 1,
            "&:hover": { backgroundColor: "#179e5c" },
          }}
        >
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialog;
