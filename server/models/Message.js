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
      required: function () {
        // Text is required only if there's no attachment
        return !this.attachment;
      },
    },
    attachment: {
      url: String,
      type: {
        type: String,
        enum: ["image", "file", "video", "audio"],
      },
      filename: String,
      size: Number,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    messageId: {
      type: String,
      index: true, // Add index for faster lookups
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    edited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    reactions: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      reaction: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
  },
  { timestamps: true }
);

// Indexes for performance optimization
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ read: 1, sender: 1 });

/**
 * Message model
 * @type {mongoose.Model}
 */
const Message = mongoose.model("Message", messageSchema);
export default Message;
