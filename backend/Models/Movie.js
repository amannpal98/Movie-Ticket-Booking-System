const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    duration: { type: Number, required: true }, // in minutes
    releaseDate: { type: Date, required: true },
    posterUrl: { type: String, required: true },
    trailerUrl: { type: String },
    language: { type: String, default: "English" },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
