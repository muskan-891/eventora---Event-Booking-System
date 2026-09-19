const express = require("express");

const {
  getAdminDashboard,
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// Admin dashboard
router.get("/", protect, admin, getAdminDashboard);

module.exports = router;