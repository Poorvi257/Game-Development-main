// userRoutes.js
// This module defines routes for user management in the application.
// It uses Express Router to define endpoints for register, login and fetch,
// user profiles

const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");

// User registration route
router.post("/register", authController.register);

// User login route
router.post("/login", authController.login);

// Exporting the router
module.exports = router;