const express = require("express");

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// Get all events
router.get("/", getEvents);

router.get("/admin-test", protect, admin, (req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin access confirmed",
      user: req.user,
    });
  });
  
// Get single event
router.get("/:id", getEventById);

// Create event - login required
router.post("/", protect, createEvent);

// Update event - login required
router.put("/:id", protect, updateEvent);

// Delete event - login required
router.delete("/:id", protect, deleteEvent);


module.exports = router;