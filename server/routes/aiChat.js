import express from "express";
import { getAIMessage } from "../controllers/aiChatController.js";

const router = express.Router();

router.post("/ai-message", getAIMessage);

export default router;
