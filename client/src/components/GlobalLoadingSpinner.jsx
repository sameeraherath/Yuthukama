import { useSelector } from "react-redux";
import { CircularProgress, Backdrop } from "@mui/material";

const GlobalLoadingSpinner = ({ actions = [] }) => {
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
