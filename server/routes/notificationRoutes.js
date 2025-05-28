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

export default router;
