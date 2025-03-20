import Post from "../models/Post.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import config from "../config/config.js";

const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

// @desc Get all posts
// @route GET /api/posts
// @access Public
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Create a post
// @route POST /api/posts
// @access Public
export const createPost = async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;

  try {
    if (!title || !description || !file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const imageUrl = `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${fileName}`;

    const newPost = new Post({
      title,
      description,
      image: imageUrl,
      user: req.user.id,
    });

    const post = await newPost.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
