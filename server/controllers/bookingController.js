const Booking = require("../models/Booking");
const Event = require("../models/Event");

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const { eventId, numberOfTickets } = req.body;

    // Validate input
    if (!eventId || !numberOfTickets) {
      return res.status(400).json({
        success: false,
        message: "Please provide event ID and number of tickets",
      });
    }

    if (numberOfTickets < 1) {
      return res.status(400).json({
        success: false,
        message: "Number of tickets must be at least 1",
      });
    }

    // Find event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check available seats
    if (numberOfTickets > event.availableSeats) {
      return res.status(400).json({
        success: false,
        message: `Only ${event.availableSeats} seats are available`,
      });
    }

    // Calculate total amount
    const totalAmount = event.ticketPrice * numberOfTickets;

    // Generate booking reference
    const bookingReference =
      "EVT-" +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).substring(2, 7).toUpperCase();

    // Create booking
    const booking = await Booking.create({
      user: req.user.userId,
      event: eventId,
      numberOfTickets,
      totalAmount,
      bookingStatus: "confirmed",
      bookingReference,
    });

    // Reduce available seats
    event.availableSeats -= numberOfTickets;

    await event.save();

    // Return booking with event and user details
    const populatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email")
      .populate("event", "title date time venue city ticketPrice");

    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Create booking error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while creating booking",
    });
  }
};

// GET MY BOOKINGS
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.userId,
    })
      .populate(
        "event",
        "title description category date time venue city image ticketPrice"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching bookings",
    });
  }
};

// GET SINGLE BOOKING
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate(
        "event",
        "title description category date time venue city image ticketPrice"
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only the booking owner can view it
    if (booking.user._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this booking",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching booking",
    });
  }
};

// CANCEL BOOKING
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only booking owner can cancel
    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to cancel this booking",
      });
    }

    // Check if already cancelled
    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    // Find event
    const event = await Event.findById(booking.event);

    if (event) {
      // Return seats to event
      event.availableSeats += booking.numberOfTickets;

      // Don't allow available seats to exceed total seats
      if (event.availableSeats > event.totalSeats) {
        event.availableSeats = event.totalSeats;
      }

      await event.save();
    }

    booking.bookingStatus = "cancelled";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while cancelling booking",
    });
  }
};
const getAllBookings = async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate("user", "name email")
        .populate(
          "event",
          "title date time venue city ticketPrice"
        )
        .sort({ createdAt: -1 });
  
      return res.status(200).json({
        success: true,
        count: bookings.length,
        bookings,
      });
    } catch (error) {
      console.error("Get all bookings error:", error);
  
      return res.status(500).json({
        success: false,
        message: "Server error while fetching bookings.",
      });
    }
  };

  module.exports = {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    getAllBookings,
  };