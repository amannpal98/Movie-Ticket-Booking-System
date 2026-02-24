const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGODB_URI ||
      `${process.env.DB_STRING}/${process.env.DB_NAME}`;
    if (!uri || uri.includes("undefined")) {
      throw new Error(
        "MongoDB connection string is missing or malformed. Check your .env file."
      );
    }
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
