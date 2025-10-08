import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
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
   * @returns {Object} JSON response containing user details and sets HTTP-only cookie
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

      // Set HTTP-only cookie for enhanced security
      res.cookie("token", token, {
        httpOnly: true, // Prevents XSS attacks
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "strict", // CSRF protection
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(201).json({
        token, // Keep for backward compatibility temporarily
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
   * @returns {Object} JSON response containing user details and sets HTTP-only cookie
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

      // Set HTTP-only cookie for enhanced security
      res.cookie("token", token, {
        httpOnly: true, // Prevents XSS attacks
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "strict", // CSRF protection
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({
        token, // Keep for backward compatibility temporarily
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
      // Clear the HTTP-only cookie
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
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

  /**
   * Initiates password reset process
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {string} req.body.email - User's email address
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with reset token (in production, send via email)
   * @throws {Error} If password reset initiation fails
   */
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      
      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if user exists for security
        return res.json({ 
          message: "If an account with that email exists, a password reset link has been sent." 
        });
      }

      // Generate reset token
      const resetToken = user.getResetPasswordToken();
      await user.save();

      // TODO: In production, send this via email service (SendGrid, AWS SES, etc.)
      // For now, return it in response (ONLY FOR DEVELOPMENT)
      const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
      
      res.json({
        message: "Password reset link has been sent to your email",
        // Remove resetToken from response in production!
        resetToken: process.env.NODE_ENV === "development" ? resetToken : undefined,
        resetUrl: process.env.NODE_ENV === "development" ? resetUrl : undefined,
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Error processing password reset request" });
    }
  },

  /**
   * Resets user password using reset token
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.resetToken - Password reset token
   * @param {Object} req.body - Request body
   * @param {string} req.body.password - New password
   * @param {Object} res - Express response object
   * @returns {Object} JSON response confirming password reset
   * @throws {Error} If password reset fails
   */
  resetPassword: async (req, res) => {
    try {
      const { resetToken } = req.params;
      const { password } = req.body;

      // Find users with non-expired reset tokens
      const users = await User.find({
        resetPasswordExpire: { $gt: Date.now() },
      });

      // Find user with matching token
      let user = null;
      for (const u of users) {
        if (u.resetPasswordToken && bcrypt.compareSync(resetToken, u.resetPasswordToken)) {
          user = u;
          break;
        }
      }

      if (!user) {
        return res.status(400).json({ 
          message: "Invalid or expired password reset token" 
        });
      }

      // Set new password (will be hashed by pre-save middleware)
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Error resetting password" });
    }
  },

  /**
   * Changes user password (requires current password)
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user from middleware
   * @param {Object} req.body - Request body
   * @param {string} req.body.currentPassword - Current password
   * @param {string} req.body.newPassword - New password
   * @param {Object} res - Express response object
   * @returns {Object} JSON response confirming password change
   * @throws {Error} If password change fails
   */
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Set new password (will be hashed by pre-save middleware)
      user.password = newPassword;
      await user.save();

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ message: "Error changing password" });
    }
  },
};

export { authController as default };
export const { 
  registerUser, 
  loginUser, 
  logoutUser, 
  checkAuth,
  forgotPassword,
  resetPassword,
  changePassword,
} = authController;
