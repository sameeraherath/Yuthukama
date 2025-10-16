import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchPosts,
  fetchFollowingPosts, 
  fetchForYouPosts,
  setCurrentFeedType 
} from "../features/posts/postsSlice";
import useLoading from "./useLoading";

/**
 * Custom hook for managing different feed types (All, Following, For You)
 * @param {string} feedType - The type of feed to manage ('all', 'following', 'forYou')
 * @returns {Object} Feed state and loading status
 * @property {Array} posts - Array of post objects for the current feed
 * @property {boolean} loading - Loading state of the current feed
 * @property {string|null} error - Error message if any
 * @property {string} currentFeedType - Current active feed type
 * @property {Function} switchFeed - Function to switch between feed types
 * 
 * @example
 * const { posts, loading, error, switchFeed } = useFeed('following');
 * 
 * // Switch to For You feed
 * switchFeed('forYou');
 */
const useFeed = (feedType = 'all') => {
  const dispatch = useDispatch();
  const { 
    allPosts, 
    followingPosts, 
    forYouPosts, 
    currentFeedType, 
    error 
  } = useSelector((state) => state.posts);

  // Get loading state for the specific feed type
  const loading = useLoading(`posts/fetch${feedType === 'all' ? 'Posts' : feedType === 'following' ? 'FollowingPosts' : 'ForYouPosts'}`);

  /**
   * Effect hook to fetch posts when feed type changes
   * @effect
   * @listens {feedType} - Current feed type
   * @listens {dispatch} - Redux dispatch function
   */
  useEffect(() => {
    // Update current feed type in state
    dispatch(setCurrentFeedType(feedType));

    // Fetch posts based on feed type
    switch (feedType) {
      case 'following':
        dispatch(fetchFollowingPosts({ limit: 20, page: 1 }));
        break;
      case 'forYou':
        dispatch(fetchForYouPosts({ limit: 20, page: 1 }));
        break;
      case 'all':
      default:
        dispatch(fetchPosts());
        break;
    }
  }, [feedType, dispatch]);

  /**
   * Get posts for the current feed type
   */
  const getPostsForFeed = () => {
    switch (feedType) {
      case 'following':
        return followingPosts;
      case 'forYou':
        return forYouPosts;
      case 'all':
      default:
        return allPosts;
    }
  };

  /**
   * Switch to a different feed type
   * @param {string} newFeedType - The new feed type to switch to
   */
  const switchFeed = (newFeedType) => {
    if (newFeedType !== currentFeedType) {
      // This will trigger the useEffect above
      window.location.hash = `#feed=${newFeedType}`;
    }
  };

  return {
    posts: getPostsForFeed(),
    loading,
    error,
    currentFeedType,
    switchFeed,
  };
};

export default useFeed;
