const Event = require("../models/Event");
const Booking = require("../models/Booking");
const User = require("../models/User");

// ADMIN DASHBOARD
const getAdminDashboard = async (req, res) => {
  try {
    // Basic counts
    const totalEvents = await Event.countDocuments();
    const totalUsers = await User.countDocuments();

    const confirmedBookings = await Booking.find({
      bookingStatus: "confirmed",
    });

    const totalBookings = confirmedBookings.length;

    // Calculate tickets sold
    const totalTicketsSold = confirmedBookings.reduce(
      (total, booking) => total + booking.numberOfTickets,
      0
    );

    // Calculate revenue
    const totalRevenue = confirmedBookings.reduce(
      (total, booking) => total + booking.totalAmount,
      0
    );

    // Upcoming events
    const upcomingEvents = await Event.find({
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .limit(5)
      .populate("organizer", "name email");

    // Booking statistics by event
    const bookingStats = await Booking.aggregate([
      {
        $match: {
          bookingStatus: "confirmed",
        },
      },
      {
        $group: {
          _id: "$event",
          ticketsSold: {
            $sum: "$numberOfTickets",
          },
          revenue: {
            $sum: "$totalAmount",
          },
          bookings: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          ticketsSold: -1,
        },
      },
    ]);

    // Add event information to booking statistics
    const detailedBookingStats = await Promise.all(
      bookingStats.map(async (stat) => {
        const event = await Event.findById(stat._id).select(
          "title ticketPrice totalSeats availableSeats"
        );

        return {
          event,
          bookings: stat.bookings,
          ticketsSold: stat.ticketsSold,
          revenue: stat.revenue,
        };
      })
    );

    res.status(200).json({
      success: true,
      dashboard: {
        totalEvents,
        totalUsers,
        totalBookings,
        totalTicketsSold,
        totalRevenue,
        upcomingEvents,
        bookingStats: detailedBookingStats,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while loading dashboard",
    });
  }
};

module.exports = {
  getAdminDashboard,
};