import express from "express";
import rateLimit from "express-rate-limit";
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  validateRegistration,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  authRateLimitConfig,
} from "../middleware/validation.middleware.js";

const authRouter = express.Router();

// Create rate limiter for auth routes
const authRateLimit = rateLimit(authRateLimitConfig);

// Auth routes with validation and rate limiting
authRouter.post("/register", authRateLimit, validateRegistration, register);
authRouter.post("/login", authRateLimit, validateLogin, login);
authRouter.post(
  "/forgot-password",
  authRateLimit,
  validateForgotPassword,
  forgotPassword
);
authRouter.post(
  "/reset-password/:token",
  authRateLimit,
  validateResetPassword,
  resetPassword
);
authRouter.get("/me", protect, getMe);

export default authRouter;
