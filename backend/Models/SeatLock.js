const mongoose = require("mongoose");

const seatLockSchema = new mongoose.Schema(
  {
    show: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seats: [{ type: String, required: true }],
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL index
  },
  { timestamps: true }
);

module.exports = mongoose.model("SeatLock", seatLockSchema);
