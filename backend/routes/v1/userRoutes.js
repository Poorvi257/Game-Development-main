// userRoutes.js
// This module defines routes for user management in the application.
// It uses Express Router to define endpoints for register, login and fetch,
// user profiles

const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");
const authMiddleware = require("../../middleware/authMiddleware");

// User registration route
router.post("/register", authController.register);

// User login route
router.post("/login", authController.login);

// User profile route, with authentication middleware
router.get("/history", authMiddleware, authController.getProfileWithHistory);

// Exporting the router
module.exports = router;