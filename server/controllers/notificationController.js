import Notification from "../models/Notification.js";

const notificationController = {
  // Create a new notification
  createNotification: async (data) => {
    try {
      const notification = new Notification(data);
      await notification.save();
      return notification;
    } catch (error) {
      throw error;
    }
  },

  // Get user's notifications
  getUserNotifications: async (req, res) => {
    try {
      const notifications = await Notification.find({ recipient: req.user._id })
        .populate("sender", "username profilePicture")
        .populate("relatedPost", "title")
        .sort({ createdAt: -1 });

      res.json(notifications);
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
};

export default notificationController;
