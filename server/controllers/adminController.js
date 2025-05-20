import User from "../models/User.js";
import Post from "../models/Post.js";

/**
 * Controller for admin operations
 */
const adminController = {
  /**
   * Get dashboard statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getDashboardStats: async (req, res) => {
    try {
      // Get total users
      const totalUsers = await User.countDocuments();

      // Get active users (users who logged in within last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const activeUsers = await User.countDocuments({
        lastLogin: { $gte: thirtyDaysAgo },
      });

      // Get new users in last 30 days
      const newUsers = await User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
      });

      // Get total posts
      const totalPosts = await Post.countDocuments();

      res.json({
        totalUsers,
        activeUsers,
        newUsers,
        totalPosts,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching dashboard stats" });
    }
  },

  /**
   * Get user statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getUserStats: async (req, res) => {
    try {
      // Get user growth data for the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const userGrowth = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]);

      res.json({ userGrowth });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user stats" });
    }
  },
};

export default adminController;
