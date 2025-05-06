import { useSelector } from "react-redux";

const useLoading = (actionType) => {
  const isLoading = useSelector((state) => {
    if (state.ui && state.ui.loading) {
      return state.ui.loading[actionType];
    } else {
      return false;
    }
  });

  return isLoading || false;
};

export default useLoading;
