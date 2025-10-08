import express from "express";
import {
  getPosts,
  createPost,
  getUserPosts,
  deletePost,
  updatePost,
  toggleLikePost,
  addComment,
  deleteComment,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  validateCreatePost,
  validateUpdatePost,
  validateComment,
  validateMongoId,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

/**
 * @route GET /api/posts
 * @desc Get all posts
 * @access Private
 * @returns {Object} JSON response containing array of posts
 */
/**
 * @route POST /api/posts
 * @desc Create a new post
 * @access Private
 * @param {Object} req.body - Request body
 * @param {string} req.body.title - Post title
 * @param {string} req.body.description - Post description
 * @param {string} req.body.image - Post image URL
 * @returns {Object} JSON response containing the created post
 */
router.route("/").get(protect, getPosts).post(protect, validateCreatePost, createPost);

/**
 * @route GET /api/posts/user/:userId
 * @desc Get all posts by a specific user
 * @access Private
 * @param {string} req.params.userId - ID of the user whose posts to retrieve
 * @returns {Object} JSON response containing array of user's posts
 */
router.route("/user/:userId").get(protect, getUserPosts);

/**
 * @route PUT /api/posts/:id
 * @desc Update a post
 * @access Private
 * @param {string} req.params.id - ID of the post to update
 * @param {Object} req.body - Updated post data
 * @returns {Object} JSON response containing updated post
 */
/**
 * @route DELETE /api/posts/:id
 * @desc Delete a post
 * @access Private
 * @param {string} req.params.id - ID of the post to delete
 * @returns {Object} JSON response confirming successful deletion
 */
router.route("/:id")
  .put(protect, validateUpdatePost, updatePost)
  .delete(protect, validateMongoId, deletePost);

router.put("/:id/like", protect, validateMongoId, toggleLikePost);

/**
 * @route POST /api/posts/:id/comments
 * @desc Add a comment to a post
 * @access Private
 */
router.route("/:id/comments").post(protect, validateComment, addComment);

/**
 * @route DELETE /api/posts/:id/comments/:commentId
 * @desc Delete a comment from a post
 * @access Private
 */
router.route("/:id/comments/:commentId").delete(protect, deleteComment);

export default router;
