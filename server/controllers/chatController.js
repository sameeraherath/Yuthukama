/**
 * Controller module for handling chat-related operations
 * @module chatController
 */

import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import config from "../config/config.js";
import { v4 as uuidv4 } from "uuid";

/**
 * AWS S3 client instance for handling file uploads in chat
 * @type {S3Client}
 */
const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

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
 * Retrieves a specific conversation by ID
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.conversationId - ID of the conversation
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user._id - User's ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response containing conversation details
 * @throws {Error} If conversation retrieval fails or user is not authorized
 * @example
 * // Route: GET /api/chat/conversations/:conversationId
 * // Returns conversation details if user is a participant
 */
export const getConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    const conversation = await Conversation.findById(conversationId)
      .populate("participants", "username profilePicture");

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.participants.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(conversation);
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

/**
 * Removes a user from a conversation
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.conversationId - ID of the conversation
 * @param {string} req.params.userId - ID of the user to remove
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user._id - User's ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response containing success message
 * @throws {Error} If user removal fails or user is not authorized
 * @example
 * // Route: DELETE /api/chat/conversations/:conversationId/users/:userId
 * // Removes the specified user from the conversation
 */
export const removeUserFromConversation = async (req, res) => {
  try {
    const { conversationId, userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Check if the requesting user is a participant
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if the user to remove is a participant
    if (!conversation.participants.includes(userId)) {
      return res.status(400).json({ message: "User is not in this conversation" });
    }

    // Remove the user from the conversation
    conversation.participants = conversation.participants.filter(
      participantId => participantId.toString() !== userId
    );

    // If only one participant remains, delete the conversation
    if (conversation.participants.length <= 1) {
      await Conversation.findByIdAndDelete(conversationId);
      await Message.deleteMany({ conversationId });
      return res.json({ 
        message: "User removed and conversation deleted", 
        conversationDeleted: true 
      });
    }

    // Save the updated conversation
    await conversation.save();

    res.json({ 
      message: "User removed from conversation successfully",
      conversationDeleted: false
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Sends a message with optional file attachment
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.conversationId - ID of the conversation
 * @param {string} req.body.text - Message text (optional if file attached)
 * @param {Object} [req.file] - Optional file attachment from multer
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user._id - User's ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response containing created message
 * @throws {Error} If message sending fails
 */
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messageData = {
      conversationId,
      sender: req.user._id,
      text: text || "",
      messageId: uuidv4(),
    };

    // Handle file attachment if present
    if (req.file) {
      const fileKey = `chat-attachments/${conversationId}/${uuidv4()}-${
        req.file.originalname
      }`;

      const params = {
        Bucket: config.aws.bucket,
        Key: fileKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const command = new PutObjectCommand(params);
      await s3Client.send(command);

      const fileUrl = `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${fileKey}`;

      // Determine file type based on mimetype
      let fileType = "file";
      if (req.file.mimetype.startsWith("image/")) {
        fileType = "image";
      } else if (req.file.mimetype.startsWith("video/")) {
        fileType = "video";
      } else if (req.file.mimetype.startsWith("audio/")) {
        fileType = "audio";
      }

      messageData.attachment = {
        url: fileUrl,
        type: fileType,
        filename: req.file.originalname,
        size: req.file.size,
      };
    }

    // Validate that either text or attachment is provided
    if (!messageData.text && !messageData.attachment) {
      return res
        .status(400)
        .json({ message: "Message must contain text or an attachment" });
    }

    const message = new Message(messageData);
    await message.save();

    // Update conversation with last message
    conversation.lastMessage =
      messageData.text || `Sent ${messageData.attachment.type}`;
    conversation.lastMessageTimestamp = new Date();
    await conversation.save();

    // Populate sender details
    await message.populate("sender", "username profilePicture");

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message" });
  }
};

/**
 * Deletes a message (soft delete)
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.messageId - ID of the message to delete
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user._id - User's ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response confirming deletion
 * @throws {Error} If message deletion fails
 */
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only sender can delete their message
    if (message.sender.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this message" });
    }

    // Soft delete
    message.deleted = true;
    message.deletedAt = new Date();
    message.text = "This message has been deleted";
    message.attachment = null;
    await message.save();

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Error deleting message" });
  }
};

/**
 * Edits a message
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.messageId - ID of the message to edit
 * @param {Object} req.body - Request body
 * @param {string} req.body.text - New message text
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user._id - User's ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response containing updated message
 * @throws {Error} If message editing fails
 */
export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Message text is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only sender can edit their message
    if (message.sender.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this message" });
    }

    // Can't edit deleted messages
    if (message.deleted) {
      return res.status(400).json({ message: "Cannot edit deleted message" });
    }

    message.text = text;
    message.edited = true;
    message.editedAt = new Date();
    await message.save();

    await message.populate("sender", "username profilePicture");

    res.json(message);
  } catch (error) {
    console.error("Error editing message:", error);
    res.status(500).json({ message: "Error editing message" });
  }
};

/**
 * Marks messages as read
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.conversationId - ID of the conversation
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user._id - User's ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response confirming messages marked as read
 * @throws {Error} If marking as read fails
 */
export const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    const result = await Message.updateMany(
      {
        conversationId,
        sender: { $ne: req.user._id },
        read: false,
      },
      {
        read: true,
        readAt: new Date(),
      }
    );

    res.json({
      message: "Messages marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: "Error marking messages as read" });
  }
};

/**
 * Gets unread message count for a conversation
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.conversationId - ID of the conversation
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user._id - User's ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response containing unread count
 * @throws {Error} If counting fails
 */
export const getUnreadCount = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    const count = await Message.countDocuments({
      conversationId,
      sender: { $ne: req.user._id },
      read: false,
    });

    res.json({ unreadCount: count });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({ message: "Error getting unread count" });
  }
};
