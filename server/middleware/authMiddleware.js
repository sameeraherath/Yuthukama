/**
 * Authentication middleware module
 * @module authMiddleware
 */

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import config from "../config/config.js";

/**
 * Middleware to protect routes that require authentication
 * Verifies JWT token and attaches user object to request
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.authorization - Bearer token in format 'Bearer <token>'
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 * @throws {Error} If token is missing, invalid, or expired
 * @example
 * // In route file
 * router.get('/protected-route', protect, (req, res) => {
 *   // Access authenticated user via req.user
 * });
 */
export const protect = async (req, res, next) => {
  let token;

  console.log(
    "Auth Headers:",
    req.headers.authorization ? "Present" : "Missing"
  );

  // Check if Authorization header is present and starts with 'Bearer'
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    console.log("No valid authorization header found");
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }

  try {
    // Extract token from Authorization header
    token = req.headers.authorization.split(" ")[1];
    console.log("Token extracted successfully");

    // Verify token and extract user ID
    const decoded = jwt.verify(token, config.jwtSecret);
    console.log("Token verified successfully");

    if (!decoded.id) {
      console.log("Invalid token payload - no user ID");
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Get user from database (exclude password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("User not found in database");
      return res.status(401).json({ message: "User not found" });
    }

    console.log("User authenticated successfully:", user._id);
    // Attach user object to request for use in protected routes
    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication Error:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });

    // Handle invalid or expired tokens
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    // Handle server errors
    return res
      .status(500)
      .json({ message: "Server error during authorization" });
  }
};
