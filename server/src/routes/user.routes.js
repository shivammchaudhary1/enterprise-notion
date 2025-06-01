import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  updateUserPreferences,
  getUserPreferences,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Profile routes
router.route("/profile").get(getUserProfile).put(updateUserProfile);

// Preferences routes
router.route("/preferences").get(getUserPreferences).put(updateUserPreferences);

export default router;
