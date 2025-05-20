import express from "express";
import { adminProtect } from "../middleware/adminMiddleware.js";
import adminController from "../controllers/adminController.js";

const router = express.Router();

// All routes are protected with admin middleware
router.use(adminProtect);

// Dashboard statistics
router.get("/dashboard-stats", adminController.getDashboardStats);
router.get("/user-stats", adminController.getUserStats);

export default router;
