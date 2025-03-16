import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  postContent: Yup.string()
    .required("Post content is required")
    .min(5, "Content is too short"),
});

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePostSubmit = (values, actions) => {
    console.log("Post Content: ", values.postContent);
    actions.resetForm();
    handleClose();
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Yuthukama
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton color="inherit" onClick={handleClickOpen}>
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a New Post</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{ postContent: "" }}
            validationSchema={validationSchema}
            onSubmit={handlePostSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <Field
                  name="postContent"
                  as={TextField}
                  autoFocus
                  margin="dense"
                  label="Post Content"
                  type="text"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  error={touched.postContent && !!errors.postContent}
                  helperText={touched.postContent && errors.postContent}
                />
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    Post
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Navbar;
