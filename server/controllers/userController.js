/**
 * Controller module for handling user-related operations
 * @module userController
 */

import User from "../models/User.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import config from "../config/config.js";

/**
 * AWS S3 client instance for handling profile picture uploads
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
 * Controller object containing user-related functions
 * @namespace userController
 */
const userController = {
  /**
   * Updates a user's profile picture
   * @param {Object} req - Express request object
   * @param {Object} req.file - Uploaded file from multer middleware
   * @param {Object} req.user - Authenticated user object
   * @param {string} req.user.id - User's ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing updated user object
   * @throws {Error} If profile picture update fails
   * @example
   * // Route: PUT /api/users/profile-pic
   * // Requires multipart/form-data with 'file' field
   */
  updateProfilePicture: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Get file details from multer middleware
      const file = req.file;

      // Create unique S3 key for the image
      const key = `profile-pictures/${req.user.id}-${Date.now()}-${
        file.originalname
      }`;

      // Prepare S3 upload command
      const command = new PutObjectCommand({
        Bucket: config.aws.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      // Upload file to S3
      await s3Client.send(command);

      // Generate public URL for the uploaded image
      const imageUrl = `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${key}`;

      // Update user's profile picture URL in database
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { profilePicture: imageUrl },
        { new: true }
      ).select("-password");

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error updating profile picture" });
    }
  },

  /**
   * Updates a user's username
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {string} req.body.username - New username
   * @param {Object} req.user - Authenticated user object
   * @param {string} req.user.id - User's ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing updated user object
   * @throws {Error} If username update fails or username is already taken
   * @example
   * // Route: PUT /api/users/username
   * // Request body: { "username": "newUsername" }
   */
  updateUsername: async (req, res) => {
    try {
      const { username } = req.body;

      // Check if username is provided
      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }

      // Check if username is already taken
      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.user.id },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Update username in database
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { username },
        { new: true }
      ).select("-password");

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error updating username" });
    }
  },

  /**
   * Retrieves a user's profile by ID
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - ID of the user to retrieve
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing user profile
   * @throws {Error} If user profile retrieval fails
   * @example
   * // Route: GET /api/users/:id
   */
  getUserProfile: async (req, res) => {
    try {
      // Find user by ID (excluding password)
      const user = await User.findById(req.params.id).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user profile" });
    }
  },

  /**
   * Searches for users by username or email with advanced filters
   * @param {Object} req - Express request object
   * @param {Object} req.query - Query parameters
   * @param {string} req.query.query - Search query string
   * @param {string} [req.query.role] - Filter by role (user/admin)
   * @param {number} [req.query.limit] - Limit results (default: 10, max: 50)
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing array of matching users
   * @throws {Error} If user search fails
   * @example
   * // Route: GET /api/users/search?query=john&role=user&limit=20
   * // Returns up to 20 users whose usernames or emails match the query
   */
  searchUsers: async (req, res) => {
    try {
      const { query, role, limit = 10 } = req.query;

      if (!query || query.trim().length === 0) {
        return res.status(400).json({ message: "Search query is required" });
      }

      // Build search filter
      const searchFilter = {
        $or: [
          { username: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      };

      // Add role filter if provided
      if (role) {
        searchFilter.role = role;
      }

      const limitNum = Math.min(parseInt(limit) || 10, 50); // Max 50 results

      // Search users
      const users = await User.find(searchFilter)
        .select("username email profilePicture role createdAt")
        .limit(limitNum)
        .sort({ username: 1 });

      res.json({
        count: users.length,
        users,
      });
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ message: "Error searching users" });
    }
  },

  /**
   * Gets recommended users for the authenticated user
   * Based on recent activity, popular users, and new users
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {string} req.user._id - User's ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing recommended users
   * @throws {Error} If recommendation fails
   */
  getRecommendedUsers: async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      const limitNum = Math.min(parseInt(limit) || 10, 20);

      // Exclude current user from recommendations
      const recommendedUsers = await User.find({
        _id: { $ne: req.user._id },
      })
        .select("username profilePicture createdAt")
        .sort({ createdAt: -1 }) // Newer users first
        .limit(limitNum);

      res.json({
        count: recommendedUsers.length,
        users: recommendedUsers,
      });
    } catch (error) {
      console.error("Error getting recommended users:", error);
      res.status(500).json({ message: "Error getting recommended users" });
    }
  },

  /**
   * Gets user statistics
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - User ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing user statistics
   * @throws {Error} If fetching stats fails
   */
  getUserStats: async (req, res) => {
    try {
      const userId = req.params.id;

      // Import Post model here to avoid circular dependency
      const Post = (await import("../models/Post.js")).default;

      // Get post count
      const postCount = await Post.countDocuments({ user: userId });

      // Get total likes received on all posts
      const posts = await Post.find({ user: userId }).select("likes");
      const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);

      // Get total comments received on all posts
      const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);

      res.json({
        postCount,
        totalLikes,
        totalComments,
      });
    } catch (error) {
      console.error("Error getting user stats:", error);
      res.status(500).json({ message: "Error getting user statistics" });
    }
  },
};

export { userController as default };
export const {
  updateProfilePicture,
  updateUsername,
  getUserProfile,
  searchUsers,
  getRecommendedUsers,
  getUserStats,
} = userController;
