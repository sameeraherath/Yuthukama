/**
 * Controller module for handling post-related operations
 * @module postController
 */

import Post from "../models/Post.js";
import User from "../models/User.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import config from "../config/config.js";
import { v4 as uuidv4 } from "uuid";
import notificationController from "../controllers/notificationController.js";
import { createMentionNotifications } from "../utils/mentionUtils.js";

/**
 * AWS S3 client instance for handling file uploads
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
 * Controller object containing post-related functions
 * @namespace postController
 */
const postController = {
  /**
   * Retrieves all posts with user details
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing array of posts
   * @throws {Error} If post retrieval fails
   */
  getPosts: async (req, res) => {
    try {
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("user", "username profilePicture")
        .populate("comments.user", "username profilePicture");
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Error fetching posts" });
    }
  },

  /**
   * Creates a new post with optional image upload
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing post details
   * @param {string} req.body.title - Post title
   * @param {string} req.body.description - Post description
   * @param {Object} [req.file] - Uploaded image file
   * @param {Object} req.user - Authenticated user object
   * @param {string} req.user.id - User's ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing created post
   * @throws {Error} If post creation fails
   */
  createPost: async (req, res) => {
    try {
      const { title, description } = req.body;

      if (!title || !description) {
        return res
          .status(400)
          .json({ message: "Title and description are required." });
      }

      let imageUrl = null;

      if (req.file) {
        const fileKey = `posts/${uuidv4()}-${req.file.originalname}`;

        const params = {
          Bucket: config.aws.bucket,
          Key: fileKey,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        imageUrl = `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${fileKey}`;
      }

      const post = new Post({
        title,
        description,
        image: imageUrl,
        user: req.user.id,
      });

      await post.save();

      // Create mention notifications for @mentions in title and description
      const content = `${title} ${description}`;
      await createMentionNotifications(content, req.user.id, post._id);

      const populatedPost = await Post.findById(post._id).populate(
        "user",
        "username profilePicture"
      );

      res.status(201).json(populatedPost);
    } catch (error) {
      console.error("Error creating post:", error);
      res
        .status(400)
        .json({ message: "Error creating post", error: error.message });
    }
  },

  /**
   * Retrieves all posts for a specific user
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.userId - ID of the user whose posts to retrieve
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing array of user's posts
   * @throws {Error} If post retrieval fails
   */
  getUserPosts: async (req, res) => {
    try {
      const { userId } = req.params;
      const posts = await Post.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("user", "username profilePicture")
        .populate("comments.user", "username profilePicture");
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user posts" });
    }
  },

  /**
   * Deletes a post if the user is authorized
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - ID of the post to delete
   * @param {Object} req.user - Authenticated user object
   * @param {string} req.user.id - User's ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response confirming post deletion
   * @throws {Error} If post deletion fails or user is not authorized
   */
  deletePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (post.user.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this post" });
      }

      await Post.findByIdAndDelete(req.params.id);
      res.json({ message: "Post deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting post" });
    }
  },

  /**
   * Updates a post if the user is authorized
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - ID of the post to update
   * @param {Object} req.body - Request body containing updated post details
   * @param {string} [req.body.title] - Updated post title
   * @param {string} [req.body.description] - Updated post description
   * @param {Object} [req.file] - New uploaded image file (optional)
   * @param {Object} req.user - Authenticated user object
   * @param {string} req.user.id - User's ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing updated post
   * @throws {Error} If post update fails or user is not authorized
   */
  updatePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Check authorization
      if (post.user.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this post" });
      }

      const { title, description } = req.body;

      // Update fields if provided
      if (title) post.title = title;
      if (description) post.description = description;

      // Handle image upload if new image provided
      if (req.file) {
        const fileKey = `posts/${uuidv4()}-${req.file.originalname}`;

        const params = {
          Bucket: config.aws.bucket,
          Key: fileKey,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        post.image = `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${fileKey}`;
      }

      const updatedPost = await post.save();
      const populatedPost = await Post.findById(updatedPost._id).populate(
        "user",
        "username profilePicture"
      );

      res.json(populatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
      res
        .status(500)
        .json({ message: "Error updating post", error: error.message });
    }
  },

  /**
   * Toggle like on a post
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with updated likes array
   */
  toggleLikePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const userId = req.user.id;
      const isLiked = post.likes.includes(userId);

      if (isLiked) {
        post.likes = post.likes.filter((id) => id.toString() !== userId);
      } else {
        post.likes.push(userId);

        // Create notification for post like if the user is not liking their own post
        if (post.user.toString() !== userId) {
          await notificationController.createNotification({
            recipient: post.user,
            sender: userId,
            type: "like",
            content: "liked your post",
            relatedPost: post._id,
          });
        }
      }

      const updatedPost = await post.save();

      res.json({
        postId: post._id,
        likes: updatedPost.likes,
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ message: "Error toggling like" });
    }
  },

  /**
   * Add a comment to a post
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {string} req.body.content - Comment content
   * @param {string} req.params.id - Post ID
   * @param {Object} req.user - Authenticated user object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with updated post
   * @throws {Error} If comment addition fails
   */
  addComment: async (req, res) => {
    try {
      const { content } = req.body;
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      post.comments.unshift({
        user: req.user.id,
        content,
      });

      await post.save();

      // Create notification for comment if the commenter is not the post owner
      if (post.user.toString() !== req.user.id) {
        await notificationController.createNotification({
          recipient: post.user,
          sender: req.user.id,
          type: "comment",
          content: "commented on your post",
          relatedPost: post._id,
        });
      }

      // Create mention notifications for @mentions in comment content
      await createMentionNotifications(content, req.user.id, post._id);

      // Populate the newly added comment's user information
      const populatedPost = await Post.findById(post._id)
        .populate("user", "username profilePicture")
        .populate("comments.user", "username profilePicture");

      res.json(populatedPost);
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Error adding comment" });
    }
  },

  /**
   * Delete a comment from a post
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - Post ID
   * @param {string} req.params.commentId - Comment ID
   * @param {Object} req.user - Authenticated user object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response confirming deletion
   */
  deleteComment: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const comment = post.comments.id(req.params.commentId);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (
        comment.user.toString() !== req.user.id &&
        post.user.toString() !== req.user.id
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this comment" });
      }
      post.comments = post.comments.filter(
        (c) => c._id.toString() !== req.params.commentId
      );
      await post.save();

      // Return updated post with populated fields
      const populatedPost = await Post.findById(post._id)
        .populate("user", "username profilePicture")
        .populate("comments.user", "username profilePicture");

      res.json(populatedPost);
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Error deleting comment" });
    }
  },

  /**
   * Searches posts by title, description, or category
   * @param {Object} req - Express request object
   * @param {Object} req.query - Query parameters
   * @param {string} req.query.query - Search query string
   * @param {string} [req.query.category] - Filter by category
   * @param {string} [req.query.sortBy] - Sort by field (createdAt, likes)
   * @param {number} [req.query.limit] - Limit results
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing matching posts
   * @throws {Error} If search fails
   */
  searchPosts: async (req, res) => {
    try {
      const { query, category, sortBy = "createdAt", limit = 20 } = req.query;

      if (!query || query.trim().length === 0) {
        return res.status(400).json({ message: "Search query is required" });
      }

      // Build search filter
      const searchFilter = {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      };

      // Add category filter if provided
      if (category) {
        searchFilter.category = category;
      }

      const limitNum = Math.min(parseInt(limit) || 20, 50); // Max 50 results

      // Determine sort order
      let sortOptions = {};
      if (sortBy === "likes") {
        // Sort by number of likes (descending)
        sortOptions = { likesCount: -1, createdAt: -1 };
      } else {
        sortOptions = { createdAt: -1 };
      }

      // Search posts
      const posts = await Post.aggregate([
        { $match: searchFilter },
        {
          $addFields: {
            likesCount: { $size: "$likes" },
          },
        },
        { $sort: sortOptions },
        { $limit: limitNum },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $lookup: {
            from: "users",
            localField: "comments.user",
            foreignField: "_id",
            as: "commentUsers",
          },
        },
        {
          $addFields: {
            comments: {
              $map: {
                input: "$comments",
                as: "comment",
                in: {
                  $mergeObjects: [
                    "$$comment",
                    {
                      user: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$commentUsers",
                              cond: { $eq: ["$$this._id", "$$comment.user"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $project: {
            title: 1,
            description: 1,
            image: 1,
            category: 1,
            likes: 1,
            comments: 1,
            createdAt: 1,
            "user.username": 1,
            "user.profilePicture": 1,
            "user._id": 1,
          },
        },
      ]);

      res.json({
        count: posts.length,
        posts,
      });
    } catch (error) {
      console.error("Error searching posts:", error);
      res.status(500).json({ message: "Error searching posts" });
    }
  },

  /**
   * Gets trending/popular posts based on likes and comments
   * @param {Object} req - Express request object
   * @param {Object} req.query - Query parameters
   * @param {number} [req.query.limit] - Limit results (default: 10)
   * @param {number} [req.query.days] - Consider posts from last N days (default: 7)
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing trending posts
   * @throws {Error} If fetching trending posts fails
   */
  getTrendingPosts: async (req, res) => {
    try {
      const { limit = 10, days = 7 } = req.query;
      const limitNum = Math.min(parseInt(limit) || 10, 20);
      const daysNum = parseInt(days) || 7;

      // Calculate date threshold
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - daysNum);

      const trendingPosts = await Post.aggregate([
        {
          $match: {
            createdAt: { $gte: dateThreshold },
          },
        },
        {
          $addFields: {
            engagementScore: {
              $add: [
                { $size: "$likes" },
                { $multiply: [{ $size: "$comments" }, 2] }, // Comments worth 2x likes
              ],
            },
          },
        },
        { $sort: { engagementScore: -1 } },
        { $limit: limitNum },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $lookup: {
            from: "users",
            localField: "comments.user",
            foreignField: "_id",
            as: "commentUsers",
          },
        },
        {
          $addFields: {
            comments: {
              $map: {
                input: "$comments",
                as: "comment",
                in: {
                  $mergeObjects: [
                    "$$comment",
                    {
                      user: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$commentUsers",
                              cond: { $eq: ["$$this._id", "$$comment.user"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $project: {
            title: 1,
            description: 1,
            image: 1,
            category: 1,
            likes: 1,
            comments: 1,
            createdAt: 1,
            engagementScore: 1,
            "user.username": 1,
            "user.profilePicture": 1,
            "user._id": 1,
          },
        },
      ]);

      res.json({
        count: trendingPosts.length,
        posts: trendingPosts,
      });
    } catch (error) {
      console.error("Error fetching trending posts:", error);
      res.status(500).json({ message: "Error fetching trending posts" });
    }
  },

  /**
   * Toggle save/unsave a post
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with updated saved posts
   */
  toggleSavePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isSaved = user.savedPosts.includes(post._id);

      if (isSaved) {
        user.savedPosts = user.savedPosts.filter(
          (savedPostId) => savedPostId.toString() !== post._id.toString()
        );
      } else {
        user.savedPosts.push(post._id);
      }

      await user.save();

      res.json({
        postId: post._id,
        isSaved: !isSaved,
        message: isSaved ? "Post unsaved" : "Post saved",
      });
    } catch (error) {
      console.error("Error toggling save:", error);
      res.status(500).json({ message: "Error toggling save" });
    }
  },

  /**
   * Get user's saved posts
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing saved posts
   */
  getSavedPosts: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate({
        path: "savedPosts",
        populate: [
          {
            path: "user",
            select: "username profilePicture",
          },
          {
            path: "comments.user",
            select: "username profilePicture",
          },
        ],
        options: {
          sort: { createdAt: -1 },
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        count: user.savedPosts.length,
        posts: user.savedPosts,
      });
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      res.status(500).json({ message: "Error fetching saved posts" });
    }
  },

  /**
   * Report a post
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {string} req.body.reason - Report reason
   * @param {string} [req.body.description] - Additional description
   * @param {string} req.params.id - Post ID
   * @param {Object} req.user - Authenticated user object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with success message
   * @throws {Error} If report submission fails
   */
  reportPost: async (req, res) => {
    try {
      const { reason, description } = req.body;
      const postId = req.params.id;
      const userId = req.user.id;

      // Validate required fields
      if (!reason) {
        return res.status(400).json({ message: "Report reason is required" });
      }

      // Check if post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if user is trying to report their own post
      if (post.user.toString() === userId) {
        return res.status(400).json({ message: "You cannot report your own post" });
      }

      // Check if user has already reported this post
      const existingReport = post.reports.find(
        (report) => report.user.toString() === userId
      );

      if (existingReport) {
        return res.status(400).json({ message: "You have already reported this post" });
      }

      // Add the report
      post.reports.push({
        user: userId,
        reason,
        description: description || "",
      });

      await post.save();

      res.json({
        message: "Post reported successfully. Thank you for helping keep our community safe.",
        reportCount: post.reports.length,
      });
    } catch (error) {
      console.error("Error reporting post:", error);
      res.status(500).json({ message: "Error reporting post" });
    }
  },

  /**
   * Gets posts from users that the current user follows (Following feed)
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {string} req.user.id - Current user's ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing posts from followed users
   * @throws {Error} If fetching following posts fails
   */
  getFollowingPosts: async (req, res) => {
    try {
      const userId = req.user.id;
      const { limit = 20, page = 1 } = req.query;
      const limitNum = Math.min(parseInt(limit) || 20, 50);
      const skip = (parseInt(page) - 1) * limitNum;

      // Get current user's following list
      const currentUser = await User.findById(userId).select('following');
      const followingIds = currentUser.following;

      if (followingIds.length === 0) {
        return res.json({
          posts: [],
          count: 0,
          pagination: {
            currentPage: parseInt(page),
            totalPages: 0,
            totalCount: 0,
            hasNextPage: false,
            hasPrevPage: false,
            limit: limitNum
          }
        });
      }

      // Get total count for pagination
      const totalCount = await Post.countDocuments({
        user: { $in: followingIds }
      });

      // Get posts from followed users
      const posts = await Post.find({
        user: { $in: followingIds }
      })
        .sort({ createdAt: -1 })
        .populate("user", "username profilePicture")
        .populate("comments.user", "username profilePicture")
        .skip(skip)
        .limit(limitNum);

      const totalPages = Math.ceil(totalCount / limitNum);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      res.json({
        posts,
        count: posts.length,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      console.error("Error fetching following posts:", error);
      res.status(500).json({ message: "Error fetching following posts" });
    }
  },

  /**
   * Gets personalized "For You" feed with algorithmic recommendations
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {string} req.user.id - Current user's ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing recommended posts
   * @throws {Error} If fetching for you posts fails
   */
  getForYouPosts: async (req, res) => {
    try {
      console.log('=== getForYouPosts START ===');
      const userId = req.user.id;
      const { limit = 20, page = 1 } = req.query;
      const limitNum = Math.min(parseInt(limit) || 20, 50);
      const skip = (parseInt(page) - 1) * limitNum;

      console.log('Processing with userId:', userId, 'limit:', limitNum, 'skip:', skip);

      // Validate userId format
      if (!userId || typeof userId !== 'string') {
        console.error('Invalid userId:', userId);
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Get current user's following list
      console.log('Fetching user from database...');
      const currentUser = await User.findById(userId).select('following');
      
      if (!currentUser) {
        console.error('User not found:', userId);
        return res.status(404).json({ message: "User not found" });
      }

      console.log('User found, following count:', currentUser.following?.length || 0);
      const followingIds = currentUser.following || [];

      // Simple approach: Get posts from followed users first, then other posts
      let posts = [];
      
      if (followingIds.length > 0) {
        console.log('Fetching posts from followed users...');
        // Get posts from followed users
        const followingPosts = await Post.find({
          user: { $in: followingIds }
        })
          .sort({ createdAt: -1 })
          .populate("user", "username profilePicture")
          .populate("comments.user", "username profilePicture")
          .limit(limitNum);
        
        posts = followingPosts;
        console.log('Found', posts.length, 'posts from followed users');
      }

      // If we need more posts or no following posts, get recent posts
      if (posts.length < limitNum) {
        console.log('Need more posts, fetching recent posts...');
        const remainingLimit = limitNum - posts.length;
        const excludeUserIds = [...followingIds, userId]; // Exclude followed users and self
        
        const recentPosts = await Post.find({
          user: { $nin: excludeUserIds }
        })
          .sort({ createdAt: -1 })
          .populate("user", "username profilePicture")
          .populate("comments.user", "username profilePicture")
          .limit(remainingLimit);
        
        posts = [...posts, ...recentPosts];
        console.log('Total posts after adding recent:', posts.length);
      }

      // Get total count for pagination
      const totalCount = await Post.countDocuments();

      const totalPages = Math.ceil(totalCount / limitNum);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      console.log('getForYouPosts - Returning posts:', posts.length);

      res.json({
        posts,
        count: posts.length,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      console.error("=== getForYouPosts ERROR ===");
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      console.error("Error name:", error.name);
      
      res.status(500).json({ 
        message: "Error fetching for you posts",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
};

export { postController as default, postController };
export const {
  getPosts,
  createPost,
  getUserPosts,
  deletePost,
  updatePost,
  toggleLikePost,
  addComment,
  deleteComment,
  searchPosts,
  getTrendingPosts,
  toggleSavePost,
  getSavedPosts,
  reportPost,
  getFollowingPosts,
  getForYouPosts,
} = postController;
