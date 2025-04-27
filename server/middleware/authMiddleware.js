import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes that require authentication
export const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header is present and starts with 'Bearer'
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }

  try {
    // Extract token from Authorization header
    token = req.headers.authorization.split(" ")[1];
    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Get user from database (exclude password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user object to request for use in protected routes
    req.user = user;
    next();
  } catch (err) {
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
