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
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * Post model
 * @type {mongoose.Model}
 */
const Post = mongoose.model("Post", postSchema);
export default Post;
