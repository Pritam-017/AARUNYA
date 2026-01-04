const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const Checkin = require("../models/Checkin");
const authMiddleware = require("../middleware/authMiddleware");
const { JWT_SECRET } = require("../config/db");

const router = express.Router();

// Register/Login (Anonymous)
router.post("/login", async (req, res) => {
  try {
    const { college } = req.body;
    const anonId = crypto.randomUUID();

    const user = new User({ anonId, college });
    await user.save();

    const token = jwt.sign({ anonId }, JWT_SECRET, { expiresIn: "30d" });

    res.json({ token, anonId, college });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user and all their data on logout
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Delete all check-ins
    await Checkin.deleteMany({ userId });

    // Delete user record
    await User.findOneAndDelete({ anonId: userId });

    console.log(`✅ User ${userId} and all their data deleted on logout`);
    res.json({ message: "User data deleted successfully" });
  } catch (err) {
    console.error("❌ Logout deletion error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
