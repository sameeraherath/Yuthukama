import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

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
router.post("/register", registerUser);

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and get token
 * @access Public
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email
 * @param {string} req.body.password - User's password
 * @returns {Object} JSON response containing JWT token and user details
 */
router.post("/login", loginUser);

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

export default router;
