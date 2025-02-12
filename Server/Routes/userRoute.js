import express from "express";
import {
  getUserProfile,
  login,
  logout,
  register,
  updateProfile,
} from "../Controller/userController.js";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import upload from "../Utils/multer.js";

const router = express.Router();

// Register a new user
router.route("/register").post(register);

// Login user
router.route("/login").post(login);

// Logout user
router.route("/logout").get(logout);

// Get user profile (requires authentication)
router.route("/profile").get(isAuthenticated, getUserProfile);

// Update user profile (requires authentication and supports file upload)
router
  .route("/profile/update")
  .put(isAuthenticated, upload.single("profilePhoto"), updateProfile);

export default router;
