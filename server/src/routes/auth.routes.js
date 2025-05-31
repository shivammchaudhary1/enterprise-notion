import express from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

// Auth routes
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", protect, getMe);

export default authRouter;
