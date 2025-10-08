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
  getRecommendedUsers,
  getUserStats,
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
 * @route GET /api/users/recommended
 * @desc Get recommended users for the authenticated user
 * @access Private
 * @param {number} [req.query.limit] - Limit results
 * @returns {Object} JSON response containing recommended users
 */
router.get("/recommended", protect, getRecommendedUsers);

/**
 * @route GET /api/users/:id/stats
 * @desc Get user statistics (posts, likes, comments)
 * @access Private
 * @param {string} req.params.id - User ID
 * @returns {Object} JSON response containing user statistics
 */
router.get("/:id/stats", protect, getUserStats);

export default router;
