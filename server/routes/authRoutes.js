import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validatePasswordChange,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @param {Object} req.body - Request body
 * @param {string} req.body.username - User's username
 * @param {string} req.body.email - User's email
 * @param {string} req.body.password - User's password
 * @returns {Object} JSON response containing JWT token and user details
 */
router.post("/register", validateRegister, registerUser);

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and get token
 * @access Public
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email
 * @param {string} req.body.password - User's password
 * @returns {Object} JSON response containing JWT token and user details
 */
router.post("/login", validateLogin, loginUser);

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Public
 * @returns {Object} JSON response confirming successful logout
 */
router.post("/logout", logoutUser);

/**
 * @route GET /api/auth/check
 * @desc Check if user is authenticated
 * @access Private
 * @returns {Object} JSON response containing user details if authenticated
 */
router.get("/check", protect, checkAuth);

/**
 * @route POST /api/auth/forgot-password
 * @desc Request password reset
 * @access Public
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email address
 * @returns {Object} JSON response confirming reset email sent
 */
router.post("/forgot-password", validateForgotPassword, forgotPassword);

/**
 * @route POST /api/auth/reset-password/:resetToken
 * @desc Reset password using token
 * @access Public
 * @param {string} req.params.resetToken - Password reset token
 * @param {Object} req.body - Request body
 * @param {string} req.body.password - New password
 * @param {string} req.body.confirmPassword - Password confirmation
 * @returns {Object} JSON response confirming password reset
 */
router.post(
  "/reset-password/:resetToken",
  validateResetPassword,
  resetPassword
);

/**
 * @route PUT /api/auth/change-password
 * @desc Change password for authenticated user
 * @access Private
 * @param {Object} req.body - Request body
 * @param {string} req.body.currentPassword - Current password
 * @param {string} req.body.newPassword - New password
 * @param {string} req.body.confirmPassword - Password confirmation
 * @returns {Object} JSON response confirming password change
 */
router.put("/change-password", protect, validatePasswordChange, changePassword);

export default router;
