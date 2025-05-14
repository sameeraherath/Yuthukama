import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";

export const getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user._id] },
    })
      .populate("participants", "username profilePicture")
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    await Message.updateMany(
      {
        conversationId,
        sender: { $ne: req.user._id },
        read: false,
      },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrCreateConversation = async (req, res) => {
  try {
    const { receiverId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid receiver ID" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, receiverId] },
    }).populate("participants", "username profilePicture");

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user._id, receiverId],
      });

      await conversation.save();
      conversation = await Conversation.findById(conversation._id).populate(
        "participants",
        "username profilePicture"
      );
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
