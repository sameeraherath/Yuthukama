/**
 * Router module for user-related endpoints
 * @module routes/userRoutes
 */

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUsername,
  updateProfilePicture,
  searchUsers,
  getUserStats,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowStatus,
} from "../controllers/userController.js";
import multer from "multer";

/**
 * Express router instance for user routes
 * @type {express.Router}
 */
const router = express.Router();

/**
 * Multer middleware for handling file uploads
 * @type {multer.Multer}
 */
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @route GET /api/users/profile
 * @desc Get the authenticated user's profile
 * @access Private
 * @returns {Object} JSON response containing user profile details
 */
router.get("/profile", protect, getUserProfile);

/**
 * @route PUT /api/users/username
 * @desc Update the authenticated user's username
 * @access Private
 * @param {Object} req.body - Request body
 * @param {string} req.body.username - New username
 * @returns {Object} JSON response containing updated user details
 */
router.put("/username", protect, updateUsername);

/**
 * @route PUT /api/users/profile-pic
 * @desc Update the authenticated user's profile picture
 * @access Private
 * @param {Object} req.file - Uploaded file
 * @param {Buffer} req.file.buffer - Image buffer
 * @param {string} req.file.mimetype - Image MIME type
 * @returns {Object} JSON response containing updated user details with new profile picture URL
 */
router.put(
  "/profile-pic",
  protect,
  upload.single("profilePic"),
  updateProfilePicture
);

/**
 * @route GET /api/users/search
 * @desc Search for users by username or email
 * @access Private
 * @param {string} req.query.query - Search query
 * @param {string} [req.query.role] - Filter by role
 * @param {number} [req.query.limit] - Limit results
 * @returns {Object} JSON response containing matching users
 */
router.get("/search", protect, searchUsers);


/**
 * @route GET /api/users/:id
 * @desc Get user profile by ID
 * @access Private
 * @param {string} req.params.id - User ID
 * @returns {Object} JSON response containing user profile
 */
router.get("/:id", protect, getUserProfile);

/**
 * @route GET /api/users/:id/stats
 * @desc Get user statistics (posts, likes, comments)
 * @access Private
 * @param {string} req.params.id - User ID
 * @returns {Object} JSON response containing user statistics
 */
router.get("/:id/stats", protect, getUserStats);

/**
 * @route POST /api/users/:id/follow
 * @desc Follow a user
 * @access Private
 * @param {string} req.params.id - User ID to follow
 * @returns {Object} JSON response with success message
 */
router.post("/:id/follow", protect, followUser);

/**
 * @route DELETE /api/users/:id/follow
 * @desc Unfollow a user
 * @access Private
 * @param {string} req.params.id - User ID to unfollow
 * @returns {Object} JSON response with success message
 */
router.delete("/:id/follow", protect, unfollowUser);

/**
 * @route GET /api/users/:id/followers
 * @desc Get followers list for a user
 * @access Private
 * @param {string} req.params.id - User ID
 * @param {number} [req.query.limit] - Limit results
 * @param {number} [req.query.offset] - Offset for pagination
 * @returns {Object} JSON response containing followers list
 */
router.get("/:id/followers", protect, getFollowers);

/**
 * @route GET /api/users/:id/following
 * @desc Get following list for a user
 * @access Private
 * @param {string} req.params.id - User ID
 * @param {number} [req.query.limit] - Limit results
 * @param {number} [req.query.offset] - Offset for pagination
 * @returns {Object} JSON response containing following list
 */
router.get("/:id/following", protect, getFollowing);

/**
 * @route GET /api/users/:id/follow-status
 * @desc Check if current user is following a specific user
 * @access Private
 * @param {string} req.params.id - User ID to check
 * @returns {Object} JSON response with follow status
 */
router.get("/:id/follow-status", protect, getFollowStatus);

export default router;
