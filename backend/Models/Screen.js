const mongoose = require("mongoose");

const screenSchema = new mongoose.Schema(
  {
    cinema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
      required: true,
    },
    name: { type: String, required: true }, // e.g., 'Screen 1'
    totalSeats: { type: Number, required: true },
    seats: [{ type: String }], // List of strings like ['A1', 'A2', ...]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Screen", screenSchema);
