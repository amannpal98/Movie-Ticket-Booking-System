const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const DBConnect = require("./config/DBConfig");
const PORT = process.env.PORT || 8080;
const app = express();

DBConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const authRoutes = require("./Routes/AuthRoutes");
const movieRoutes = require("./Routes/MovieRoutes");
const showRoutes = require("./Routes/ShowRoutes");
const bookingRoutes = require("./Routes/BookingRoutes");
const cinemaRoutes = require("./Routes/CinemaRoutes");
const screenRoutes = require("./Routes/ScreenRoutes");
const categoryRoutes = require("./Routes/CategoryRoutes");

app.get("/", (req, res) => {
  res.send("Online Movie Ticket Management API");
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/cinemas", cinemaRoutes);
app.use("/api/screens", screenRoutes);
app.use("/api/categories", categoryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
