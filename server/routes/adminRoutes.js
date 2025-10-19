import express from "express";
import { adminProtect } from "../middleware/adminMiddleware.js";
import adminController from "../controllers/adminController.js";

const router = express.Router();

// All routes are protected with admin middleware
router.use(adminProtect);

// Dashboard statistics
router.get("/dashboard-stats", adminController.getDashboardStats);
router.get("/user-stats", adminController.getUserStats);

// User management
router.get("/users", adminController.getAllUsers);
router.put("/users/:userId", adminController.updateUser);
router.delete("/users/:userId", adminController.deleteUser);

// Analytics
router.get("/analytics", adminController.getAnalytics);

export default router;
