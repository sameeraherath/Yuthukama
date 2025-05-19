import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../features/posts/postsAPI";
import { clearError } from "../features/posts/postsSlice";
import useLoading from "./useLoading";

/**
 * Custom hook for managing posts data and operations
 * @returns {Object} Posts state and loading status
 * @property {Array<Object>} posts - Array of post objects
 * @property {boolean} loading - Loading state of posts fetch operation
 * @property {string|null} error - Error message if any
 * @example
 * const { posts, loading, error } = usePosts();
 *
 * // Display posts
 * {posts.map(post => (
 *   <PostCard key={post._id} post={post} />
 * ))}
 */
const usePosts = () => {
  const dispatch = useDispatch();
  const { allPosts, error } = useSelector((state) => state.posts);

  const loading = useLoading("posts/fetchPosts");

  /**
   * Effect hook to fetch posts on component mount
   * @effect
   * @listens {dispatch} - Redux dispatch function
   */
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  /**
   * Effect hook to clear error message after timeout
   * @effect
   * @listens {error} - Error message
   * @listens {dispatch} - Redux dispatch function
   */
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  return {
    posts: allPosts,
    loading,
    error,
  };
};

export default usePosts;
