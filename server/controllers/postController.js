import Post from "../models/Post.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import config from "../config/config.js";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

const postController = {
  getPosts: async (res) => {
    try {
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("user", "username profilePicture");
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Error fetching posts" });
    }
  },

  createPost: async (req, res) => {
    try {
      const { content } = req.body;
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
        content,
        image: imageUrl,
        user: req.user.id,
      });

      await post.save();

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

  getUserPosts: async (req, res) => {
    try {
      const { userId } = req.params;
      const posts = await Post.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("user", "username profilePicture");
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user posts" });
    }
  },


  deletePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (post.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      await Post.findByIdAndDelete(req.params.id);
      res.json({ message: "Post deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting post" });
    }
  },
};

export { postController as default, postController };
export const { getPosts, createPost, getUserPosts, deletePost } =
  postController;
