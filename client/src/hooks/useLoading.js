import { useSelector } from "react-redux";

/**
 * Custom hook for managing loading states across different parts of the application
 * @param {string} [actionType] - Optional action type to check specific loading state
 * @returns {boolean|Object} Loading state(s)
 * @returns {boolean} [returns.isLoading] - Whether any part of the app is loading
 * @returns {boolean} [returns.authLoading] - Authentication loading state
 * @returns {boolean} [returns.postsLoading] - Posts loading state
 * @returns {boolean} [returns.userLoading] - User data loading state
 * @returns {boolean} [returns.chatLoading] - Chat loading state
 * @returns {boolean} [returns.uiLoading] - UI loading state
 * @example
 * // Check specific action loading state
 * const isLoading = useLoading('posts/fetchPosts');
 *
 * // Check all loading states
 * const { isLoading, authLoading, postsLoading } = useLoading();
 */
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
