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
import multer from "multer";
import config from "./config/config.js";
import Message from "./models/Message.js";
import Conversation from "./models/Conversation.js";
import mongoose from "mongoose";

dotenv.config();
connectDb();

const app = express();
const PORT = config.port;
const httpServer = createServer(app);

const allowedOrigins = ["http://localhost:5173", "http://localhost:5000"];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket.io",
  connectTimeout: 10000,
  pingTimeout: 5000,
  pingInterval: 10000,
});

const upload = multer({ storage: multer.memoryStorage() });

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/posts", upload.single("image"), postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

app.use(errorHandler);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

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

  socket.on("typing", (data) => {
    socket.to(data.roomId).emit("typing", data);
  });

  socket.on("stop_typing", (data) => {
    socket.to(data.roomId).emit("stop_typing", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
