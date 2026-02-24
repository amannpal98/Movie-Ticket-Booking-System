const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
} = require("../Controllers/MovieController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../Middlewares/AuthMiddleware");

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("poster"),
  addMovie
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("poster"),
  updateMovie
);
router.delete("/:id", authMiddleware, adminMiddleware, deleteMovie);

module.exports = router;
