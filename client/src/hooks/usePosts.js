import { useState, useEffect } from "react";

const usePosts = (token) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/posts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (isMounted) {
          const uniquePosts = Array.from(
            new Map(data.map((post) => [post._id, post])).values()
          );
          setPosts(uniquePosts);
        }
      } catch (error) {
        if (isMounted) setError(error.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return { posts, loading, error };
};

export default usePosts;
