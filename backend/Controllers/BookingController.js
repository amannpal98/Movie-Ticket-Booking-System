const { verifyRazorpaySignature } = require("../Services/RazorpayService");

// Razorpay payment verification
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature, transactionId } = req.body;
    if (!orderId || !paymentId || !signature || !transactionId) {
      return res.status(400).json({ message: "Missing required payment verification fields" });
    }
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const isValid = verifyRazorpaySignature(orderId, paymentId, signature, secret);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }
    // Update booking status
    const booking = await Booking.findOneAndUpdate(
      { transactionId, razorpayOrderId: orderId },
      { paymentStatus: "paid", bookingStatus: "confirmed", razorpayPaymentId: paymentId },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found for payment verification" });
    }
    // Optionally, send confirmation email here
    res.json({ message: "Payment verified and booking confirmed", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const Booking = require("../Models/Booking");
const SeatLock = require("../Models/SeatLock");
const {
  sendBookingConfirmation,
  sendAdminNotification,
} = require("../Services/EmailService");
// const sslcommerz = require("../config/SslCommerzConfig");
const razorpay = require("../config/RazorpayConfig");
const { v4: uuidv4 } = require("uuid");

exports.initiateBooking = async (req, res) => {
  try {
    const { showId, seats, totalPrice, movieTitle } = req.body;
    const userId = req.user.id;
    const transactionId = `TXN-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Create pending booking
    const booking = new Booking({
      user: userId,
      show: showId,
      seats,
      totalPrice,
      transactionId,
      paymentStatus: "pending",
      bookingStatus: "pending",
    });
    await booking.save();

    // Razorpay expects amount in paise (multiply by 100)
    const options = {
      amount: Math.round(totalPrice * 100),
      currency: "INR",
      receipt: transactionId,
      payment_capture: 1,
      notes: {
        movieTitle,
        userId,
        showId,
      },
    };

    const order = await razorpay.orders.create(options);
    if (order && order.id) {
      // Save orderId to booking for later verification
      await Booking.findOneAndUpdate(
        { transactionId },
        { razorpayOrderId: order.id }
      );
      res.json({ orderId: order.id, amount: order.amount, currency: order.currency, transactionId });
    } else {
      res.status(400).json({ message: "Razorpay order creation failed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.paymentSuccess = async (req, res) => {
  try {
    // Log everything SSLCommerz sends
    console.log("=== PAYMENT SUCCESS CALLBACK ===");
    console.log("Query params:", req.query);
    console.log("Body:", req.body);
    console.log("================================");

    // SSLCommerz can send tran_id or val_id
    // SSLCommerz can send tran_id or val_id
    let tran_id =
      req.body?.tran_id ||
      req.query?.tran_id ||
      req.body?.val_id ||
      req.query?.val_id;

    const sessionKey = req.body?.SESSIONKEY || req.query?.SESSIONKEY;

    if (!tran_id && !sessionKey) {
      console.error("Transaction ID and Session Key missing in callback!");
      return res.status(400).send("Transaction ID missing");
    }

    console.log(
      "Processing transaction:",
      tran_id || `SessionKey: ${sessionKey}`
    );

    let booking;
    if (tran_id) {
      booking = await Booking.findOneAndUpdate(
        { transactionId: tran_id },
        { paymentStatus: "paid", bookingStatus: "confirmed" },
        { new: true }
      );
    } else if (sessionKey) {
      booking = await Booking.findOneAndUpdate(
        { sessionKey: sessionKey },
        { paymentStatus: "paid", bookingStatus: "confirmed" },
        { new: true }
      );
      if (booking) tran_id = booking.transactionId;
    }

    if (booking) {
      booking = await booking.populate("user", "name email");
      booking = await booking.populate({
        path: "show",
        populate: [
          { path: "movie" },
          { path: "screen", populate: { path: "cinema" } },
        ],
      });
    }

    if (!booking) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/booking/failed?error=Booking not found`
      );
    }

    await SeatLock.findOneAndDelete({
      user: booking.user._id,
      show: booking.show._id,
    });

    // Send emails
    try {
      const details = {
        transactionId: booking.transactionId,
        movieTitle: booking.show.movie.title,
        cinema: `${booking.show.screen.cinema.name}, ${booking.show.screen.cinema.city}`,
        seats: booking.seats.join(", "),
        totalPrice: booking.totalPrice,
        showTime: new Date(booking.show.startTime).toLocaleString(),
        userName: booking.user.name,
        userEmail: booking.user.email,
      };
      await sendBookingConfirmation(booking.user.email, details);
      await sendAdminNotification(details);
    } catch (emailError) {
      console.error("Email error:", emailError.message);
    }

    res.redirect(
      `${process.env.FRONTEND_URL}/booking/success?tran_id=${booking.transactionId}`
    );
  } catch (error) {
    console.error("Payment success error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL}/booking/failed?error=${encodeURIComponent(
        error.message
      )}`
    );
  }
};

exports.paymentFail = async (req, res) => {
  try {
    const tran_id = req.body?.tran_id || req.query?.tran_id;

    if (tran_id) {
      await Booking.findOneAndUpdate(
        { transactionId: tran_id },
        { paymentStatus: "failed", bookingStatus: "cancelled" },
        { new: true }
      );
    }

    res.redirect(
      `${process.env.FRONTEND_URL}/booking/failed?error=Payment failed. Please try again.`
    );
  } catch (error) {
    console.error("Payment fail error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL}/booking/failed?error=${encodeURIComponent(
        error.message
      )}`
    );
  }
};

