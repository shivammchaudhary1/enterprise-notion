import express from "express";
import {
  processMeetingTranscript,
  generateDocumentTags,
} from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/meeting-notes", protect, processMeetingTranscript);
router.post("/generate-tags", protect, generateDocumentTags);

export default router;
