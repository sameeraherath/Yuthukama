/**
 * Main server application file that sets up Express server with Socket.IO for real-time communication
 * @module server
 */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDb from "./config/db.js";
import postRoutes from "./routes/postRoutes.js";
import { errorHandler } from "./utils/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import aiChatRoutes from "./routes/aiChat.js";
import multer from "multer";
import config from "./config/config.js";
import Message from "./models/Message.js";
import Conversation from "./models/Conversation.js";
import mongoose from "mongoose";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDb();

const app = express();
const PORT = process.env.PORT || config.port;
const httpServer = createServer(app);

/**
 * List of allowed origins for CORS
 * @type {string[]}
 */
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

/**
 * Socket.IO server instance configuration
 * @type {Server}
 */
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  path: "/socket.io",
  connectTimeout: 10000,
  pingTimeout: 5000,
  pingInterval: 10000,
});

/**
 * Multer instance for handling file uploads
 * @type {multer.Multer}
 */
const upload = multer({ storage: multer.memoryStorage() });

// Middleware setup
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

// Route setup
app.use("/api/auth", authRoutes);
app.use("/api/posts", upload.single("image"), postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chat", aiChatRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

/**
 * Socket.IO connection handler
 * @param {Socket} socket - Socket.IO socket instance
 */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  /**
   * Handles room joining for chat conversations
   * @param {string} roomId - ID of the chat room to join
   */
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  /**
   * Handles sending messages in chat rooms
   * @param {Object} messageData - Message data object
   * @param {string} messageData.roomId - ID of the chat room
   * @param {string} messageData.sender - ID of the message sender
   * @param {string} messageData.text - Message content
   * @param {string} messageData.conversationId - ID of the conversation
   * @param {string} [messageData.messageId] - Optional custom message ID
   */
  socket.on("send_message", async (messageData) => {
    try {
      const { roomId, sender, text, conversationId, messageId } = messageData;

      if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
        const newMessage = new Message({
          conversationId,
          sender,
          text,
          read: false,
          messageId: messageId || `${sender}_${Date.now()}`,
        });
        await newMessage.save();

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: text,
          lastMessageTimestamp: new Date(),
        });
      }

      io.in(roomId).emit("receive_message", {
        ...messageData,
        timestamp: new Date(),
      });

      console.log(`Message sent to room ${roomId}: ${text}`);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  /**
   * Handles typing indicator events
   * @param {Object} data - Typing event data
   * @param {string} data.roomId - ID of the chat room
   * @param {string} data.userId - ID of the typing user
   */
  socket.on("typing", (data) => {
    socket.to(data.roomId).emit("typing", data);
  });

  /**
   * Handles stop typing indicator events
   * @param {Object} data - Stop typing event data
   * @param {string} data.roomId - ID of the chat room
   * @param {string} data.userId - ID of the user who stopped typing
   */
  socket.on("stop_typing", (data) => {
    socket.to(data.roomId).emit("stop_typing", data);
  });

  /**
   * Handles socket disconnection
   */
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/**
 * Starts the HTTP server
 * @param {number} PORT - Port number to listen on
 */
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
