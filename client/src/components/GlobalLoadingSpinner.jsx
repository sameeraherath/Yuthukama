import { useSelector } from "react-redux";
import { CircularProgress, Backdrop } from "@mui/material";

/**
 * Global loading spinner component that shows during async operations
 * @component
 * @param {Object} props - Component props
 * @param {string[]} [props.actions=[]] - Array of action types to monitor for loading state
 * @returns {JSX.Element} Loading spinner overlay
 * @example
 * // Show spinner for specific actions
 * <GlobalLoadingSpinner actions={['posts/fetchPosts', 'auth/loginUser']} />
 *
 * // Show spinner for any loading state
 * <GlobalLoadingSpinner />
 */
const GlobalLoadingSpinner = ({ actions = [] }) => {
  /**
   * Selects loading state from Redux store
   * @type {boolean}
   */
  const loading = useSelector((state) => {
    const loadingState = state.ui?.loading || {};

    if (actions && actions.length > 0) {
      return actions.some((action) => loadingState[action]);
    }

    return Object.values(loadingState).some((isLoading) => isLoading);
  });

  return (
    <Backdrop
      sx={{
        color: "#ffffff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "transparent",
      }}
      open={loading}
    >
      <CircularProgress sx={{ color: "#1dbf73" }} />
    </Backdrop>
  );
};

export default GlobalLoadingSpinner;
