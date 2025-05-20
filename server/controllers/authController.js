import User from "../models/User.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

/**
 * Controller object containing authentication-related functions
 * @namespace authController
 */
const authController = {
  /**
   * Registers a new user in the system
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing user details
   * @param {string} req.body.username - Username of the new user
   * @param {string} req.body.email - Email address of the new user
   * @param {string} req.body.password - Password for the new user
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing JWT token and user details
   * @throws {Error} If user registration fails
   */
  registerUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      user = new User({
        username,
        email,
        password,
      });
      await user.save();

      const token = jwt.sign({ id: user._id }, config.jwtSecret, {
        expiresIn: "30d",
      });
      res.status(201).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error in user registration" });
    }
  },
  /**
   * Authenticates a user and generates a JWT token
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing login credentials
   * @param {string} req.body.email - User's email address
   * @param {string} req.body.password - User's password
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing JWT token and user details
   * @throws {Error} If login fails or credentials are invalid
   */
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user._id }, config.jwtSecret, {
        expiresIn: "30d",
      });

      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error in user login" });
    }
  },
  /**
   * Handles user logout
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response confirming successful logout
   * @throws {Error} If logout process fails
   */
  logoutUser: (req, res) => {
    try {
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error logging out" });
    }
  },
  /**
   * Verifies user's authentication status
   * @param {Object} req - Express request object
   * @param {Object} req.user - User object from authentication middleware
   * @param {string} req.user.id - User's ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing user details if authenticated
   * @throws {Error} If session check fails or user is not authenticated
   */
  checkAuth: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Session expired" });
      }
      res.json({
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role,
      });
    } catch (error) {
      res.status(500).json({ message: "Error checking session" });
    }
  },
};

export { authController as default };
export const { registerUser, loginUser, logoutUser, checkAuth } =
  authController;
