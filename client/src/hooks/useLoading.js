import { useSelector } from "react-redux";

const useLoading = (actionType) => {
  const specificLoading = useSelector((state) => {
    if (state.ui && state.ui.loading && actionType) {
      return state.ui.loading[actionType];
    }
    return false;
  });

  const authLoading = useSelector((state) => state.auth?.loading);
  const postsLoading = useSelector((state) => state.posts?.loading);
  const userLoading = useSelector((state) => state.user?.loading);
  const chatLoading = useSelector((state) => state.chat?.loading);
  const uiLoading = useSelector((state) =>
    Object.values(state.ui?.loading || {}).some(Boolean)
  );

  if (actionType) {
    return specificLoading || false;
  }

  const isAnyLoading =
    authLoading || postsLoading || userLoading || chatLoading || uiLoading;

  return {
    isLoading: isAnyLoading,
    authLoading,
    postsLoading,
    userLoading,
    chatLoading,
    uiLoading,
  };
};

export default useLoading;
