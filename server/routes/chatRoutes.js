import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserConversations,
  getConversationMessages,
  getOrCreateConversation,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/", protect, getUserConversations);

router.get("/user/:receiverId", protect, getOrCreateConversation);

router.get("/:conversationId/messages", protect, getConversationMessages);

export default router;
