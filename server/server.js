import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js";
import postRoutes from "./routes/postRoutes.js";
import { errorHandler } from "./utils/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import multer from "multer";

const result = dotenv.config({ path: "D:/Yuthukama/server/.env" });
if (result.error) {
  console.error("Error loading .env:", result.error);
} else {
  console.log("Loaded .env successfully");
}

dotenv.config();
connectDb();

const app = express();

const upload = multer({ storage: multer.memoryStorage() });

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/posts", upload.single("image"), postRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
