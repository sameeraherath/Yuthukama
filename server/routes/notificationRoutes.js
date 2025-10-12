import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import notificationController from "../controllers/notificationController.js";

const router = express.Router();

// Get user's notifications
router.get("/", protect, notificationController.getUserNotifications);

// Mark notification as read
router.patch("/:id/read", protect, notificationController.markAsRead);

// Mark all notifications as read
router.patch("/mark-all-read", protect, notificationController.markAllAsRead);

// Delete a specific notification
router.delete("/:id", protect, notificationController.deleteNotification);

// Delete all notifications
router.delete("/", protect, notificationController.deleteAllNotifications);

// Clean up old notifications
router.delete("/cleanup", protect, notificationController.cleanupOldNotifications);

export default router;
