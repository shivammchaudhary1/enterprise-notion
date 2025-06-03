import express from "express";
import { processMeetingTranscript } from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/meeting-notes", protect, processMeetingTranscript);

export default router;
