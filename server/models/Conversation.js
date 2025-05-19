/**
 * Conversation model module
 * @module models/Conversation
 */

import mongoose from "mongoose";

/**
 * Mongoose schema for Conversation model
 * @type {mongoose.Schema}
 * @property {Array<ObjectId>} participants - Array of references to User model (conversation participants)
 * @property {string} lastMessage - Content of the most recent message
 * @property {Date} lastMessageTimestamp - Timestamp of the most recent message
 * @property {Date} createdAt - Timestamp of conversation creation
 * @property {Date} updatedAt - Timestamp of last conversation update
 */
const conversationSchema = mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageTimestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/**
 * Conversation model
 * @type {mongoose.Model}
 */
const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
