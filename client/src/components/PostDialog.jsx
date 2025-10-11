import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  LinearProgress,
} from "@mui/material";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addPost } from "../features/posts/postsSlice";
import { COLORS, BORDER_RADIUS, COMMON_STYLES } from "../utils/styleConstants";
import { handleAsync, getErrorMessage, logError } from "../utils/errorHandler";
import { showToast } from "../features/ui/uiSlice";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";

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
    .min(10, "Description must be at least 10 characters"),
  image: Yup.mixed().optional(),
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
  const [submitError, setSubmitError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  /**
   * Handles post submission and file upload with error handling
   * @async
   * @function
   * @param {Object} values - Form values
   * @param {string} values.title - Post title
   * @param {string} values.description - Post description
   * @param {File} values.image - Post image file
   * @param {Object} actions - Formik form actions
   */
  const handlePostSubmit = async (values, actions) => {
    setSubmitError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    if (values.image) {
      formData.append("image", values.image);
    }

    const [error, data] = await handleAsync(async () => {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/posts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      return response.data;
    }, "PostDialog.handlePostSubmit");

    if (error) {
      const errorMessage = getErrorMessage(error);
      setSubmitError(errorMessage);
      dispatch(
        showToast({
          message: errorMessage,
          severity: "error",
        })
      );
      logError(error, "PostDialog.handlePostSubmit");
      actions.setSubmitting(false);
      return;
    }

    dispatch(addPost(data));
    dispatch(
      showToast({
        message: "Post created successfully!",
        severity: "success",
      })
    );

    parentSubmit?.(values, actions);
    actions.resetForm();
    setUploadProgress(0);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="post-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: BORDER_RADIUS.large,
          p: 2,
          minWidth: { xs: "90%", sm: 400 },
        },
      }}
    >
      <DialogTitle
        id="post-dialog-title"
        sx={{ fontWeight: 700, color: COLORS.primary, fontSize: "1.5rem" }}
      >
        Create a New Post
      </DialogTitle>
      <DialogContent>
        {submitError && (
          <Alert
            severity="error"
            onClose={() => setSubmitError(null)}
            sx={{ mb: 2, borderRadius: BORDER_RADIUS.medium }}
          >
            {submitError}
          </Alert>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <Box sx={{ width: "100%", mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Uploading... {uploadProgress}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              sx={{
                borderRadius: BORDER_RADIUS.medium,
                height: 8,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: COLORS.primary,
                },
              }}
            />
          </Box>
        )}

        <Formik
          initialValues={{ title: "", description: "", image: null }}
          validationSchema={validationSchema}
          onSubmit={handlePostSubmit}
        >
          {({ setFieldValue, errors, touched, values, isSubmitting }) => (
            <Form>
              <Field
                name="title"
                as={TextField}
                margin="dense"
                label="Title"
                fullWidth
                variant="outlined"
                disabled={isSubmitting}
                inputProps={{
                  "aria-label": "Post title",
                  maxLength: 100,
                }}
                sx={{
                  mt: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: BORDER_RADIUS.medium,
                  },
                  ...COMMON_STYLES.focusedInput,
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
                disabled={isSubmitting}
                inputProps={{
                  "aria-label": "Post description",
                  maxLength: 1000,
                }}
                sx={{
                  mt: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: BORDER_RADIUS.medium,
                  },
                  ...COMMON_STYLES.focusedInput,
                }}
                error={touched.description && !!errors.description}
                helperText={touched.description && errors.description}
              />
              <Box sx={{ mt: 2, mb: 1 }}>
                <label htmlFor="post-image-upload">
                  <input
                    id="post-image-upload"
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    style={{ display: "none" }}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      const file = e.currentTarget.files[0];
                      if (file) {
                        // Validate file size (5MB max)
                        if (file.size > 5 * 1024 * 1024) {
                          dispatch(
                            showToast({
                              message: "Image size must be less than 5MB",
                              severity: "error",
                            })
                          );
                          return;
                        }
                        setFieldValue("image", file);
                      }
                    }}
                    aria-label="Upload post image"
                  />
                  <Button
                    variant="outlined"
                    component="span"
                    disabled={isSubmitting}
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      ...COMMON_STYLES.roundedButton,
                      borderColor: COLORS.primary,
                      color: COLORS.primary,
                      "&:hover": {
                        borderColor: COLORS.primaryHover,
                        backgroundColor: `${COLORS.primary}10`,
                      },
                    }}
                  >
                    Choose Image (Optional)
                  </Button>
                  {values.image && (
                    <Typography
                      variant="body2"
                      sx={{
                        ml: 2,
                        display: "inline",
                        color: COLORS.text.secondary,
                      }}
                      component="span"
                    >
                      {values.image.name}
                    </Typography>
                  )}
                </label>
                {touched.image && errors.image && (
                  <Typography
                    color="error"
                    variant="body2"
                    sx={{ mt: 1 }}
                    role="alert"
                  >
                    {errors.image}
                  </Typography>
                )}
              </Box>
              <DialogActions sx={{ mt: 2, justifyContent: "flex-end", gap: 1 }}>
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  color="inherit"
                  disabled={isSubmitting}
                  sx={{
                    ...COMMON_STYLES.roundedButton,
                    borderColor: COLORS.border,
                  }}
                  aria-label="Cancel post creation"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || uploadProgress > 0}
                  sx={{
                    ...COMMON_STYLES.roundedButton,
                    ...COMMON_STYLES.primaryButton,
                    minWidth: 100,
                  }}
                  aria-label="Submit post"
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Post"
                  )}
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
