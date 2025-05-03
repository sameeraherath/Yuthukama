import express from "express";
import {
  getPosts,
  createPost,
  getUserPosts,
  deletePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/").get(protect, getPosts).post(protect, createPost);
router.route("/user/:userId").get(protect, getUserPosts);
router.route("/:id").delete(protect, deletePost);

export default router;
