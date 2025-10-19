import User from "../models/User.js";
import Post from "../models/Post.js";
import Message from "../models/Message.js";
import Notification from "../models/Notification.js";

/**
 * Controller for admin operations
 */
const adminController = {
  /**
   * Get comprehensive dashboard statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getDashboardStats: async (req, res) => {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Get basic counts
      const [
        totalUsers,
        activeUsers,
        newUsers,
        newUsersThisWeek,
        newUsersToday,
        totalPosts,
        newPostsToday,
        reportedPosts,
        totalMessages,
        totalNotifications,
        verifiedUsers,
        unverifiedUsers
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ lastLogin: { $gte: thirtyDaysAgo } }),
        User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
        User.countDocuments({ createdAt: { $gte: oneDayAgo } }),
        Post.countDocuments(),
        Post.countDocuments({ createdAt: { $gte: oneDayAgo } }),
        Post.countDocuments({ 'reports.0': { $exists: true } }),
        Message.countDocuments(),
        Notification.countDocuments(),
        User.countDocuments({ isEmailVerified: true }),
        User.countDocuments({ isEmailVerified: false })
      ]);

      // Calculate engagement metrics
      const postsWithEngagement = await Post.aggregate([
        {
          $project: {
            totalEngagement: { $add: [{ $size: "$likes" }, { $size: "$comments" }] },
            views: 1
          }
        },
        {
          $group: {
            _id: null,
            avgEngagement: { $avg: "$totalEngagement" },
            totalViews: { $sum: "$views" },
            totalPosts: { $sum: 1 }
          }
        }
      ]);

      const avgEngagement = postsWithEngagement.length > 0 
        ? Math.round(postsWithEngagement[0].avgEngagement || 0) 
        : 0;

      res.json({
        totalUsers,
        activeUsers,
        newUsers,
        newUsersThisWeek,
        newUsersToday,
        totalPosts,
        newPostsToday,
        reportedPosts,
        totalMessages,
        totalNotifications,
        verifiedUsers,
        unverifiedUsers,
        avgEngagement,
        totalViews: postsWithEngagement.length > 0 ? postsWithEngagement[0].totalViews : 0
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
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

  /**
   * Get all users with pagination and filters
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAllUsers: async (req, res) => {
    try {
      const { page = 1, limit = 10, search, role, verified, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      
      // Build filter object
      const filter = {};
      
      if (search) {
        filter.$or = [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (role && role !== 'all') {
        filter.role = role;
      }
      
      if (verified !== undefined) {
        filter.isEmailVerified = verified === 'true';
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const users = await User.find(filter)
        .select('-password -resetPasswordToken -emailVerificationToken')
        .populate('followers', 'username')
        .populate('following', 'username')
        .sort(sort)
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

      const total = await User.countDocuments(filter);

      // Get additional stats for each user
      const usersWithStats = await Promise.all(
        users.map(async (user) => {
          const [postCount, followerCount, followingCount] = await Promise.all([
            Post.countDocuments({ user: user._id }),
            User.countDocuments({ followers: user._id }),
            User.countDocuments({ following: user._id })
          ]);

          return {
            ...user.toObject(),
            stats: {
              posts: postCount,
              followers: followerCount,
              following: followingCount
            }
          };
        })
      );

      res.json({
        users: usersWithStats,
        pagination: {
          totalPages: Math.ceil(total / parseInt(limit)),
          currentPage: parseInt(page),
          total,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Error fetching users" });
    }
  },

  /**
   * Update user role or status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updateUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const { role, isEmailVerified } = req.body;
      
      const updateData = {};
      if (role && ['user', 'admin'].includes(role)) {
        updateData.role = role;
      }
      if (isEmailVerified !== undefined) {
        updateData.isEmailVerified = Boolean(isEmailVerified);
      }
      
      const user = await User.findByIdAndUpdate(
        userId, 
        updateData, 
        { new: true, select: '-password -resetPasswordToken -emailVerificationToken' }
      );
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ message: "User updated successfully", user });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Error updating user" });
    }
  },

  /**
   * Delete user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Prevent admin from deleting themselves
      if (user._id.toString() === req.user.id) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }

      // Delete user and related data
      await Promise.all([
        User.findByIdAndDelete(userId),
        Post.deleteMany({ user: userId }),
        Message.deleteMany({ sender: userId }),
        Notification.deleteMany({ $or: [{ sender: userId }, { recipient: userId }] })
      ]);
      
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Error deleting user" });
    }
  },

  /**
   * Get analytics data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAnalytics: async (req, res) => {
    try {
      const { period = '30d' } = req.query;
      
      let daysBack;
      switch (period) {
        case '7d': daysBack = 7; break;
        case '30d': daysBack = 30; break;
        case '90d': daysBack = 90; break;
        default: daysBack = 30;
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      // User growth over time
      const userGrowth = await User.aggregate([
        {
          $match: { createdAt: { $gte: startDate } }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      // Post activity over time
      const postActivity = await Post.aggregate([
        {
          $match: { createdAt: { $gte: startDate } }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            posts: { $sum: 1 },
            totalLikes: { $sum: { $size: "$likes" } },
            totalComments: { $sum: { $size: "$comments" } }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      // Top users by activity
      const topUsers = await User.aggregate([
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "user",
            as: "posts"
          }
        },
        {
          $project: {
            username: 1,
            email: 1,
            profilePicture: 1,
            createdAt: 1,
            postCount: { $size: "$posts" },
            totalLikes: {
              $sum: {
                $map: {
                  input: "$posts",
                  as: "post",
                  in: { $size: "$$post.likes" }
                }
              }
            }
          }
        },
        {
          $sort: { postCount: -1, totalLikes: -1 }
        },
        {
          $limit: 10
        }
      ]);

      // Content type distribution
      const contentTypes = await Post.aggregate([
        {
          $group: {
            _id: {
              $cond: [
                { $ne: ["$image", null] },
                "With Image",
                "Text Only"
              ]
            },
            count: { $sum: 1 }
          }
        }
      ]);

      res.json({
        userGrowth,
        postActivity,
        topUsers,
        contentTypes,
        period
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Error fetching analytics" });
    }
  }
};

export default adminController;
