const Event = require("../models/Event");

// CREATE EVENT
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      city,
      image,
      ticketPrice,
      totalSeats,
    } = req.body;

    // Check required fields
    if (
      !title ||
      !description ||
      !category ||
      !date ||
      !time ||
      !venue ||
      !city ||
      ticketPrice === undefined ||
      totalSeats === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required event details",
      });
    }

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      venue,
      city,
      image: image || "",
      ticketPrice,
      totalSeats,
      availableSeats: totalSeats,
      organizer: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Create event error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while creating event",
    });
  }
};

// GET ALL EVENTS
const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizer", "name email")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Get events error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching events",
    });
  }
};

// GET SINGLE EVENT
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer",
      "name email"
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Get event error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching event",
    });
  }
};

// UPDATE EVENT
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Only the event organizer can update it
    if (event.organizer.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this event",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "category",
      "date",
      "time",
      "venue",
      "city",
      "image",
      "ticketPrice",
      "totalSeats",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    // Keep available seats correct when total seats changes
    if (req.body.totalSeats !== undefined) {
      const bookedSeats = event.totalSeats - event.availableSeats;

      if (req.body.totalSeats < bookedSeats) {
        return res.status(400).json({
          success: false,
          message: "Total seats cannot be less than already booked seats",
        });
      }

      event.availableSeats = req.body.totalSeats - bookedSeats;
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error("Update event error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while updating event",
    });
  }
};

// DELETE EVENT
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Only the event organizer can delete it
    if (event.organizer.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this event",
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete event error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while deleting event",
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};