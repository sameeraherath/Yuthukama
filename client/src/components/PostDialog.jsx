import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useAuth } from "../context/useAuth";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title is too short"),
  description: Yup.string()
    .required("Description is required")
    .min(3, "Description is too short"),
  image: Yup.mixed().required("Image is required"),
});

const PostDialog = ({ open, handleClose, handlePostSubmit: parentSubmit }) => {
  const { user } = useAuth();

  const handlePostSubmit = async (values, actions) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("image", values.image);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/posts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Post created:", response.data);
      parentSubmit?.(values, actions);
      actions.resetForm();
      handleClose();
    } catch (error) {
      console.error("Error creating post:", error.response?.data?.message);
      actions.setSubmitting(false);
    }
  };
  return (
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
  );
};

export default PostDialog;
