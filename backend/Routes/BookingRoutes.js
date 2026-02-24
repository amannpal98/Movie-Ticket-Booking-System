const express = require("express");
const router = express.Router();
const {
  initiateBooking,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  getBookingHistory,
  getBookedSeats,
  getAllBookings,
  getBookingByTransactionId,
  verifyRazorpayPayment,
} = require("../Controllers/BookingController");
// Razorpay payment verification
router.post("/payment/razorpay/verify", verifyRazorpayPayment);
const { lockSeats, unlockSeats } = require("../Controllers/SeatLockController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../Middlewares/AuthMiddleware");

// Booking routes
router.post("/initiate", authMiddleware, initiateBooking);
router.post("/payment/success", paymentSuccess);
router.post("/payment/fail", paymentFail);
router.post("/payment/cancel", paymentCancel);
router.get("/history", authMiddleware, getBookingHistory);
router.get("/transaction/:tranId", getBookingByTransactionId);
router.get("/all", authMiddleware, adminMiddleware, getAllBookings);
router.get("/booked-seats/:showId", getBookedSeats);

// Seat Lock routes
router.post("/lock", authMiddleware, lockSeats);
router.delete("/lock/:id", authMiddleware, unlockSeats);

module.exports = router;
