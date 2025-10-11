import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

/**
 * MessageActions component - Displays edit and delete options for messages
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.message - Message data
 * @param {Function} props.onEdit - Callback when message is edited
 * @param {Function} props.onDelete - Callback when message is deleted
 * @param {boolean} props.isSentByCurrentUser - Whether message was sent by current user
 * @returns {JSX.Element} Message action menu
 */
const MessageActions = ({ message, onEdit, onDelete, isSentByCurrentUser }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedText, setEditedText] = useState(message.text || "");

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      onDelete(message._id);
    }
    handleMenuClose();
  };

  const handleEditSubmit = () => {
    if (editedText.trim() && editedText !== message.text) {
      onEdit(message._id, editedText.trim());
    }
    setEditDialogOpen(false);
  };

  const handleEditCancel = () => {
    setEditedText(message.text || "");
    setEditDialogOpen(false);
  };

  // Don't show actions for deleted messages or messages not sent by current user
  if (message.deleted || !isSentByCurrentUser) {
    return null;
  }

  return (
    <>
      <IconButton
        size="small"
        onClick={handleMenuOpen}
        sx={{
          opacity: 0,
          transition: "opacity 0.2s",
          ".message-container:hover &": {
            opacity: 1,
          },
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={editDialogOpen}
        onClose={handleEditCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Message</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            placeholder="Enter your message..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel}>Cancel</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={!editedText.trim() || editedText === message.text}
            sx={{
              backgroundColor: "#1DBF73",
              "&:hover": {
                backgroundColor: "#18a364",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MessageActions;
