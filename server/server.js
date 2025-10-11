/**
 * Main server application file that sets up Express server with Socket.IO for real-time communication
 * @module server
 */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import connectDb from "./config/db.js";
import postRoutes from "./routes/postRoutes.js";
import { errorHandler } from "./utils/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import aiChatRoutes from "./routes/aiChat.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import multer from "multer";
import config from "./config/config.js";
import Message from "./models/Message.js";
import Conversation from "./models/Conversation.js";
import mongoose from "mongoose";
import adminRoutes from "./routes/adminRoutes.js";
import * as notificationController from "./controllers/notificationController.js";

dotenv.config();
connectDb();

const app = express();
const PORT = process.env.PORT || config.port;
const httpServer = createServer(app);

/**
 * List of allowed origins for CORS
 * @type {string[]}
 */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174", // Added for multiple Vite instances
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174", // Added for multiple Vite instances
];

allowedOrigins.push("https://yuthukama.vercel.app");
allowedOrigins.push(
  "https://yuthukama-git-main-sameeraheraths-projects.vercel.app"
);
allowedOrigins.push(
  "https://yuthukama-c090w1wi0-sameeraheraths-projects.vercel.app"
);
allowedOrigins.push(
  "https://yuthukama-8jc2f08wu-sameeraheraths-projects.vercel.app"
);
allowedOrigins.push(
  "https://yuthukama-2256qywdc-sameeraheraths-projects.vercel.app"
);

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

