/**
 * Message model module
 * @module models/Message
 */

import mongoose from "mongoose";

/**
 * Mongoose schema for Message model
 * @type {mongoose.Schema}
 * @property {ObjectId} conversationId - Reference to Conversation model
 * @property {ObjectId} sender - Reference to User model (message sender)
 * @property {string} text - Message content
 * @property {boolean} read - Whether the message has been read
 * @property {string} messageId - Unique identifier for the message
 * @property {Date} createdAt - Timestamp of message creation
 * @property {Date} updatedAt - Timestamp of last message update
 */
const messageSchema = mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    messageId: {
      type: String,
      index: true, // Add index for faster lookups
    },
  },
  { timestamps: true }
);

/**
 * Message model
 * @type {mongoose.Model}
 */
const Message = mongoose.model("Message", messageSchema);
export default Message;
