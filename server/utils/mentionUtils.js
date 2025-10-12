/**
 * Utility functions for handling @mentions in posts and comments
 * @module mentionUtils
 */

import User from "../models/User.js";
import notificationController from "../controllers/notificationController.js";

/**
 * Extracts @mentions from text content
 * @param {string} text - The text content to search for mentions
 * @returns {string[]} Array of usernames mentioned
 */
export const extractMentions = (text) => {
  if (!text) return [];
  
  // Regex to match @username patterns
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  // Remove duplicates
  return [...new Set(mentions)];
};

/**
 * Creates notifications for mentioned users
 * @param {string} content - The content containing mentions
 * @param {string} senderId - ID of the user who created the content
 * @param {string} postId - ID of the related post (optional)
 * @param {string} commentId - ID of the comment (optional)
 */
export const createMentionNotifications = async (content, senderId, postId = null, commentId = null) => {
  try {
    const mentions = extractMentions(content);
    
    if (mentions.length === 0) return;
    
    // Find users by username
    const users = await User.find({ 
      username: { $in: mentions } 
    }).select('_id username');
    
    // Create notifications for each mentioned user
    for (const user of users) {
      // Don't notify the user who created the content
      if (user._id.toString() !== senderId) {
        await notificationController.createNotification({
          recipient: user._id,
          sender: senderId,
          type: "mention",
          content: "mentioned you",
          relatedPost: postId,
        });
      }
    }
  } catch (error) {
    console.error("Error creating mention notifications:", error);
  }
};

/**
 * Validates if mentioned usernames exist
 * @param {string[]} mentions - Array of usernames to validate
 * @returns {Object} Object with valid and invalid mentions
 */
export const validateMentions = async (mentions) => {
  try {
    const users = await User.find({ 
      username: { $in: mentions } 
    }).select('username');
    
    const validMentions = users.map(user => user.username);
    const invalidMentions = mentions.filter(mention => !validMentions.includes(mention));
    
    return {
      valid: validMentions,
      invalid: invalidMentions
    };
  } catch (error) {
    console.error("Error validating mentions:", error);
    return { valid: [], invalid: mentions };
  }
};
