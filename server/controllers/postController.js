import Post from "../models/Post.js";

// @desc Get all posts
// @route GET /api/posts
// @access Public
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Create a post
// @route POST /api/posts
// @access Public
export const createPost = async (req, res) => {
  const { title, image, description } = req.body;

  try {
    const newPost = new Post({
      title,
      image,
      description,
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
