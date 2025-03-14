import express from "express";
import { getPosts, createPost } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/").get(protect, getPosts).post(protect, createPost);

export default router;
