import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import assistantController from "../controllers/assistant.controller.js";

const router = express.Router();

// POST /api/assistant/query
router.post("/query", protect, assistantController.query);

export default router;
