/**
 * Post model module
 * @module models/Post
 */

import mongoose from "mongoose";

/**
 * Mongoose schema for Post model
 * @type {mongoose.Schema}
 * @property {string} title - Post title
 * @property {string} description - Post content/description
 * @property {string} image - URL to post image
 * @property {ObjectId} user - Reference to User model (post creator)
 * @property {Date} createdAt - Timestamp of post creation
 * @property {Date} updatedAt - Timestamp of last post update
 */
const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reports: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        reason: {
          type: String,
          required: true,
          enum: ['spam', 'inappropriate', 'harassment', 'hate_speech', 'violence', 'false_information', 'copyright', 'other'],
        },
        description: {
          type: String,
          maxlength: 500,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

/**
 * Post model
 * @type {mongoose.Model}
 */
const Post = mongoose.model("Post", postSchema);
export default Post;
