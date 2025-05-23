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
   * Searches for users by username
   * @param {Object} req - Express request object
   * @param {Object} req.query - Query parameters
   * @param {string} req.query.query - Search query string
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing array of matching users
   * @throws {Error} If user search fails
   * @example
   * // Route: GET /api/users/search?query=john
   * // Returns up to 10 users whose usernames match the query
   */
  searchUsers: async (req, res) => {
    try {
      const { query } = req.query;

      // Search users whose username matches the query (case-insensitive)
      const users = await User.find({
        username: { $regex: query, $options: "i" },
      })
        .select("username profilePicture")
        .limit(10);

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error searching users" });
    }
  },
};

export { userController as default };
export const {
  updateProfilePicture,
  updateUsername,
  getUserProfile,
  searchUsers,
} = userController;
