const mongoose = require("mongoose");

const checkinSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  mood: { type: Number, min: 1, max: 5, required: true },
  sleep: { type: Number, required: true },
  stress: { type: Number, min: 1, max: 5, required: true },
  note: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Checkin", checkinSchema);
