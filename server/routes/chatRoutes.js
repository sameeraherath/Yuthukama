/**
 * Router module for chat-related endpoints
 * @module chatRoutes
 */

import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserConversations,
  getConversationMessages,
  getOrCreateConversation,
  sendMessage,
  deleteMessage,
  editMessage,
  markMessagesAsRead,
  getUnreadCount,
} from "../controllers/chatController.js";
import { getAIMessage } from "../controllers/aiChatController.js";
import {
  validateMessage,
  validateMongoId,
} from "../middleware/validationMiddleware.js";

/**
 * Multer instance for handling file uploads in chat
 * @type {multer.Multer}
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

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

/**
 * @route POST /api/chat/messages
 * @desc Send a message with optional file attachment
 * @access Private
 */
router.post("/messages", protect, upload.single("file"), sendMessage);

/**
 * @route PUT /api/chat/messages/:messageId
 * @desc Edit a message
 * @access Private
 * @param {string} messageId - ID of the message to edit
 */
router.put("/messages/:messageId", protect, validateMessage, editMessage);

/**
 * @route DELETE /api/chat/messages/:messageId
 * @desc Delete a message
 * @access Private
 * @param {string} messageId - ID of the message to delete
 */
router.delete("/messages/:messageId", protect, validateMongoId, deleteMessage);

/**
 * @route PUT /api/chat/:conversationId/read
 * @desc Mark all messages in a conversation as read
 * @access Private
 * @param {string} conversationId - ID of the conversation
 */
router.put(
  "/:conversationId/read",
  protect,
  validateMongoId,
  markMessagesAsRead
);

/**
 * @route GET /api/chat/:conversationId/unread-count
 * @desc Get unread message count for a conversation
 * @access Private
 * @param {string} conversationId - ID of the conversation
 */
router.get(
  "/:conversationId/unread-count",
  protect,
  validateMongoId,
  getUnreadCount
);

export default router;
