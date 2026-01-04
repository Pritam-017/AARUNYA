const express = require("express");
const Checkin = require("../models/Checkin");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Submit Daily Check-in
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { mood, sleep, stress, note } = req.body;

    const checkin = new Checkin({
      userId: req.userId,
      mood,
      sleep,
      stress,
      note
    });

    await checkin.save();
    res.json({ message: "Check-in saved", checkin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User's Check-ins
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const checkins = await Checkin.find({ userId: req.userId }).sort({ date: -1 });
    res.json(checkins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
