import User from "../models/User.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const authController = {
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
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error in user login" });
    }
  },
  logoutUser: (req, res) => {
    try {
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error logging out" });
    }
  },
  checkAuth: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Session expired" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error checking session" });
    }
  },
};

export { authController as default };
export const { registerUser, loginUser, logoutUser, checkAuth } =
  authController;
