const express = require("express");
const Message = require("../models/Message");
const Room = require("../models/Room");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get or Create Room for College
router.post("/room", authMiddleware, async (req, res) => {
  try {
    const { college } = req.body;

    let room = await Room.findOne({ college });
    if (!room) {
      room = new Room({ college });
      await room.save();
    }

    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Chat Messages (polling fallback)
router.get("/messages/:roomId", async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort({ timestamp: 1 }).limit(50);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save Message
router.post("/message", authMiddleware, async (req, res) => {
  try {
    const { roomId, text, username } = req.body;

    // Basic word filter
    const badWords = ["hate", "kill", "die", "harm"];
    let filteredText = text;

    badWords.forEach(word => {
      const regex = new RegExp(word, "gi");
      filteredText = filteredText.replace(regex, "***");
    });

    const message = new Message({ roomId, text: filteredText, username: username || "Anonymous" });
    await message.save();

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