exports.paymentCancel = async (req, res) => {
  try {
    const tran_id = req.body?.tran_id || req.query?.tran_id;

    if (tran_id) {
      await Booking.findOneAndUpdate(
        { transactionId: tran_id },
        { paymentStatus: "cancelled", bookingStatus: "cancelled" },
        { new: true }
      );
    }

    res.redirect(
      `${process.env.FRONTEND_URL}/booking/failed?error=Payment was cancelled.`
    );
  } catch (error) {
    console.error("Payment cancel error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL}/booking/failed?error=${encodeURIComponent(
        error.message
      )}`
    );
  }
};

exports.getBookingByTransactionId = async (req, res) => {
  try {
    const { tranId } = req.params;
    const booking = await Booking.findOne({ transactionId: tranId })
      .populate({
        path: "show",
        populate: [
          { path: "movie" },
          { path: "screen", populate: { path: "cinema" } },
        ],
      })
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingHistory = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate({
      path: "show",
      populate: [
        { path: "movie", populate: { path: "category" } },
        { path: "screen", populate: { path: "cinema" } },
      ],
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookedSeats = async (req, res) => {
  try {
    const { showId } = req.params;

    // Get confirmed booked seats
    const confirmedBookings = await Booking.find({
      show: showId,
      bookingStatus: "confirmed",
    });

    // Get currently locked seats (not expired)
    const activeLocks = await SeatLock.find({
      show: showId,
      expiresAt: { $gt: new Date() },
    });

    const booked = confirmedBookings.reduce(
      (acc, b) => acc.concat(b.seats),
      []
    );
    const locked = activeLocks.reduce((acc, l) => acc.concat(l.seats), []);

    // Unique list of unavailable seats
    const unavailableSeats = [...new Set([...booked, ...locked])];

    res.json(unavailableSeats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: "show",
        populate: [
          { path: "movie", populate: { path: "category" } },
          { path: "screen", populate: { path: "cinema" } },
        ],
      })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    console.log("Sample booking data:", JSON.stringify(bookings[0], null, 2));
    res.json(bookings);
  } catch (error) {
    console.error("getAllBookings error:", error);
    res.status(500).json({ message: error.message });
  }
};
