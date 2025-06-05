import express from "express";
import {
  processMeetingTranscript,
  generateDocumentTags,
  generateSuggestion,
} from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/meeting-notes", protect, processMeetingTranscript);
router.post("/generate-tags", protect, generateDocumentTags);
router.post("/generate-suggestion", protect, generateSuggestion);

export default router;
