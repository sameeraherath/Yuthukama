import express from "express";
import {
  getPosts,
  createPost,
  getUserPosts,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/").get(protect, getPosts).post(protect, createPost);
router.route("/user/:userId").get(protect, getUserPosts);

export default router;
