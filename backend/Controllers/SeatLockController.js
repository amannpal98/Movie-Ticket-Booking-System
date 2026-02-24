const SeatLock = require("../Models/SeatLock");
const Booking = require("../Models/Booking");

exports.lockSeats = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const userId = req.user.id;

    // Check if seats are already booked
    const existingBooking = await Booking.findOne({
      show: showId,
      seats: { $in: seats },
      bookingStatus: "confirmed",
    });
    if (existingBooking)
      return res
        .status(400)
        .json({ message: "One or more seats are already booked" });

    // Check if seats are already locked by someone else
    const existingLock = await SeatLock.findOne({
      show: showId,
      seats: { $in: seats },
      expiresAt: { $gt: new Date() },
    });
    if (existingLock)
      return res
        .status(400)
        .json({ message: "One or more seats are temporarily locked" });

    // Create new lock
    const lock = new SeatLock({
      show: showId,
      user: userId,
      seats,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes lock
    });
    await lock.save();

    res
      .status(201)
      .json({ message: "Seats locked successfully", lockId: lock._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unlockSeats = async (req, res) => {
  try {
    await SeatLock.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Seats unlocked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
