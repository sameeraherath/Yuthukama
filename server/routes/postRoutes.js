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
  searchPosts,
  getTrendingPosts,
  toggleSavePost,
  getSavedPosts,
  reportPost,
  getFollowingPosts,
  getForYouPosts,
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
router
  .route("/")
  .get(protect, getPosts)
  .post(protect, validateCreatePost, createPost);

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
router
  .route("/:id")
  .put(protect, validateUpdatePost, updatePost)
  .delete(protect, validateMongoId, deletePost);

router.put("/:id/like", protect, validateMongoId, toggleLikePost);

/**
 * @route PUT /api/posts/:id/save
 * @desc Toggle save/unsave a post
 * @access Private
 */
router.put("/:id/save", protect, validateMongoId, toggleSavePost);

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

/**
 * @route GET /api/posts/search
 * @desc Search posts by title, description, or category
 * @access Private
 * @param {string} req.query.query - Search query
 * @param {string} [req.query.category] - Filter by category
 * @param {string} [req.query.sortBy] - Sort by field (createdAt, likes)
 * @param {number} [req.query.limit] - Limit results
 * @returns {Object} JSON response containing matching posts
 */
router.get("/search", protect, searchPosts);

/**
 * @route GET /api/posts/trending
 * @desc Get trending/popular posts
 * @access Private
 * @param {number} [req.query.limit] - Limit results
 * @param {number} [req.query.days] - Consider posts from last N days
 * @returns {Object} JSON response containing trending posts
 */
router.get("/trending", protect, getTrendingPosts);

/**
 * @route GET /api/posts/saved
 * @desc Get user's saved posts
 * @access Private
 * @returns {Object} JSON response containing saved posts
 */
router.get("/saved", protect, getSavedPosts);

/**
 * @route GET /api/posts/following
 * @desc Get posts from users that the current user follows
 * @access Private
 * @param {number} [req.query.limit] - Limit results (default: 20)
 * @param {number} [req.query.page] - Page number (default: 1)
 * @returns {Object} JSON response containing posts from followed users
 */
router.get("/following", protect, getFollowingPosts);

/**
 * @route GET /api/posts/for-you
 * @desc Get personalized "For You" feed with algorithmic recommendations
 * @access Private
 * @param {number} [req.query.limit] - Limit results (default: 20)
 * @param {number} [req.query.page] - Page number (default: 1)
 * @returns {Object} JSON response containing recommended posts
 */
router.get("/for-you", protect, getForYouPosts);

/**
 * @route POST /api/posts/:id/report
 * @desc Report a post
 * @access Private
 * @param {string} req.params.id - ID of the post to report
 * @param {Object} req.body - Report data
 * @param {string} req.body.reason - Report reason
 * @param {string} [req.body.description] - Additional description
 * @returns {Object} JSON response confirming successful report
 */
router.post("/:id/report", protect, validateMongoId, reportPost);

export default router;
