const express = require("express");

const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
} = require("../controllers/bookingController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// Create booking
router.post("/", protect, createBooking);

// User's bookings
router.get("/my-bookings", protect, getMyBookings);

// Admin: all bookings
router.get("/admin/all", protect, admin, getAllBookings);

// Single booking
router.get("/:id", protect, getBookingById);

// Cancel booking
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;