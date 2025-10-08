import { Snackbar, Alert, Slide } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearToast } from "../../features/ui/uiSlice";

/**
 * Slide transition for toast
 */
const SlideTransition = (props) => {
  return <Slide {...props} direction="up" />;
};

/**
 * Global toast notification component
 * @component
 * @example
 * // Add to App.jsx
 * <Toast />
 *
 * // To show toast, dispatch action:
 * dispatch(showToast({ message: 'Success!', severity: 'success' }));
 */
const Toast = () => {
  const dispatch = useDispatch();
  const { toast } = useSelector((state) => state.ui);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(clearToast());
  };

  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={toast.duration || 6000}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={toast.severity || "info"}
        variant="filled"
        elevation={6}
        sx={{
          width: "100%",
          borderRadius: 2,
          fontWeight: 500,
        }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