/**
 * Rate limiter for general API endpoints
 * Limits: 100 requests per 15 minutes per IP
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Strict rate limiter for authentication endpoints
 * Limits: 5 requests per 15 minutes per IP to prevent brute force attacks
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Security Middleware
app.use(helmet()); // Sets various HTTP headers for security
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      // or if the origin is in our allowed list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`)); // More specific error
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" })); // Limit request body size
app.use(cookieParser());

// API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Yuthukama API Documentation",
  })
);

// Swagger JSON endpoint
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend server is running and healthy!",
    documentation: "/api-docs",
  });
});

// Apply rate limiters to routes
app.use("/api/auth", authLimiter, authRoutes); // Strict rate limit for auth
app.use("/api/posts", generalLimiter, upload.single("image"), postRoutes);
app.use("/api/users", generalLimiter, userRoutes);
app.use("/api/chat", generalLimiter, chatRoutes);
app.use("/api/chat", generalLimiter, aiChatRoutes);
app.use("/api/admin", generalLimiter, adminRoutes);
app.use("/api/notifications", generalLimiter, notificationRoutes);

// **IMPORTANT: Make sure your errorHandler is robust**
// If it's still sending `{"stack":null}` even after adding the root route
// and you hit an actual API endpoint that fails, you need to look into
// your `errorHandler.js` file.
app.use(errorHandler);

// Store active users for online status tracking
const activeUsers = new Map();

/**
 * Socket.IO connection handler
 * @param {Socket} socket - Socket.IO socket instance
 */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Store user ID with socket ID for notifications
  socket.on("authenticate", async (userId) => {
    try {
      socket.userId = userId;
      socket.join(`user_${userId}`);
      
      // Track active user
      activeUsers.set(userId, {
        socketId: socket.id,
        lastSeen: new Date(),
        status: 'online'
      });

      // Notify other users that this user is online
      socket.broadcast.emit("user_status_change", {
        userId,
        status: 'online',
        timestamp: new Date()
      });

      console.log(`User ${userId} authenticated with socket ${socket.id}`);
    } catch (error) {
      console.error("Error authenticating user:", error);
      socket.emit("auth_error", { message: "Authentication failed" });
    }
  });

  /**
   * Handles room joining for chat conversations
   * @param {string} roomId - ID of the chat room to join
   */
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
    
    // Notify room members about user joining
    socket.to(roomId).emit("user_joined_room", {
      userId: socket.userId,
      roomId,
      timestamp: new Date()
    });
  });

  /**
   * Handles leaving chat rooms
   * @param {string} roomId - ID of the chat room to leave
   */
  socket.on("leave_room", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room: ${roomId}`);
    
    // Notify room members about user leaving
    socket.to(roomId).emit("user_left_room", {
      userId: socket.userId,
      roomId,
      timestamp: new Date()
    });
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
      const { roomId, sender, text, conversationId, messageId, tempId } = messageData;

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

        // Create notification for new message
        const conversation = await Conversation.findById(conversationId);
        const recipient = conversation.participants.find(
          (p) => p.toString() !== sender
        );

        if (recipient) {
          const notification = await notificationController.createNotification({
            recipient,
            sender,
            type: "message",
            content: "You have a new message",
          });

          // Emit notification to recipient
          io.to(`user_${recipient}`).emit("notification", notification);
        }

        // Emit message with database ID to confirm delivery
        io.in(roomId).emit("receive_message", {
          ...messageData,
          _id: newMessage._id,
          tempId, // Include tempId for client-side message matching
          timestamp: newMessage.createdAt,
          status: 'delivered'
        });

        // Emit delivery confirmation to sender
        socket.emit("message_delivered", {
          tempId,
          messageId: newMessage._id,
          timestamp: newMessage.createdAt
        });

        console.log(`Message sent to room ${roomId}: ${text}`);
      }
    } catch (error) {
      console.error("Error saving message:", error);
      
      // Emit error to sender
      socket.emit("message_error", {
        tempId: messageData.tempId,
        error: "Failed to send message"
      });
    }
  });

  /**
   * Handles message read receipts
   * @param {Object} data - Read receipt data
   * @param {string} data.messageId - ID of the message that was read
   * @param {string} data.conversationId - ID of the conversation
   */
  socket.on("mark_message_read", async (data) => {
    try {
      const { messageId, conversationId } = data;
      
      if (messageId && mongoose.Types.ObjectId.isValid(messageId)) {
        await Message.findByIdAndUpdate(messageId, {
          read: true,
          readAt: new Date()
        });

        // Notify sender that message was read
        const message = await Message.findById(messageId);
        if (message && message.sender.toString() !== socket.userId) {
          io.to(`user_${message.sender}`).emit("message_read", {
            messageId,
            readBy: socket.userId,
            readAt: new Date()
          });
        }
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  });

  /**
   * Handles typing indicator events
   * @param {Object} data - Typing event data
   * @param {string} data.roomId - ID of the chat room
   * @param {string} data.userId - ID of the typing user
   */
  socket.on("typing", (data) => {
    socket.to(data.roomId).emit("typing", {
      ...data,
      timestamp: new Date()
    });
  });

  /**
   * Handles stop typing indicator events
   * @param {Object} data - Stop typing event data
   * @param {string} data.roomId - ID of the chat room
   * @param {string} data.userId - ID of the user who stopped typing
   */
  socket.on("stop_typing", (data) => {
    socket.to(data.roomId).emit("stop_typing", {
      ...data,
      timestamp: new Date()
    });
  });

  /**
   * Handles message reactions
   * @param {Object} data - Reaction data
   * @param {string} data.messageId - ID of the message
   * @param {string} data.reaction - Reaction emoji
   * @param {string} data.userId - ID of the user reacting
   */
  socket.on("add_reaction", async (data) => {
    try {
      const { messageId, reaction, userId, roomId } = data;
      
      if (messageId && mongoose.Types.ObjectId.isValid(messageId)) {
        const message = await Message.findById(messageId);
        if (message) {
          // Add reaction to message (you might want to add a reactions field to Message model)
          if (!message.reactions) {
            message.reactions = [];
          }
          
          const existingReaction = message.reactions.find(r => r.userId.toString() === userId);
          if (existingReaction) {
            existingReaction.reaction = reaction;
          } else {
            message.reactions.push({ userId, reaction, timestamp: new Date() });
          }
          
          await message.save();
          
          // Emit reaction to room
          io.in(roomId).emit("message_reaction", {
            messageId,
            reaction,
            userId,
            timestamp: new Date()
          });
        }
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  });

  /**
   * Handles socket disconnection
   */
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    
    if (socket.userId) {
      // Update user status to offline
      activeUsers.delete(socket.userId);
      
      // Notify other users that this user is offline
      socket.broadcast.emit("user_status_change", {
        userId: socket.userId,
        status: 'offline',
        timestamp: new Date()
      });
    }
  });
});

/**
 * Starts the HTTP server
 * @param {number} PORT - Port number to listen on
 */
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
