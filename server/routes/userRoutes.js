import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUsername,
  updateProfilePicture,
} from "../controllers/userController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/profile", protect, getUserProfile);
router.put("/username", protect, updateUsername);
router.put(
  "/profile-pic",
  protect,
  upload.single("profilePic"),
  updateProfilePicture
);

export default router;
