/**
 * Router module for chat-related endpoints
 * @module chatRoutes
 */

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserConversations,
  getConversationMessages,
  getOrCreateConversation,
} from "../controllers/chatController.js";
import { getAIMessage } from "../controllers/aiChatController.js";

/**
 * Express router instance for chat routes
 * @type {express.Router}
 */
const router = express.Router();

/**
 * @route GET /api/chat
 * @desc Get all conversations for the authenticated user
 * @access Private
 */
router.get("/", protect, getUserConversations);

/**
 * @route GET /api/chat/user/:receiverId
 * @desc Get or create a conversation with another user
 * @access Private
 * @param {string} receiverId - ID of the other user
 */
router.get("/user/:receiverId", protect, getOrCreateConversation);

/**
 * @route GET /api/chat/:conversationId/messages
 * @desc Get all messages in a conversation
 * @access Private
 * @param {string} conversationId - ID of the conversation
 */
router.get("/:conversationId/messages", protect, getConversationMessages);

/**
 * @route POST /api/chat/ai-message
 * @desc Send a message to the AI
 * @access Private
 */
router.post("/ai-message", protect, getAIMessage);

export default router;
