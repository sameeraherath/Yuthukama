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
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title is too short"),
  description: Yup.string()
    .required("Description is required")
    .min(3, "Description is too short"),
  image: Yup.mixed().required("Image is required"),
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
      <AppBar position="static" elevation={0}>
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
            initialValues={{ title: "", description: "", image: null }}
            validationSchema={validationSchema}
            onSubmit={handlePostSubmit}
          >
            {({ setFieldValue, errors, touched }) => (
              <Form>
                <Field
                  name="title"
                  as={TextField}
                  margin="dense"
                  label="Title"
                  fullWidth
                  variant="outlined"
                  error={touched.title && !!errors.title}
                  helperText={touched.title && errors.title}
                />
                <Field
                  name="description"
                  as={TextField}
                  margin="dense"
                  label="Description"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  error={touched.description && !!errors.description}
                  helperText={touched.description && errors.description}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    setFieldValue("image", event.currentTarget.files[0]);
                  }}
                />
                {touched.image && errors.image && (
                  <Typography color="error">{errors.image}</Typography>
                )}
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
