/**
 * Controller module for handling chat-related operations
 * @module chatController
 */

import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";

/**
 * Retrieves all conversations for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user._id - User's ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response containing array of conversations
 * @throws {Error} If conversation retrieval fails
 * @example
 * // Route: GET /api/chat/conversations
 * // Returns all conversations where the user is a participant
 */
export const getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user._id] },
    })
      .populate("participants", "username profilePicture")
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves all messages for a specific conversation
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.conversationId - ID of the conversation
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user._id - User's ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response containing array of messages
 * @throws {Error} If message retrieval fails or user is not authorized
 * @example
 * // Route: GET /api/chat/conversations/:conversationId/messages
 * // Returns all messages in the conversation and marks unread messages as read
 */
export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    await Message.updateMany(
      {
        conversationId,
        sender: { $ne: req.user._id },
        read: false,
      },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Gets an existing conversation or creates a new one between two users
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.receiverId - ID of the other participant
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user._id - User's ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response containing conversation details
 * @throws {Error} If conversation creation/retrieval fails
 * @example
 * // Route: GET /api/chat/conversations/:receiverId
 * // Returns existing conversation or creates a new one
 */
export const getOrCreateConversation = async (req, res) => {
  try {
    const { receiverId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid receiver ID" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, receiverId] },
    }).populate("participants", "username profilePicture");

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user._id, receiverId],
      });

      await conversation.save();
      conversation = await Conversation.findById(conversation._id).populate(
        "participants",
        "username profilePicture"
      );
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
