import { protect } from "./authMiddleware.js";

/**
 * Middleware to protect admin routes
 * Verifies if the authenticated user has admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 * @throws {Error} If user is not an admin
 */
export const adminProtect = async (req, res, next) => {
  try {
    // First check if user is authenticated
    await protect(req, res, () => {
      // Then check if user is admin
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized as admin" });
      }
      next();
    });
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(401).json({ message: "Not authorized" });
  }
};
