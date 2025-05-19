/**
 * Controller module for handling post-related operations
 * @module postController
 */

import Post from "../models/Post.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import config from "../config/config.js";
import { v4 as uuidv4 } from "uuid";

/**
 * AWS S3 client instance for handling file uploads
 * @type {S3Client}
 */
const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

/**
 * Controller object containing post-related functions
 * @namespace postController
 */
const postController = {
  /**
   * Retrieves all posts with user details
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing array of posts
   * @throws {Error} If post retrieval fails
   */
  getPosts: async (req, res) => {
    try {
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("user", "username profilePicture");
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Error fetching posts" });
    }
  },

  /**
   * Creates a new post with optional image upload
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing post details
   * @param {string} req.body.title - Post title
   * @param {string} req.body.description - Post description
   * @param {Object} [req.file] - Uploaded image file
   * @param {Object} req.user - Authenticated user object
   * @param {string} req.user.id - User's ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing created post
   * @throws {Error} If post creation fails
   */
  createPost: async (req, res) => {
    try {
      const { title, description } = req.body;

      if (!title || !description) {
        return res
          .status(400)
          .json({ message: "Title and description are required." });
      }

      let imageUrl = null;

      if (req.file) {
        const fileKey = `posts/${uuidv4()}-${req.file.originalname}`;

        const params = {
          Bucket: config.aws.bucket,
          Key: fileKey,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        imageUrl = `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${fileKey}`;
      }

      const post = new Post({
        title,
        description,
        image: imageUrl,
        user: req.user.id,
      });

      await post.save();

      const populatedPost = await Post.findById(post._id).populate(
        "user",
        "username profilePicture"
      );

      res.status(201).json(populatedPost);
    } catch (error) {
      console.error("Error creating post:", error);
      res
        .status(400)
        .json({ message: "Error creating post", error: error.message });
    }
  },

  /**
   * Retrieves all posts for a specific user
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.userId - ID of the user whose posts to retrieve
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing array of user's posts
   * @throws {Error} If post retrieval fails
   */
  getUserPosts: async (req, res) => {
    try {
      const { userId } = req.params;
      const posts = await Post.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("user", "username profilePicture");
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user posts" });
    }
  },

  /**
   * Deletes a post if the user is authorized
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - ID of the post to delete
   * @param {Object} req.user - Authenticated user object
   * @param {string} req.user.id - User's ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response confirming post deletion
   * @throws {Error} If post deletion fails or user is not authorized
   */
  deletePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (post.user.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this post" });
      }

      await Post.findByIdAndDelete(req.params.id);
      res.json({ message: "Post deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting post" });
    }
  },
};

export { postController as default, postController };
export const { getPosts, createPost, getUserPosts, deletePost } =
  postController;
