import Notification from "../models/Notification.js";
import User from "../models/User.js";

let io = null;

// Set Socket.IO instance for broadcasting notifications
export const setSocketIO = (socketIO) => {
  io = socketIO;
};

const notificationController = {
  // Create a new notification with improved content and preference checking
  createNotification: async (data) => {
    try {
      // Check user's notification preferences
      const user = await User.findById(data.recipient).select('notificationPreferences');
      
      if (user && user.notificationPreferences) {
        const preferences = user.notificationPreferences.inApp;
        if (preferences && preferences[data.type] === false) {
          // User has disabled this type of notification
          return null;
        }
      }

      const notification = new Notification(data);
      await notification.save();
      
      // Populate sender and relatedPost for real-time broadcasting
      await notification.populate([
        { path: "sender", select: "username profilePicture" },
        { path: "relatedPost", select: "title" }
      ]);
      
      // Create enhanced content with user names
      let enhancedContent = data.content;
      if (notification.sender) {
        const senderName = notification.sender.username;
        switch (data.type) {
          case "like":
            enhancedContent = `${senderName} liked your post`;
            break;
          case "comment":
            enhancedContent = `${senderName} commented on your post`;
            break;
          case "follow":
            enhancedContent = `${senderName} started following you`;
            break;
          case "message":
            enhancedContent = `${senderName} sent you a message`;
            break;
          case "mention":
            enhancedContent = `${senderName} mentioned you`;
            break;
          default:
            enhancedContent = data.content;
        }
      }
      
      // Update notification with enhanced content
      notification.content = enhancedContent;
      await notification.save();
      
      // Broadcast notification to recipient via Socket.IO
      if (io) {
        io.to(`user_${data.recipient}`).emit("notification", notification);
      }
      
      return notification;
    } catch (error) {
      throw error;
    }
  },

  // Get user's notifications with pagination
  getUserNotifications: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      // Get total count for pagination info
      const totalCount = await Notification.countDocuments({ 
        recipient: req.user._id 
      });

      const notifications = await Notification.find({ recipient: req.user._id })
        .populate("sender", "username profilePicture")
        .populate("relatedPost", "title")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      res.json({
        notifications,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Mark notification as read
  markAsRead: async (req, res) => {
    try {
      const notification = await Notification.findByIdAndUpdate(
        req.params.id,
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (req, res) => {
    try {
      await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { isRead: true }
      );

      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete a specific notification
  deleteNotification: async (req, res) => {
    try {
      const notification = await Notification.findOneAndDelete({
        _id: req.params.id,
        recipient: req.user._id,
      });

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      res.json({ message: "Notification deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete all notifications for a user
  deleteAllNotifications: async (req, res) => {
    try {
      await Notification.deleteMany({ recipient: req.user._id });
      res.json({ message: "All notifications deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Clean up old notifications (older than 30 days)
  cleanupOldNotifications: async (req, res) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await Notification.deleteMany({
        recipient: req.user._id,
        createdAt: { $lt: thirtyDaysAgo },
        isRead: true,
      });

      res.json({ 
        message: "Old notifications cleaned up successfully",
        deletedCount: result.deletedCount 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default notificationController;
