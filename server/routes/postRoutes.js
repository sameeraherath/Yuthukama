import express from "express";
import { getPosts, createPost } from "../controllers/postController.js";

const router = express.Router();
router.route("/").get(getPosts).post(createPost);

export default router;
