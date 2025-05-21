import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addPost } from "../features/posts/postsSlice";

/**
 * Form validation schema for post creation
 * @type {Object}
 */
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title is too short"),
  description: Yup.string()
    .required("Description is required")
    .min(3, "Description is too short"),
  image: Yup.mixed().required("Image is required"),
});

/**
 * Dialog component for creating new posts
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.handleClose - Function to close the dialog
 * @param {Function} props.handlePostSubmit - Parent callback for post submission
 * @returns {JSX.Element} Dialog with post creation form
 * @example
 * <PostDialog
 *   open={isOpen}
 *   handleClose={() => setIsOpen(false)}
 *   handlePostSubmit={(values) => console.log('Post submitted:', values)}
 * />
 */
const PostDialog = ({ open, handleClose, handlePostSubmit: parentSubmit }) => {
  const dispatch = useDispatch();
  const ACCENT_COLOR = "#1DBF73";

  /**
   * Handles post submission and file upload
   * @async
   * @function
   * @param {Object} values - Form values
   * @param {string} values.title - Post title
   * @param {string} values.description - Post description
   * @param {File} values.image - Post image file
   * @param {Object} actions - Formik form actions
   */
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
          },
        }
      );
      console.log("Post created:", response.data);

      dispatch(addPost(response.data));

      parentSubmit?.(values, actions);
      actions.resetForm();
      handleClose();
    } catch (error) {
      console.error(
        "Error creating post:",
        error.response?.data?.message || error.message
      );
      actions.setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { borderRadius: 4, p: 2, minWidth: 400 } }}
    >
      <DialogTitle
        sx={{ fontWeight: 700, color: ACCENT_COLOR, fontSize: "1.5rem" }}
      >
        Create a New Post
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{ title: "", description: "", image: null }}
          validationSchema={validationSchema}
          onSubmit={handlePostSubmit}
        >
          {({ setFieldValue, errors, touched, values }) => (
            <Form>
              <Field
                name="title"
                as={TextField}
                margin="dense"
                label="Title"
                fullWidth
                variant="outlined"
                sx={{
                  mt: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 3 },
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderColor: ACCENT_COLOR,
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: ACCENT_COLOR },
                }}
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
                sx={{
                  mt: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 3 },
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderColor: ACCENT_COLOR,
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: ACCENT_COLOR },
                }}
                error={touched.description && !!errors.description}
                helperText={touched.description && errors.description}
              />
              <Box sx={{ mt: 2, mb: 1 }}>
                <label htmlFor="post-image-upload">
                  <input
                    id="post-image-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) =>
                      setFieldValue("image", e.currentTarget.files[0])
                    }
                  />
                  <Button
                    variant="outlined"
                    component="span"
                    sx={{
                      borderRadius: 3,
                      borderColor: ACCENT_COLOR,
                      color: ACCENT_COLOR,
                      fontWeight: 600,
                      textTransform: "none",
                      px: 3,
                    }}
                  >
                    Choose Image
                  </Button>
                  {values.image && (
                    <Typography
                      variant="body2"
                      sx={{ ml: 2, display: "inline" }}
                    >
                      {values.image.name}
                    </Typography>
                  )}
                </label>
                {touched.image && errors.image && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {errors.image}
                  </Typography>
                )}
              </Box>
              <DialogActions sx={{ mt: 2, justifyContent: "flex-end" }}>
                <Button
                  onClick={handleClose}
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
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: ACCENT_COLOR,
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
