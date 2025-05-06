import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../features/posts/postsAPI";
import { clearError } from "../features/posts/postsSlice";
import useLoading from "./useLoading";

const usePosts = () => {
  const dispatch = useDispatch();
  const { allPosts, error } = useSelector((state) => state.posts);

  const loading = useLoading("posts/fetchPosts");

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

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
