const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  college: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Room", roomSchema);
